use std::io;

use serde::Serialize;
use thiserror::Error;
use tokio_util::{bytes::{Buf, BytesMut}, codec};
use log::warn;

#[derive(Debug, PartialEq, Eq, Serialize)]
pub enum Command {
    PanTiltAbsolute{
        pan: u16,
        tilt: u16,
        pan_speed: u8,
        tilt_speed: u8,
    },
    PanTiltRelative{
        pan: u16,
        tilt: u16,
        pan_speed: u8,
        tilt_speed: u8,
    },
    ZoomAbsolute(u16),
    Cancel(u8),
}

/// All messages a camera can send to the controller
#[derive(Debug, PartialEq, Eq)]
pub enum CameraMessage {
    Response(ResponseMessage),
    Completion(CompletionMessage),
}

impl CameraMessage {
    fn accepted(socket: u8) -> Self {
        Self::Response(ResponseMessage::Accepted(socket))
    }

    fn syntax_error() -> Self {
        Self::Response(ResponseMessage::SyntaxError)
    }

    fn command_buffer_full() -> Self {
        Self::Response(ResponseMessage::CommandBufferFull)
    }

    fn no_socket(socket: u8) -> Self {
        Self::Response(ResponseMessage::NoSocket(socket))
    }

    fn completed(socket: u8) -> Self {
        Self::Completion(CompletionMessage { socket, kind: CompletionMessageKind::Completed })
    }

    fn cancelled(socket: u8) -> Self {
        Self::Completion(CompletionMessage { socket, kind: CompletionMessageKind::Cancelled })
    }

    fn command_not_executable(socket: u8) -> Self {
        Self::Completion(CompletionMessage { socket, kind: CompletionMessageKind::CommandNotExecutable })
    }
}

/// Messages the camera can send to the controller in direct response to a command
#[derive(Debug, PartialEq, Eq)]
pub enum ResponseMessage {
    Accepted(u8),
    SyntaxError,
    CommandBufferFull,
    NoSocket(u8),
}

#[derive(Debug, PartialEq, Eq)]
/// Messages the camera can send the the controller in response to a command finishing execution
pub struct CompletionMessage {
    pub socket: u8,
    pub kind: CompletionMessageKind,
}

#[derive(Debug, PartialEq, Eq)]
pub enum CompletionMessageKind {
    Cancelled,
    Completed,
    CommandNotExecutable,
}

#[derive(Debug, Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] io::Error),
}

pub struct Codec {
    cam_id: u8,
}

impl Codec {
    pub fn new(cam_id: u8) -> Self {
        Self { cam_id }
    }
}

impl codec::Decoder for Codec {
    type Item = CameraMessage;
    type Error = Error;

    fn decode(&mut self, src: &mut BytesMut) -> Result<Option<Self::Item>, Self::Error> {
        let expected_first_byte = (self.cam_id + 8).unbounded_shl(4);
        match src.first() {
            None => return Ok(None),
            Some(a) if *a == expected_first_byte => {},
            Some(_) => {
                match src.iter().position(|&b| b == expected_first_byte) {
                    Some(a) => {
                        src.advance(a);
                    }
                    None => {
                        src.clear();
                        return Ok(None);
                    }
                }
            }
        }
        let command = match src.iter().position(|&b| b == 0xff) {
            None => return Ok(None),
            Some(b) => src.split_to(b + 1),
        };

        let decoded = match *command.as_ref() {
            [_, channel @ 0x40..=0x4f, 0xff] => CameraMessage::accepted(channel & 0x0f),
            [_, channel @ 0x50..=0x5f, 0xff] => CameraMessage::completed(channel & 0x0f),
            [_, 0x60, 0x02, 0xff] => CameraMessage::syntax_error(),
            [_, 0x60, 0x03, 0xff] => CameraMessage::command_buffer_full(),
            [_, channel @ 0x60..=0x6f, 0x04, 0xff] => CameraMessage::cancelled(channel & 0x0f),
            [_, channel @ 0x60..=0x6f, 0x05, 0xff] => CameraMessage::no_socket(channel & 0x0f),
            [_, channel @ 0x60..=0x6f, 0x41, 0xff] => CameraMessage::command_not_executable(channel & 0x0f),
            _ => {
                warn!("unknown response from camera: {:x?}", command.as_ref());
                return self.decode(src);
            }
        };

        Ok(Some(decoded))
    }
}

impl codec::Encoder<Command> for Codec {
    type Error = Error;

    fn encode(&mut self, item: Command, dst: &mut BytesMut) -> Result<(), Self::Error> {
        match item {
            Command::PanTiltAbsolute{pan, tilt, pan_speed, tilt_speed} => {
                let p = u16_to_nibbles(pan);
                let t = u16_to_nibbles(tilt);
                dst.extend_from_slice(&[
                    0x80 | self.cam_id, 0x01,
                    0x06, 0x02,
                    pan_speed, tilt_speed,
                    p[0], p[1], p[2], p[3],
                    t[0], t[1], t[2], t[3],
                    0xFF
                ]);
            }
            Command::PanTiltRelative{pan, tilt, pan_speed, tilt_speed} => {
                let p = u16_to_nibbles(pan);
                let t = u16_to_nibbles(tilt);
                dst.extend_from_slice(&[
                    0x80 | self.cam_id, 0x01,
                    0x06, 0x03,
                    pan_speed, tilt_speed,
                    p[0], p[1], p[2], p[3],
                    t[0], t[1], t[2], t[3],
                    0xFF
                ]);
            }
            Command::ZoomAbsolute(zoom) => {
                let z = u16_to_nibbles(zoom);
                dst.extend_from_slice(&[
                    0x80 | self.cam_id, 0x01,
                    0x04, 0x47,
                    z[0], z[1], z[2], z[3],
                    0xFF
                ]);
            }
            Command::Cancel(socket) => {
                dst.extend_from_slice(&[
                    0x80 | self.cam_id,
                    0x20 | (socket & 0x0f),
                    0xFF
                ]);
            }
        }
        Ok(())
    }
}

const fn u16_to_nibbles(v: u16) -> [u8; 4] {
    let [v1, v2] = v.to_be_bytes();
    [(v1 >> 4) & 0x0f, v1 & 0x0f, (v2 >> 4) & 0x0f, v2 & 0x0f]
}

#[cfg(test)]
mod tests {
    use tokio_util::{bytes::BytesMut, codec::{Decoder, Encoder}};

    use super::*;

    macro_rules! serialize_tests {
        ($name:ident, $command:expr, $expected:expr) => {
            #[test]
            fn $name() {
                let mut codec = Codec::new(1);
                let mut dst = BytesMut::new();
                codec.encode($command, &mut dst).unwrap();
                assert_eq!(dst, hex::decode($expected.replace(' ', "")).unwrap());
            }
        };

        ($name:ident, $command:expr, $expected:expr, $($ex_name:ident, $ex_command:expr, $ex_expected:expr),+) => {
            serialize_tests!($name, $command, $expected);
            serialize_tests!($($ex_name, $ex_command, $ex_expected),+);
        };
    }

    serialize_tests!(
        serialize_pan_tilt_absolute,
        Command::PanTiltAbsolute {
            pan: 0xaaaa,
            tilt: 0xbbbb,
            pan_speed: 0xcc,
            tilt_speed: 0xdd,
        },
        "81 01 06 02 cc dd 0a 0a 0a 0a 0b 0b 0b 0b ff",

        serialize_pan_tilt_relative,
        Command::PanTiltRelative {
            pan: 0xaaaa,
            tilt: 0xbbbb,
            pan_speed: 0xcc,
            tilt_speed: 0xdd,
        },
        "81 01 06 03 cc dd 0a 0a 0a 0a 0b 0b 0b 0b ff",

        serialize_zoom_absolute,
        Command::ZoomAbsolute(0xabcd),
        "81 01 04 47 0a 0b 0c 0d ff"
    );

    macro_rules! deserialize_tests {
        ($name:ident, $bytes:expr, $expected:expr) => {
            #[test]
            fn $name() {
                let mut codec = Codec::new(1);
                let mut src = BytesMut::from(hex::decode($bytes.replace(' ', "")).unwrap().as_slice());
                println!("full input: {src:x?}");
                let item = codec.decode(&mut src).unwrap();
                println!("remaining input: {src:x?}");
                assert_eq!(item, $expected);
            }
        };

        ($name:ident, $bytes:expr, $expected:expr, $($ex_name:ident, $ex_bytes:expr, $ex_expected:expr),+) => {
            deserialize_tests!($name, $bytes, $expected);
            deserialize_tests!($($ex_name, $ex_bytes, $ex_expected),+);
        };
    }

    deserialize_tests!(
        deserialize_accepted,
        "90 41 ff",
        Some(CameraMessage::accepted(1)),

        deserialize_completed,
        "90 51 ff",
        Some(CameraMessage::completed(1)),

        deserialize_syntax_error,
        "90 60 02 ff",
        Some(CameraMessage::syntax_error()),

        deserialize_command_buffer_full,
        "90 60 03 ff",
        Some(CameraMessage::command_buffer_full()),

        deserialize_cancelled,
        "90 61 04 ff",
        Some(CameraMessage::cancelled(1)),

        deserialize_no_socket,
        "90 61 05 ff",
        Some(CameraMessage::no_socket(1)),

        deserialize_command_not_executable,
        "90 61 41 ff",
        Some(CameraMessage::command_not_executable(1))
    );
}
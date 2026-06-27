import { useContext, useState } from 'react';
import { CameraProvider } from './CameraProvider';
import { Camera } from './ffi';
import Button from './Button';

export type PresetButtonProps = {}; // eslint-disable-line @typescript-eslint/no-empty-object-type

const goToPosition = async (camera: Camera, ptz: [number, number, number]) => {
  const [pan, tilt, zoom] = ptz;
  await Promise.all([
    camera.panTiltAbsolute(pan, tilt),
    camera.zoomAbsolute(zoom),
  ]);
};

export function PresetButton({ children }: React.PropsWithChildren<PresetButtonProps>) {
  const [presetPosition, setPresetPosition] = useState<[number, number, number] | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const camera = useContext(CameraProvider);

  return (
    <Button
      onClick={async () => {
        if (presetPosition) {
          setInProgress(true);
          try {
            await goToPosition(camera, presetPosition);
          } finally {
            setInProgress(false);
          }
        }
      }}
      onLongPress={async () => {
        const [[pan, tilt], zoom] = await Promise.all([
          camera.queryPanTiltPosition(),
          camera.queryZoomPosition(),
        ]);
        setPresetPosition([pan, tilt, zoom]);
      }}
      disabled={inProgress}
    >
      {children}
    </Button>
  );
}

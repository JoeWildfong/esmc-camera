import { useContext, useState } from 'react';
import Button from './Button';
import { CameraProvider } from './CameraProvider';
import { CameraCommand } from './ffi';

export type CommandButtonProps = {
  command: CameraCommand,
};

export function CommandButton({ command, children }: React.PropsWithChildren<CommandButtonProps>) {
  const [inProgress, setInProgress] = useState(false);
  const camera = useContext(CameraProvider);

  return (
    <Button
      onClick={async () => {
        setInProgress(true);
        try {
          await camera.waitForCommand(command);
        } finally {
          setInProgress(false);
        }
      }}
      disabled={inProgress}
    >
      {children}
    </Button>
  );
}

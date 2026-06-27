import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
    'type' | 'onMouseDown' | 'onMouseUp' | 'onClick' | 'onTouchStart' | 'onTouchEnd'
> {
  onLongPress?: () => void;
  onClick: () => void;
  children: React.ReactNode;
  pressDelay?: number;
}

type ButtonEvent = React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  onLongPress = () => {},
  onClick,
  children,
  pressDelay = 1000,
  style,
  ...props
}) => {
  const timer = useRef<number>(0);
  const [isLongPress, setIsLongPress] = useState<boolean>(false);

  useEffect(() => () => {
    clearTimeout(timer.current);
  }, []);

  const onPress = useCallback((event: ButtonEvent) => {
    if (event.type === 'touchstart') {
      // Prevent default ghost clicks on touch devices
      event.preventDefault();
    }
    setIsLongPress(false);

    timer.current = setTimeout(() => {
      if (onLongPress) {
        // Trigger the long press action
        setIsLongPress(true);
        onLongPress();
      }
    }, pressDelay);
  }, [pressDelay, onClick, onLongPress]);

  const onRelease = useCallback(() => {
    clearTimeout(timer.current);
    if (!isLongPress) {
      onClick();
    }
    setIsLongPress(false);
  }, [isLongPress, onClick]);

  const onLeave = useCallback(() => {
    clearTimeout(timer.current);
    setIsLongPress(false);
  }, []);

  const buttonStyle = {
    ...style,
    background: isLongPress ? 'lightgreen' : style?.background,
  };

  return (
    <button
      {...props}
      type="button"
      onMouseDown={onPress}
      onTouchStart={onPress}
      onMouseUp={onRelease}
      onTouchEnd={onRelease}
      onMouseLeave={onLeave}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

export default Button;

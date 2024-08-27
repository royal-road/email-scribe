import React, { useState, useEffect } from 'react';
import { Button, ButtonProps } from '../ui/button';

interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
  onConfirm: () => void;
  confirmText?: string;
  initialText?: string;
  confirmVariant?: ButtonProps['variant'];
  initialVariant?: ButtonProps['variant'];
  confirmTimeout?: number;
  confirmIcon?: React.ReactNode;
  initialIcon?: React.ReactNode;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  onConfirm,
  confirmText = 'Confirm',
  initialText = 'Delete',
  confirmVariant = 'destructive',
  initialVariant = 'outline',
  confirmTimeout = 4000,
  confirmIcon,
  initialIcon,
  ...buttonProps
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    if (isConfirming) {
      timeoutId = window.setTimeout(() => {
        setIsConfirming(false);
      }, confirmTimeout);
    }
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [isConfirming, confirmTimeout]);

  const handleClick = () => {
    if (isConfirming) {
      onConfirm();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  return (
    <Button
      {...buttonProps}
      onClick={handleClick}
      variant={isConfirming ? confirmVariant : initialVariant}
    >
      {isConfirming ? confirmIcon : initialIcon}
      {isConfirming ? confirmText : initialText}
    </Button>
  );
};

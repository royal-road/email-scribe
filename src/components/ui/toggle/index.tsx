import React, { useState } from 'react';
import { Button, ButtonProps } from '../button';

export interface ToggleButtonProps extends Omit<ButtonProps, 'onClick'> {
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive: initialIsActive = false,
  onToggle,
  className,
  children,
  ...props
}) => {
  const [isActive, setIsActive] = useState(initialIsActive);

  const handleClick = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    onToggle?.(newIsActive);
  };

  const toggleButtonClasses = [
    'toggle-button',
    isActive ? 'toggle-button--active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button
      className={toggleButtonClasses}
      onClick={handleClick}
      aria-pressed={isActive}
      {...props}
    >
      {children}
    </Button>
  );
};

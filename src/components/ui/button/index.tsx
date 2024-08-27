import React from 'react';

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'primary'
  | 'ghost'
  | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const Comp = 'button';
    const buttonClasses = [
      'button',
      `button--${variant}`,
      `button--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <Comp className={buttonClasses} ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button };

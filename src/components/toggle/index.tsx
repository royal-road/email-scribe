import React from 'react';
import * as RadixToggle from '@radix-ui/react-toggle';

export interface ToggleProps extends RadixToggle.ToggleProps {
  className?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, ...props }, ref) => {
    const toggleClasses = ['toggle', className].filter(Boolean).join(' ');

    return <RadixToggle.Root className={toggleClasses} ref={ref} {...props} />;
  }
);

Toggle.displayName = 'Toggle';

export { Toggle };

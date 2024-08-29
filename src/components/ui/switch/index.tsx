import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, ...props }, ref) => (
  <div className='switch-container'>
    {label && (
      <label className='switch-label' htmlFor={props.id}>
        {label}
      </label>
    )}
    <SwitchPrimitive.Root
      className={`switch-root ${className || ''}`}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb className='switch-thumb' />
    </SwitchPrimitive.Root>
  </div>
));

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Button } from '../button';

// - So, popover gets appended to body by default, but that causes css issues since it has to
//  be encapsulated within .newsletterDesigner.
// - To remedy that, I added a container node for portal to render on, but issue is that it's
// not avaliable on the first render, making it so the popover is missing UI.
// - Hence, I've added this state and useEffect to reInitialize popover with right container once
// it's available.
const spaClassName = '.newsletterDesigner';
const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    showClose?: boolean;
  }
>(({ className, showClose = true, children, ...props }, ref) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const spaContainer = document.querySelector(spaClassName);
    if (spaContainer) {
      setContainer(spaContainer as HTMLElement);
    }
  }, []);

  if (!container) {
    return null; // Or return a loading state
  }

  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        ref={ref}
        className={cn('PopoverContent', className || '')}
        {...props}
      >
        {children}
        {showClose && (
          <PopoverPrimitive.Close
            className='PopoverClose'
            aria-label='Close'
            asChild
          >
            <Button
              variant='outline'
              size='icon'
              style={{ borderRadius: '100%', padding: '0.25rem' }}
            >
              <X />
            </Button>
          </PopoverPrimitive.Close>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };

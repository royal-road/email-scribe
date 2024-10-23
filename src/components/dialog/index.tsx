import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@lib/utils';
import { Button } from '@components/button';
import { useConfig } from '@/contexts/ConfigContext';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const determinedContainer = useConfig().containerRef?.current;

  React.useEffect(() => {
    if (determinedContainer) setContainer(determinedContainer);
  }, [determinedContainer]);

  if (!container) {
    return null; // Or return a loading state
  }

  return <DialogPrimitive.Portal container={container} {...props} />;
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className = '', ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('DialogOverlay', className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showClose?: boolean;
  }
>(({ className = '', children, showClose = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn('DialogContent', className)}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close
          className='DialogClose'
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
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('DialogHeader', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('DialogFooter', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className = '', ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('DialogTitle', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className = '', ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('DialogDescription', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

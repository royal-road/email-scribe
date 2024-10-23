import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { Button } from './button';
import { CodeEditor } from './codeEditor';

interface CodeEditorDialogProps {
  icon?: React.ReactNode;
  triggerText: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}

const CodeEditorDialog: React.FC<CodeEditorDialogProps> = ({
  icon,
  triggerText,
  title,
  value,
  onChange,
  placeholder,
  disabled = false,
  readonly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleChange = useCallback((newValue: string) => {
    // console.log('newValue', newValue);
    setLocalValue(newValue);
  }, []);

  const handleSubmit = useCallback(() => {
    onChange(localValue);
    setIsOpen(false);
  }, [localValue, onChange]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button title={triggerText} style={{ gap: '0.5rem', width: '100%' }}>
          {icon}
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          width: '90%',
          maxWidth: '90%',
          maxHeight: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          justifyContent: 'center',
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription style={{ display: 'none' }}>
          {title}
        </DialogDescription>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <CodeEditor
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            readonly={readonly}
          />
        </div>
        <DialogFooter>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5rem',
              justifyContent: 'end',
              alignItems: 'center',
              height: '3rem',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            <Button onClick={() => setIsOpen(false)} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CodeEditorDialog;

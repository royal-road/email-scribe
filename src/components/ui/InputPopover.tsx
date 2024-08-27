import React, { useState, KeyboardEvent } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './button';

interface InputPopoverProps {
  icon?: React.ReactNode;
  triggerText: string;
  placeholder: string;
  onSubmit: (value: string) => void;
}

const InputPopover: React.FC<InputPopoverProps> = ({
  icon,
  triggerText,
  placeholder,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue('');
      setIsOpen(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button title={triggerText} style={{ gap: '0.5rem', width: '100%' }}>
          {icon}
          {triggerText}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        showClose={false}
        className='InputPopover'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1.5rem',
          paddingTop: '0.5rem',
        }}
      >
        <h3 style={{ margin: '0' }}>{triggerText}</h3>
        <input
          style={{ width: '99%' }}
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
        />
        <Button onClick={handleSubmit} style={{ width: '100%' }}>
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default InputPopover;

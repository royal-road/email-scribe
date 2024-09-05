import React, { useState, useCallback } from 'react';
import { WidgetProps } from '@rjsf/utils';
import debounce from 'debounce';

export const ColorPickerWidget: React.FC<WidgetProps> = (props) => {
  const { onChange, value, id } = props;
  const [color, setColor] = useState(value || '#000000');

  const debouncedOnChange = useCallback(
    debounce((newColor: string) => {
      onChange(newColor);
    }, 300),
    [onChange]
  );

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    debouncedOnChange(newColor);
  };

  return (
    <div>
      <input id={id} type='color' value={color} onChange={handleColorChange} />
    </div>
  );
};

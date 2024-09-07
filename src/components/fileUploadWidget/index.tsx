import React, { useCallback } from 'react';
import { WidgetProps } from '@rjsf/utils';
import { useConfig } from '@/contexts/ConfigContext';

export const FileUploadWidget: React.FC<WidgetProps> = (props) => {
  const { onChange, options, id } = props;
  const { apiUrl, basePath } = useConfig();
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      // Add width to formData if it exists in options
      if (options && options.width) {
        formData.append('width', options.width.toString());
      }

      try {
        const response = await fetch(`${apiUrl}/${basePath}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        const data = await response.json();
        onChange(data.url);
      } catch (error) {
        console.error('Error uploading file:', error);
        // You might want to show an error message to the user here
      }
      event.target.value = '';
    },
    [onChange, options]
  );

  return (
    <div>
      <input
        id={id}
        type='file'
        onChange={handleFileUpload}
        accept={(options.accept as string) || 'image/*'}
      />
      {props.value && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1rem',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}
          onClick={() => {
            const input = document.getElementById(id);
            if (input) {
              input.click();
            }
          }}
        >
          {/* <p>Uploaded file: {props.value}</p> */}
          <img
            src={props.value}
            alt='Uploaded file'
            style={{ maxWidth: '200px' }}
          />
        </div>
      )}
    </div>
  );
};

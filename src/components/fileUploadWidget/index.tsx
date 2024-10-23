import React, { useCallback, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import { useConfig } from '@/contexts/ConfigContext';

export const FileUploadWidget: React.FC<WidgetProps> = (props) => {
  const { onChange, options, id } = props;
  const { apiUrl, basePath } = useConfig();
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState(props.value);

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
    <div className='FileUploadWidget'>
      <div className='input-toggle'>
        <button
          type='button'
          onClick={() => setInputType('file')}
          className={inputType === 'file' ? 'active' : ''}
        >
          Upload File
        </button>
        <button
          type='button'
          onClick={() => setInputType('url')}
          className={inputType === 'url' ? 'active' : ''}
        >
          Enter URL
        </button>
      </div>

      {inputType === 'file' ? (
        <input
          id={id}
          type='file'
          onChange={handleFileUpload}
          accept={(options.accept as string) || 'image/*'}
        />
      ) : (
        <div className='urlBar'>
          <input
            type='url'
            id={id}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder='Enter image URL'
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange(urlInput);
            }}
          >
            Submit
          </button>
        </div>
      )}

      {props.value && (
        <div
          className='image-preview'
          onClick={() => {
            const input = document.getElementById(id);
            if (input && inputType === 'file') {
              input.click();
            }
          }}
        >
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

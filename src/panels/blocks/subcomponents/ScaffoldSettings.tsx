import { Button } from '../../../ui/button';
import { Settings2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
// import Form from "@rjsf/core";
// import validator from "@rjsf/validator-ajv8";
import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { BlockState } from '..';

interface BlockGlobalSettingsProps {
  scaffoldSettings: BlockState;
  setScalfoldSettings?: React.Dispatch<React.SetStateAction<BlockState>>;
}

export const BlockGlobalSettings: React.FC<BlockGlobalSettingsProps> = ({
  scaffoldSettings,
  setScalfoldSettings,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='default'
          size='icon'
          style={{
            padding: 0,
            minWidth: '3rem',
            maxWidth: '3rem',
            minHeight: '3rem',
            maxHeight: '3rem',
          }}
        >
          <Settings2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? 'bottom' : 'right'}
        style={{
          width: 'fit-content',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}
        className=''
      >
        <h3 style={{ margin: '0' }}>Block Settings</h3>
        <h6>Not Available Right Now...</h6>
        {scaffoldSettings && setScalfoldSettings && ': )'}
        {/* <Form
          schema={scaffoldSettings.instance.schema}
          uiSchema={scaffoldSettings.instance.uiSchema}
          formData={scaffoldSettings.data}
          validator={validator}
          onChange={(e) =>
            setScalfoldSettings({ ...scaffoldSettings, data: e.formData })
          }
          className="blockForm"
          children={true}
        ></Form> */}
      </PopoverContent>
    </Popover>
  );
};

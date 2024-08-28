import { BlockInterface } from '../../../../blocks/setup/Types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import { Button } from '../../../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import ReorderDeleteGroup from './ReorderDeleteGroup';
import { camelToTitleCase } from '../../../../../lib/utils';
import { RegistryWidgetsType } from '@rjsf/utils';
import { FileUploadWidget } from '../../../ui/fileUploadWidget';

interface BlockRendererProps {
  isTop: boolean;
  isBottom: boolean;
  block: BlockInterface;
  data: object;
  onChange: (newData: object) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  isTop,
  isBottom,
  block,
  data,
  onChange,
  onUp,
  onDown,
  onDelete,
  isOpen: open,
  toggleOpen,
}) => {
  const widgets: RegistryWidgetsType = {
    FileWidget: FileUploadWidget,
  };
  return (
    <Collapsible open={open} onOpenChange={toggleOpen}>
      <div
        className='collapsibleTrigger CollapsibleRepository'
        style={{ height: '3rem', paddingTop: '2rem', paddingBottom: '2rem' }}
      >
        <ReorderDeleteGroup
          isBottom={isBottom}
          isTop={isTop}
          onDelete={onDelete}
          onUp={onUp}
          onDown={onDown}
        />
        <span style={{ fontSize: '1.5em' }}>
          {camelToTitleCase(block.meta.label)}
        </span>

        <CollapsibleTrigger asChild>
          <Button variant='outline'>
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CollapsibleTrigger>
      </div>
      {/* This is where the stuff I want to pre-display goes */}
      <CollapsibleContent>
        {/* This css class comes from Collapsible's own styles.scss*/}
        <div className='CollapsibleRepository'>
          <Form
            schema={block.schema}
            uiSchema={block.uiSchema}
            formData={data}
            validator={validator}
            onChange={(e) => onChange(e.formData)}
            liveValidate={true}
            className='blockForm'
            children={true}
            onError={(e) => console.error(e)}
            widgets={widgets}
          ></Form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

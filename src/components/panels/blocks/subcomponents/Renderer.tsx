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
import useFitText from 'use-fit-text';
import useLongPress from '../../../../hooks/useLongPress';
import { useEffect } from 'react';
import { LexicalWidget } from '../../../ui/textAreaWidget';
import { ColorPickerWidget } from '../../../ui/ColorWidget';

interface BlockRendererProps {
  isTop: boolean;
  isBottom: boolean;
  block: BlockInterface;
  data: Record<string, unknown>;
  onChange: (newData: Record<string, unknown>) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
  id: string;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
  inSelectionMode?: boolean;
  isSsr?: string | false;
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
  id,
  isSelected,
  toggleSelect,
  inSelectionMode = false,
  isSsr,
}) => {
  const widgets: RegistryWidgetsType = {
    FileWidget: FileUploadWidget,
    TextareaWidget: LexicalWidget,
    ColorWidget: ColorPickerWidget,
  };

  const { fontSize, ref } = useFitText();
  const blockLongPress = useLongPress(
    () => {
      console.log('HEY!');
      toggleSelect(block.id);
    },
    inSelectionMode ? 5 : 500 // If inSelectionMode, long press is small so that the user can select multiple blocks using shorter clicks
  );

  const generateSsrFormData = (
    data: Record<string, unknown>
  ): Record<string, string> => {
    return Object.keys(data).reduce(
      (acc, key) => {
        return { ...acc, [key]: `%${key}%` };
      },
      {} as Record<string, string>
    );
  };

  useEffect(() => {
    if (isSsr) onChange(generateSsrFormData(block.formData));
  }, [isSsr]); // Do not include onChange in the dependencies array, or it messes up LongPress

  return (
    <Collapsible
      open={open}
      onOpenChange={toggleOpen}
      // onClick={() => {
      //   if (inSelectionMode) toggleSelect(block.id);
      // }}
    >
      <div
        {...blockLongPress}
        className='collapsibleTrigger CollapsibleRepository'
        style={{
          height: '3rem',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          backgroundColor: isSelected ? 'var(--accent)' : 'var(--background)',
          border: isSelected ? '1px solid var(--foreground)' : 'none',
        }}
      >
        <ReorderDeleteGroup
          isBottom={isBottom}
          isTop={isTop}
          onDelete={onDelete}
          onUp={onUp}
          onDown={onDown}
        />
        {/* <span style={{ fontSize: '1.5em' }}> */}
        <div
          ref={ref}
          style={{
            fontSize,
            // height: '3rem',
            width: '20cqw',
            textAlign: 'left',
            // paddingTop: '0.25rem',
            marginLeft: '0.5cqw',
          }}
        >
          {camelToTitleCase(block.meta.label)}
        </div>
        {isSsr && <div className='ssrRibbon'>SSR</div>}

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
          {isSsr !== false && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem',
                alignItems: 'center',
              }}
            >
              <span className='ssrLabel'>SSR ID: {isSsr}</span>
            </div>
          )}
          <Form
            idPrefix={id}
            schema={block.schema}
            uiSchema={block.uiSchema}
            formData={data}
            readonly={isSsr !== false}
            validator={validator}
            onChange={(e) => {
              if (isSsr === false) {
                onChange(e.formData);
              }
            }}
            liveValidate={true}
            className={`blockForm ${isSsr ? 'disabled' : ''}`}
            children={true}
            onError={(e) => console.error(e)}
            widgets={widgets}
          ></Form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

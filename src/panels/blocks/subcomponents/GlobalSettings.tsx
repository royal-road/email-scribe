import { Button } from '@components/button';
import { Settings2, Trash, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@components/popover';
import React, { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { BlockState } from '@/panels/blocks';
import debounce from 'debounce';
import { RegistryWidgetsType, RJSFSchema, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { BlockConfig } from '@/blocks/setup/Base';
import Form from '@rjsf/core';
import { ScrollArea } from '@components/scrollArea';
import { FileUploadWidget } from '@components/fileUploadWidget';
import { Switch } from '@components/switch';
import { ConfirmButton } from '@components/ConfirmButton';
import InputPopover from '@components/InputPopover';
import { LexicalWidget } from '@components/textAreaWidget';
import { ColorPickerWidget } from '@components/ColorWidget';

interface BlockGlobalSettingsProps {
  blocks: BlockState[];
  setBlocks: React.Dispatch<React.SetStateAction<BlockState[]>>;
  indexOfSelectedBlocks: number[];
  removeBlocks: (index: number[]) => void;
  getSsr: (index: string) => string | false;
  setSsr: (blockId: string, ssr: string | false) => void;
  debouncedHistoryUpdate: (blocks: BlockState[]) => void;
}

export const BlockGlobalSettings: React.FC<BlockGlobalSettingsProps> = ({
  blocks,
  setBlocks,
  indexOfSelectedBlocks,
  removeBlocks,
  getSsr,
  setSsr,
  debouncedHistoryUpdate,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mutualSchema, setMutualSchemas] = useState<Partial<BlockConfig>>({});
  const [isUnionMode, setIsUnionMode] = useState(true);
  const widgets: RegistryWidgetsType = {
    FileWidget: FileUploadWidget,
    TextareaWidget: LexicalWidget,
    ColorWidget: ColorPickerWidget,
  };

  function generateDiff(
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>
  ) {
    const diff: Partial<typeof newData> = {};
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
          diff[key] = newData[key];
        }
      }
    }
    return diff;
  }

  const updateGlobalBlockData = useCallback(
    (updates: Array<{ index: number; newData: Record<string, unknown> }>) => {
      setBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.map((block, i) => {
          const update = updates.find((u) => u.index === i);
          if (update && getSsr(block.instance.id) === false) {
            const diff = generateDiff(block.data, update.newData);
            const updatedData = { ...block.data, ...diff };
            block.instance.updateFormData(updatedData);
            block.cachedHtml = block.instance.generateHTML(block.instance.id);

            return { ...block, data: updatedData };
          }
          return block;
        });
        debouncedHistoryUpdate(newBlocks);
        return newBlocks;
      });
    },
    [debouncedHistoryUpdate, getSsr, setBlocks]
  );

  const onGlobalBlockDataChange = debounce(
    (changedField: Record<string, unknown>) => {
      const updates = indexOfSelectedBlocks?.map((index) => ({
        index,
        newData: changedField,
      }));
      updateGlobalBlockData(updates);
    },
    30
  );

  useEffect(() => {
    const schema: RJSFSchema = {
      type: 'object',
      properties: {},
    };
    const uiSchema: UiSchema = {};
    const formData: Record<string, unknown> = {};

    const selectedBlocks = blocks.filter((_block, i) =>
      indexOfSelectedBlocks?.includes(i)
    );

    if (selectedBlocks.length > 0) {
      let commonProperties: Set<string>;

      if (isUnionMode) {
        // Union mode: include all properties from all selected blocks
        commonProperties = new Set(
          selectedBlocks.flatMap((block) =>
            Object.keys(block.instance.schema.properties)
          )
        );
      } else {
        // Intersection mode: include only properties common to all selected blocks
        commonProperties = new Set(
          Object.keys(selectedBlocks[0].instance.schema.properties)
        );
        for (let i = 0; i < selectedBlocks.length; i++) {
          const blockProperties = new Set(
            Object.keys(selectedBlocks[i].instance.schema.properties)
          );
          for (const prop of commonProperties) {
            if (!blockProperties.has(prop)) {
              commonProperties.delete(prop);
            }
          }
        }
      }
      // console.log('commonProperties', commonProperties);
      // Now add the properties to the schema
      for (const key of commonProperties) {
        // For union mode, use the first block that has this property
        const blockWithProperty = selectedBlocks.find(
          (block) => block.instance.formData && key in block.instance.formData
        );
        if (blockWithProperty) {
          formData[key] = blockWithProperty.instance.formData[key];
        }

        const blockWithSchema = selectedBlocks.find(
          (block) => key in block.instance.schema.properties
        );
        if (blockWithSchema) {
          schema.properties[key] =
            blockWithSchema.instance.schema.properties[key];
          uiSchema[key] = blockWithSchema.instance.uiSchema[key];
        }
      }
    }

    setMutualSchemas({ schema, uiSchema, defaultValues: formData });
  }, [blocks, indexOfSelectedBlocks, isUnionMode]);

  useEffect(() => {
    // console.log('mutualSchema', mutualSchema);
  }, [mutualSchema]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='blockSettingsButton'
          title='Edit multiple blocks'
          variant='default'
          disabled={indexOfSelectedBlocks?.length === 0}
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
        side={isMobile ? 'bottom' : 'bottom'}
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
        <h3 style={{ margin: '0', fontSize: '1.5rem' }}>
          Multiple Block Settings
        </h3>
        {indexOfSelectedBlocks?.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ minWidth: '6rem', textAlign: 'right' }}>
              Overlapping
            </span>
            <Switch checked={isUnionMode} onCheckedChange={setIsUnionMode} />
            <span style={{ minWidth: '6rem', textAlign: 'left' }}>Merged</span>
          </div>
        )}
        <div
          className='text-base'
          style={{ fontSize: '1rem', textAlign: 'center' }}
        ></div>

        {indexOfSelectedBlocks?.length === 1
          ? '1 block selected'
          : `${indexOfSelectedBlocks?.length} blocks selected`}
        {mutualSchema.schema === undefined ||
          mutualSchema.schema.properties === undefined ||
          (Object.keys(mutualSchema.schema.properties).length === 0 && (
            <div
              className='text-danger'
              style={{
                border: '1px dashed var(--destructive)',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                marginTop: '1rem',
              }}
            >
              No overlapping properties
            </div>
          ))}
        <ScrollArea
          className='blocks'
          style={{
            height:
              mutualSchema?.schema?.properties && // This check is very important or else the app will crash
              Object.keys(mutualSchema.schema.properties).length > 0
                ? '30rem'
                : '0',
            minWidth: isMobile ? '20rem' : '22rem',
            padding: 0,
            paddingRight: '1rem',
          }}
        >
          <Form
            schema={mutualSchema.schema}
            uiSchema={mutualSchema.uiSchema}
            formData={mutualSchema.defaultValues}
            validator={validator}
            onChange={(e) => {
              const changedField: Record<string, unknown> = {};
              for (const key in e.formData) {
                if (!mutualSchema?.defaultValues) return;
                if (
                  JSON.stringify(mutualSchema.defaultValues[key]) !==
                  JSON.stringify(e.formData[key])
                ) {
                  changedField[key] = e.formData[key];
                }
              }
              onGlobalBlockDataChange(changedField);
            }}
            className='blockForm'
            children={true}
            widgets={widgets}
          ></Form>
        </ScrollArea>
        <ConfirmButton
          initialIcon={<Trash />}
          confirmIcon={<Trash2 />}
          confirmVariant='destructive'
          variant='outline'
          initialText='Delete Selected'
          confirmText='Are you sure?'
          style={{ width: '100%' }}
          onConfirm={() => removeBlocks(indexOfSelectedBlocks)}
        />
        {indexOfSelectedBlocks.length === 1 &&
          getSsr(blocks[indexOfSelectedBlocks[0]]?.instance?.id) === false && (
            <InputPopover
              triggerText='Enable SSR'
              placeholder='Enter Id of SSR block'
              // Give default value as the Template name and block label
              defaultValue={`${blocks[indexOfSelectedBlocks[0]]?.instance.meta.tags[0]}_${blocks[indexOfSelectedBlocks[0]]?.instance.meta.label}`}
              onSubmit={(value) => {
                setSsr(blocks[indexOfSelectedBlocks[0]]?.instance?.id, value);
              }}
            />
          )}
        {indexOfSelectedBlocks.length === 1 &&
          getSsr(blocks[indexOfSelectedBlocks[0]]?.instance?.id) !== false && (
            <Button
              style={{ width: '100%' }}
              variant='destructive'
              onClick={() => {
                setSsr(blocks[indexOfSelectedBlocks[0]]?.instance?.id, false);
              }}
            >
              Disable SSR
            </Button>
          )}
      </PopoverContent>
    </Popover>
  );
};

import React, { useState } from 'react';
import { Button } from '../../../ui/button';
import { PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
import BlockMeta from '../subcomponents/BlockMeta';
import { ScrollArea } from '../../../ui/scrollArea';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { BlockInterface } from '../../../../blocks/setup/Types';
import { useTemplateManager } from '../hooks/template';
import { propNameToTitle } from '../../../../blocks/parser/utils';

interface BlockSelectorProps {
  addBlock: (type: BlockInterface) => void;
}

export const BlockSelector: React.FC<BlockSelectorProps> = ({ addBlock }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { multipleTemplateQuery } = useTemplateManager(
    import.meta.env.VITE_TEMPLATE_ID.split(',')
  ); // Assuming 'AIO' is your template ID

  const handleTouchStart = (index: number) => {
    setActiveIndex(index);
  };

  const handleTouchEnd = () => {
    setActiveIndex(null);
  };

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
          <PlusCircle />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? 'bottom' : 'right'}
        style={{
          width: `${isMobile ? '85vw' : '50vw'}`,
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}
        className='BlockSelector'
      >
        <h3 style={{ margin: '0' }}>Add Block</h3>
        {multipleTemplateQuery.isLoading && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            Loading blocks...
          </div>
        )}
        {multipleTemplateQuery.isError && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            className='text-danger'
          >
            Error loading blocks: {multipleTemplateQuery.error.message}
          </div>
        )}
        {multipleTemplateQuery.isSuccess && (
          <ScrollArea
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {multipleTemplateQuery.data.map((module, moduleIndex) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap: '1rem',
                  }}
                >
                  <h4 className='text-primary' style={{ margin: '2rem' }}>
                    {propNameToTitle(
                      import.meta.env.VITE_TEMPLATE_ID.split(',')[moduleIndex]
                    )}
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '100%',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      height: '100%',
                      gap: '1rem',
                    }}
                  >
                    {module.map((BlockClass, index) => {
                      const meta = BlockClass.getMeta();
                      return (
                        <div
                          key={`blockMeta${moduleIndex}${index}`}
                          onClick={() => addBlock(new BlockClass())}
                          id={`blockMeta${moduleIndex}${index}`}
                          style={{
                            width: 'fit-content',
                            transform:
                              activeIndex === index ? 'scale(0.98)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                          className='BlockMetaClickable'
                          onTouchStart={() => handleTouchStart(index)}
                          onTouchEnd={handleTouchEnd}
                        >
                          <BlockMeta {...meta} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

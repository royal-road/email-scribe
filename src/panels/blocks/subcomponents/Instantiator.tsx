import React, { useState } from 'react';
import { Button } from '@components/button';
import { PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@components/popover';
import BlockMeta from '@/panels/blocks/subcomponents/Meta';
import { ScrollArea } from '@components/scrollArea';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { BlockInterface } from '@/parser/setup/Types';
import { useTemplateManager } from '@/panels/blocks/hooks/template';
import { propNameToTitle } from '@/parser/utils/parseHelpers';
import { BlockFilter } from '@components/BlockFilter';
import { useConfig } from '@/contexts/ConfigContext';

interface BlockInstantiatorProps {
  addBlock: (type: BlockInterface) => void;
}

export const BlockInstantiator: React.FC<BlockInstantiatorProps> = ({
  addBlock,
}) => {
  const config = useConfig();
  const isMobile = useMediaQuery('(max-width: 768px)');
  // const isMd = useMediaQuery('(max-width: 1124px)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const { multipleTemplateQuery } = useTemplateManager(config); // Assuming 'AIO' is your template ID

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
          height: `${isMobile ? '85vh' : '50vh'}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '0.2rem' : '1rem',
        }}
        className='BlockSelector'
      >
        <h3 style={{ margin: '0', fontSize: isMobile ? '1.5rem' : 'inherit' }}>
          Add Block
        </h3>
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
          <>
            <BlockFilter
              tags={[
                ...new Set(
                  multipleTemplateQuery.data
                    .map((template) =>
                      template.map((module) => module.getMeta().tags).flat()
                    )
                    .flat()
                ),
              ]}
              searchValue={searchInput}
              activeTags={activeTags}
              setActiveTags={setActiveTags}
              setSearchValue={setSearchInput}
              currentTemplates={config.templatesToFetch.map((template) =>
                propNameToTitle(template)
              )}
            />

            <ScrollArea
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {multipleTemplateQuery.data.map((template, templateIndex) => {
                return (
                  <div
                    className='filteredBlockContainer'
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      gap: '1rem',
                    }}
                    key={`template${templateIndex}`}
                  >
                    <h4
                      className=''
                      style={{
                        margin: '0.5rem',
                        fontSize: '1.6rem',
                        // fontWeight: 'bold',
                      }}
                    >
                      {propNameToTitle(config.templatesToFetch[templateIndex])}
                    </h4>
                    {/* <div
                      style={{
                        columnCount: isMobile ? 1 : isMd ? 2 : 3,
                        columnGap: '1rem',
                        width: (!isMobile && '100%') || 'auto',
                      }}
                    > */}
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
                      {(() => {
                        const filteredModules = template.filter(
                          (module) =>
                            (activeTags.length === 0 ||
                              module
                                .getMeta()
                                .tags.some((tag) =>
                                  activeTags.includes(tag)
                                )) &&
                            (searchInput === '' ||
                              module
                                .getMeta()
                                .label.toLowerCase()
                                .includes(searchInput.toLowerCase()))
                        );

                        // if (filteredModules.length === 0) {
                        //   return (
                        //     <div className='no-results-message'>
                        //       No modules match the selected tags.
                        //     </div>
                        //   );
                        // }

                        return filteredModules.map((moduleClass, index) => {
                          const meta = moduleClass.getMeta();
                          return (
                            <div
                              key={`blockMeta${templateIndex}${index}`}
                              onClick={() => addBlock(new moduleClass())}
                              id={`blockMeta${templateIndex}${index}`}
                              style={{
                                marginBottom: '1rem',
                                width: 'fit-content',
                                transform:
                                  activeIndex === index
                                    ? 'scale(0.98)'
                                    : 'none',
                                transition: 'transform 0.2s',
                              }}
                              className='BlockMetaClickable'
                              onTouchStart={() => handleTouchStart(index)}
                              onTouchEnd={handleTouchEnd}
                            >
                              <BlockMeta {...meta} />
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

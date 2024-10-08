import React, { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ScrollArea } from '../scrollArea';

interface BlockFilterProps {
  tags: string[];
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  currentTemplates: string[];
}

export const BlockFilter: React.FC<BlockFilterProps> = ({
  tags,
  setActiveTags,
  setSearchValue,
  currentTemplates,
  activeTags,
  searchValue,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setActiveTags(activeTags);
  }, [activeTags, setActiveTags]);

  useEffect(() => {
    setSearchValue(searchValue);
  }, [searchValue, setSearchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleTagClick = (tag: string) => {
    setActiveTags(
      activeTags.includes(tag)
        ? activeTags.filter((t) => t !== tag)
        : [...activeTags, tag]
    );
  };

  return (
    <div className='TagSelector'>
      <div className='search-container'>
        {/* This makes it so search isn't auto-focused on mobile, making the keyboard cover up the screen */}
        {isMobile && (
          <div style={{ height: 0, width: 0, overflow: 'hidden' }}>
            <input autoFocus={true} />
          </div>
        )}
        <input
          type='text'
          placeholder='Search...'
          value={searchValue}
          onChange={handleSearchChange}
          autoFocus={false}
          className='search-input'
        />
      </div>
      <ScrollArea
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div className='tags'>
          {tags
            .sort((a, b) => a.localeCompare(b))
            .map((tag) => (
              <span
                key={tag}
                className={`tag ${currentTemplates.includes(tag) ? 'template' : ''} ${activeTags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

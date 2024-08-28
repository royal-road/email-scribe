import React, { useEffect } from 'react';

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
        <input
          type='text'
          placeholder='Search...'
          value={searchValue}
          onChange={handleSearchChange}
          className='search-input'
        />
      </div>
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
    </div>
  );
};

import { BlockMetadata } from '../../../../blocks/setup/Types';
import useFitText from 'use-fit-text';
export default function BlockMeta(meta: BlockMetadata) {
  const { fontSize, ref } = useFitText();
  return (
    <div className='BlockMeta'>
      <div
        ref={ref}
        style={{
          fontSize,
          height: 30,
          width: 200,
          textAlign: 'center',
          paddingTop: '0.25rem',
        }}
      >
        {meta.label}
      </div>
      {/* <h4 className='label'>{meta.label}</h4> */}
      <img className='thumbnail' src={meta.thumbnailUrl} alt={meta.label} />
      {/* <p className="description">{meta.description}</p> */}
      {/* <div className="tags">
        {meta.tags.map((tag, index) => (
          <span key={`meta${meta.label}${index}`}>{tag}</span>
        ))}
      </div> */}
    </div>
  );
}

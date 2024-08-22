import { BlockMetadata } from "../../../../blocks/setup/Types";
export default function BlockMeta(meta: BlockMetadata) {
  return (
    <div className="BlockMeta">
      <h4 className="label">{meta.label}</h4>
      <img className="thumbnail" src={meta.thumbnailUrl} alt={meta.label} />
      <p className="description">{meta.description}</p>
      <div className="tags">
        {meta.tags.map((tag, index) => (
          <span key={`meta${meta.label}${index}`}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

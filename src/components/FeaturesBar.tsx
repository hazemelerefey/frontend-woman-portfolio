export default function FeaturesBar({ 
  title, 
  items, 
  reverse = false 
}: { 
  title: string, 
  items: string[],
  reverse?: boolean 
}) {
  return (
    <div className={`features ${reverse ? 'features--reverse' : ''}`} style={{ width: '100%' }}>
      <div 
        className="features__inner" 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(180, 195, 217, 0.2)',
          borderBottom: '1px solid rgba(180, 195, 217, 0.2)',
          padding: '1.5rem 0',
          color: 'var(--gray)',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '1.4rem',
          letterSpacing: '-0.02em',
          width: '100%',
        }}
      >
        <span className="features__title" style={{ paddingRight: '2rem' }}>
          {title}
        </span>
        <div 
          className="features__list"
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {items.map((item, index) => (
            <span key={index} className="features__item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

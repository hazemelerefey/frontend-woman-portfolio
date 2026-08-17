export default function SplitLetters({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i} className="split-letter" style={{ whiteSpace: 'pre' }}>
            {' '}
          </span>
        ) : (
          <span key={i} className="split-letter">
            {char}
          </span>
        )
      )}
    </>
  );
}

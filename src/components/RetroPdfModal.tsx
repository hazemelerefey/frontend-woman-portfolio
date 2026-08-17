'use client';

import { useState, useEffect } from 'react';

export default function RetroPdfModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-pdf-modal', handleOpen);
    return () => window.removeEventListener('open-pdf-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0000aa', // Classic Blue Screen / DOS blue
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Courier New", Courier, monospace',
        padding: '2rem',
      }}
    >
      {/* Background Matrix/Terminal Text */}
      <div
        style={{
          position: 'absolute',
          inset: '4rem',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '1.4rem',
          lineHeight: 1.8,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div>- Clearing redundant components...</div>
        <div>- Enabling high-fidelity prototyping...</div>
        <br />
        <div>**SYSTEM RESPONSE:**</div>
        <br />
        <div>&gt; UI framework outdated — requires immediate patching</div>
        <div>&gt; User engagement flow disrupted — review CTA placements</div>
        <div>&gt; Color hierarchy misconfigured — add vibrant gradients</div>
        <div>&gt; Inconsistent branding — enforce design tokens</div>
        <br />
        <div>ERROR 0xNADNOVA_MISSING: Design principles not found.</div>
        <br />
        <div>Applying **design made by Nadnova x NOWORD**...</div>
        <br />
        <div>- Importing refined design principles</div>
        <div>- Structuring UI components for scalability</div>
        <div>- Injecting visual hierarchy and accessibility compliance</div>
        <div>- Executing performance optimizations for faster load times</div>
        <br />
        <div>**WARNING:** Legacy design detected. **Frontend Women** principles require transition to modern UI/UX methodologies.</div>
      </div>

      {/* Retro Windows 95 Dialog Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '68rem',
          backgroundColor: '#c0c0c0',
          border: '2px solid #ffffff',
          borderRightColor: '#404040',
          borderBottomColor: '#404040',
          boxShadow: '4px 4px 10px rgba(0,0,0,0.5)',
          fontFamily: 'Tahoma, Arial, sans-serif',
          zIndex: 10,
        }}
      >
        {/* Title Bar */}
        <div
          style={{
            background: 'linear-gradient(90deg, #000080, #1084d0)',
            padding: '0.4rem 0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1.4rem',
          }}
        >
          <span>Why keep scrolling? Looking for PDF prices? ¯\_(ツ)_/¯</span>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: '#c0c0c0',
              border: '2px solid #ffffff',
              borderRightColor: '#404040',
              borderBottomColor: '#404040',
              width: '2.2rem',
              height: '2.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 900,
              cursor: 'pointer',
              color: '#000',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Dialog Content */}
        <div style={{ padding: '2.5rem 3rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '1.5rem',
              alignItems: 'end',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#000', marginBottom: '0.6rem' }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  border: '2px solid #808080',
                  borderRightColor: '#ffffff',
                  borderBottomColor: '#ffffff',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  fontSize: '1.4rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#000', marginBottom: '0.6rem' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  border: '2px solid #808080',
                  borderRightColor: '#ffffff',
                  borderBottomColor: '#ffffff',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  fontSize: '1.4rem',
                }}
              />
            </div>

            <button
              onClick={() => {
                alert('Thank you! The PDF will be downloaded shortly.');
                setIsOpen(false);
              }}
              style={{
                backgroundColor: '#b4c3d9',
                border: '2px solid #ffffff',
                borderRightColor: '#404040',
                borderBottomColor: '#404040',
                padding: '0.9rem 2.4rem',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#000',
                cursor: 'pointer',
                outline: '1px dotted #000',
                outlineOffset: '-4px',
              }}
            >
              Get PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

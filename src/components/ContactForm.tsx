'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [topic, setTopic] = useState('Potential Project');
  const [contactInfo, setContactInfo] = useState('');
  const [contactMethod, setContactMethod] = useState('Email');
  const [message, setMessage] = useState('');

  useGSAP(() => {
    gsap.fromTo(
      '.contact__row',
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      style={{ 
        backgroundColor: 'var(--black)',
        paddingTop: '8rem',
        paddingBottom: '12rem',
      }}
    >
      <div className="center-wrap" style={{ width: '100%', maxWidth: '120rem', margin: '0 auto' }}>
        
        {/* Dark Conversational Form Card */}
        <div
          style={{
            backgroundColor: '#121217',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '2.4rem',
            padding: '7rem 6rem',
            color: 'var(--white)',
          }}
        >
          {/* Conversational Line 1 */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '4rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              gap: '1.2rem',
              color: '#d0d0d8',
            }}
          >
            <span>Hey, Shahd! My name is</span>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                minWidth: '22rem',
              }}
            />
            <span>and I am from</span>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                minWidth: '18rem',
              }}
            />
          </div>

          {/* Line 2: Connect about options */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '4rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              color: '#d0d0d8',
            }}
          >
            <span>Let’s connect about</span>
            {['Collaboration', 'Potential Project', 'Networking'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTopic(opt)}
                style={{
                  padding: '1rem 2.4rem',
                  borderRadius: '10rem',
                  border: topic === opt ? '1.5px solid #fff' : '1.5px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: topic === opt ? '#fff' : 'rgba(255, 255, 255, 0.04)',
                  color: topic === opt ? '#000' : 'var(--white)',
                  fontSize: 'clamp(1.4rem, 1.8vw, 2rem)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Line 3: Contact info & Method */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '4rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.2rem',
              color: '#d0d0d8',
            }}
          >
            <span>We can talk in more detail at</span>
            <input
              type="text"
              placeholder="name@website.com"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                minWidth: '26rem',
              }}
            />
            <div style={{ display: 'inline-flex', gap: '1rem' }}>
              {['WhatsApp / LinkedIn', 'Email'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setContactMethod(m)}
                  style={{
                    padding: '0.8rem 2rem',
                    borderRadius: '10rem',
                    border: contactMethod === m ? '1.5px solid #fff' : '1.5px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: contactMethod === m ? '#fff' : 'rgba(255, 255, 255, 0.04)',
                    color: contactMethod === m ? '#000' : 'var(--white)',
                    fontSize: 'clamp(1.3rem, 1.6vw, 1.8rem)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Line 4: In short message */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '6rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              gap: '1.2rem',
              color: '#d0d0d8',
            }}
          >
            <span>In short,</span>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                flex: 1,
                minWidth: '24rem',
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="contact__row" style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                fontSize: 'clamp(3rem, 5.5vw, 6rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                cursor: 'pointer',
                transition: 'opacity 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Send a form ↗
            </button>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          #contact .center-wrap > div {
            padding: 4rem 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

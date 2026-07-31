import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff',
        padding: '6rem 2rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(67, 97, 238, 0.15)',
            border: '1px solid rgba(67, 97, 238, 0.3)',
            borderRadius: '20px',
            padding: '0.3rem 1rem',
            fontSize: '0.85rem',
            color: '#a8b8ff',
            marginBottom: '1.5rem'
          }}>
            Trusted by organizations worldwide
          </div>
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: '800',
            lineHeight: '1.15',
            marginBottom: '1.5rem',
            letterSpacing: '-1px'
          }}>
            Issue, Verify & Share<br />
            <span style={{ color: '#4361ee' }}>Digital Certificates</span><br />
            in Minutes
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#b0b8d0',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6'
          }}>
            A complete platform for creating professional certificates with QR verification, 
            social sharing, and beautiful templates. Perfect for workshops, seminars, 
            conferences, and training programs.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#4361ee',
                color: '#fff',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '10px',
                fontSize: '1.05rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 20px rgba(67, 97, 238, 0.4)'
              }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '1rem 2.5rem',
                borderRadius: '10px',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Sign In
            </button>
          </div>
        </div>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(67, 97, 238, 0.08)' }}></div>
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(67, 97, 238, 0.06)' }}></div>
      </section>

      {/* Stats Bar */}
      <section style={{
        background: '#f8f9ff',
        padding: '2rem',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          textAlign: 'center'
        }}>
          {[
            { num: 'Instant', label: 'Certificate Generation' },
            { num: 'QR Code', label: 'Verification Built-in' },
            { num: '3+', label: 'Professional Templates' },
            { num: '1-Click', label: 'Social Sharing' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4361ee' }}>{stat.num}</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1rem' }}>
            How It Works
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
            Four simple steps to issue professional certificates
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {[
            { step: '01', title: 'Create Event', desc: 'Set up your workshop, seminar, or conference with all details', icon: '📋' },
            { step: '02', title: 'Add Participants', desc: 'Upload a CSV file with participant names, emails, and roles', icon: '👥' },
            { step: '03', title: 'Choose Template', desc: 'Pick from Classic Blue, Elegant Gold, or Modern Teal designs', icon: '🎨' },
            { step: '04', title: 'Generate & Share', desc: 'One click generates certificates with QR codes for all participants', icon: '🚀' },
          ].map((item, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '2rem 1.5rem',
              borderRadius: '12px',
              background: '#fff',
              border: '1px solid #eee',
              transition: 'all 0.3s',
              cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4361ee', marginBottom: '0.5rem' }}>STEP {item.step}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.7rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#888', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', background: '#f8f9ff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1rem' }}>
              Everything You Need
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
              A complete toolkit for certificate management
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              {
                title: 'Beautiful Templates',
                desc: 'Three professionally designed templates with distinct color palettes. Classic Blue for formal events, Elegant Gold for premium awards, Modern Teal for contemporary programs.',
                color: '#4361ee',
                bg: '#eef0ff'
              },
              {
                title: 'QR Code Verification',
                desc: 'Every certificate includes a unique QR code. Anyone can scan it to instantly verify authenticity. No more fake certificates.',
                color: '#7c3aed',
                bg: '#f3e8ff'
              },
              {
                title: 'Social Sharing',
                desc: 'Recipients can share their certificates directly on LinkedIn, Twitter/X, and WhatsApp. One-click sharing with pre-filled messages.',
                color: '#059669',
                bg: '#e8f8f0'
              },
              {
                title: 'Bulk Generation',
                desc: 'Upload a CSV with hundreds of participants and generate all certificates in one click. No manual work, no copy-pasting.',
                color: '#e67e22',
                bg: '#fff5e6'
              },
              {
                title: 'Change Templates Anytime',
                desc: 'Not happy with the design? Switch templates and regenerate all certificates instantly. Old links automatically update.',
                color: '#e94560',
                bg: '#ffeef0'
              },
              {
                title: 'Public Verification Page',
                desc: 'Each certificate has a unique public URL. Recipients, employers, and institutions can verify any certificate without logging in.',
                color: '#1a73e8',
                bg: '#e8f0fe'
              },
            ].map((feature, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #eee',
                transition: 'all 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: feature.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.2rem'
                }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: feature.color }}></div>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.7rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#888', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1rem' }}>
            Professional Templates
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Choose the perfect design for your event
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[
            { name: 'Classic Blue', color: '#3466cc', desc: 'Formal and professional. Perfect for academic certificates, workshops, and official training.' },
            { name: 'Elegant Gold', color: '#b48c3c', desc: 'Premium and distinguished. Ideal for awards, honors, and executive programs.' },
            { name: 'Modern Teal', color: '#009688', desc: 'Fresh and contemporary. Great for tech events, hackathons, and modern conferences.' },
          ].map((tmpl, i) => (
            <div key={i} style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #eee',
              transition: 'all 0.3s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                height: '160px',
                background: `linear-gradient(135deg, ${tmpl.color}22 0%, ${tmpl.color}44 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Mini certificate preview */}
                <div style={{
                  width: '180px',
                  height: '120px',
                  background: '#fff',
                  borderRadius: '6px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${tmpl.color}`
                }}>
                  <div style={{ width: '60%', height: '3px', background: tmpl.color, marginBottom: '8px', borderRadius: '2px' }}></div>
                  <div style={{ fontSize: '0.55rem', fontWeight: '700', color: tmpl.color, marginBottom: '4px' }}>CERTIFICATE</div>
                  <div style={{ width: '80%', height: '2px', background: '#ddd', marginBottom: '4px' }}></div>
                  <div style={{ width: '50%', height: '2px', background: '#ddd', marginBottom: '4px' }}></div>
                  <div style={{ width: '60%', height: '2px', background: '#ddd', marginBottom: '8px' }}></div>
                  <div style={{ width: '30%', height: '1.5px', background: '#aaa' }}></div>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: tmpl.color }}></div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1a1a2e' }}>{tmpl.name}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.5' }}>{tmpl.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '5rem 2rem', background: '#f8f9ff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1rem' }}>
              Perfect For
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[
              { title: 'Workshops', desc: 'Technical and creative workshops' },
              { title: 'Conferences', desc: 'Academic and industry conferences' },
              { title: 'Training Programs', desc: 'Professional development courses' },
              { title: 'Seminars', desc: 'Educational and research seminars' },
              { title: 'Hackathons', desc: 'Coding competitions and events' },
              { title: 'Webinars', desc: 'Online training and sessions' },
              { title: 'Mentoring Programs', desc: 'Structured mentorship certificates' },
              { title: 'Award Ceremonies', desc: 'Recognition and achievements' },
            ].map((uc, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid #eee'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.4rem' }}>{uc.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#999' }}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '1rem' }}>
            Ready to Issue Certificates?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#b0b8d0', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Create your free account and start issuing professional, verifiable certificates in minutes. No credit card required.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#4361ee',
              color: '#fff',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(67, 97, 238, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0d0d1a',
        color: '#666',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <p>JCertifier.io &mdash; Professional Certificate Issuance Platform</p>
        <p style={{ marginTop: '0.5rem', color: '#444' }}>Built with care for educators, trainers, and organizations</p>
      </footer>
    </div>
  );
}

export default Landing;

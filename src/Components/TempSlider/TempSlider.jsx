import React from 'react'

function TempSlider() {
  return (
     
 <div style={{
      width: '100vw',        // Full viewport width
      height: '90vh',       // Full viewport height
      margin: 0,             // Remove any default margins
      padding: 0,            // Remove any default padding
      overflow: 'hidden',    // Prevent scrollbars
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      {/* Main Banner Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',      // Stretches to fill the 100vh parent
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        
        {/* Blue Geometric Background Shape */}
        <div 
          style={{ 
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: '30%',     // Slightly wider for full screen impact
            backgroundColor: '#0000ff',
            zIndex: 10,
            clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)' 
          }}
        />
        
        {/* White Cutout Accent Shape */}
        <div 
          style={{ 
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: '8%',
            backgroundColor: '#f0f0f0',
            zIndex: 20,
            clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' 
          }}
        />

        {/* Text Content Layer */}
        <div style={{
          position: 'relative',
          zIndex: 30,
          paddingLeft: '5vw', // Responsive padding based on width
          width: '70%'
        }}>
          <h1 style={{
            color: '#0000e6',
            fontSize: 'clamp(3rem, 8vw, 6rem)', // Fluid typography
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.05em',
            textTransform: 'uppercase',
            margin: 0
          }}>
            Lucknow's First<br />
            Online Delivery<br />
            Service.
          </h1>

          <h2 style={{
            color: '#0000e6',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 700,
            marginTop: '2rem',
            textTransform: 'uppercase',
          }}>
            Kuch Bhi - Kahin Bhi.
          </h2>

          <p style={{
            color: '#0000e6',
            fontSize: '1.25rem',
            fontWeight: 400,
            textTransform: 'uppercase',
            opacity: 0.8,
            letterSpacing: '0.1em',
            margin: '1rem 0 0 0'
          }}>
            Our service is currently available only in Lucknow
          </p>
        </div>
      </div>
    </div>
  )
}

export default TempSlider;
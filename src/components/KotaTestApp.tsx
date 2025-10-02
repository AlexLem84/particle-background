import { useState, useEffect } from 'react';
import KotaBackground from './KotaBackground';

export default function KotaTestApp() {
  const [variation, setVariation] = useState(0);
  const [darkBackground, setDarkBackground] = useState(false);
  const [noise, setNoise] = useState(true);
  const [customColors, setCustomColors] = useState({
    red: 0.45,
    green: 0.18,
    blue: 0.82
  });
  const [multiColorMode, setMultiColorMode] = useState(false);
  const [colorPalette, setColorPalette] = useState([
    { red: 0.45, green: 0.18, blue: 0.82, name: 'Purple' },
    { red: 0.0, green: 0.5, blue: 1.0, name: 'Blue' },
    { red: 1.0, green: 0.2, blue: 0.4, name: 'Pink' },
    { red: 0.0, green: 0.8, blue: 0.4, name: 'Green' },
    { red: 1.0, green: 0.6, blue: 0.0, name: 'Orange' },
    { red: 0.8, green: 0.0, blue: 0.8, name: 'Magenta' }
  ]);
  const [noiseType, setNoiseType] = useState('gradient');
  const [noiseStrength, setNoiseStrength] = useState(0.5);
  const [savedPresets, setSavedPresets] = useState<Array<{
    id: string;
    name: string;
    settings: any;
    timestamp: number;
  }>>([]);
  
  // Advanced particle controls
  const [particleSpeed, setParticleSpeed] = useState(1.0);
  const [particleSize, setParticleSize] = useState(1.0);
  const [particleCount, setParticleCount] = useState(1000);
  const [particleOpacity, setParticleOpacity] = useState(0.8);
  const [particleTrail, setParticleTrail] = useState(0.5);
  const [mouseInteraction, setMouseInteraction] = useState(true);
  const [interactionRadius, setInteractionRadius] = useState(0.3);
  const [interactionStrength, setInteractionStrength] = useState(0.5);
  const [waveAmplitude, setWaveAmplitude] = useState(1.0);
  const [waveFrequency, setWaveFrequency] = useState(1.0);
  const [spiralSpeed, setSpiralSpeed] = useState(1.0);
  const [orbitRadius, setOrbitRadius] = useState(1.0);
  const [orbitSpeed, setOrbitSpeed] = useState(1.0);
  const [motionType, setMotionType] = useState('organic');
  const [bloomEffect, setBloomEffect] = useState(false);
  const [bloomIntensity, setBloomIntensity] = useState(0.5);
  const [bloomThreshold, setBloomThreshold] = useState(0.5);

  // Debug logging
  useEffect(() => {
    console.log('Custom colors changed:', customColors);
  }, [customColors]);

  useEffect(() => {
    console.log('Noise type changed:', noiseType);
  }, [noiseType]);

  useEffect(() => {
    console.log('Noise strength changed:', noiseStrength);
  }, [noiseStrength]);

  // Load saved presets on component mount
  useEffect(() => {
    const saved = localStorage.getItem('particle-presets');
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved presets:', error);
      }
    }
  }, []);

  // Save current settings as a preset
  const saveCurrentPreset = () => {
    const presetName = prompt('Enter a name for this preset:');
    if (!presetName) return;

    const currentSettings = {
      variation,
      darkBackground,
      noise,
      customColors,
      multiColorMode,
      colorPalette,
      noiseType,
      noiseStrength,
      // Advanced controls
      particleSpeed,
      particleSize,
      particleCount,
      particleOpacity,
      particleTrail,
      mouseInteraction,
      interactionRadius,
      interactionStrength,
      waveAmplitude,
      waveFrequency,
      spiralSpeed,
      orbitRadius,
      orbitSpeed,
      motionType,
      bloomEffect,
      bloomIntensity,
      bloomThreshold
    };

    const newPreset = {
      id: Date.now().toString(),
      name: presetName,
      settings: currentSettings,
      timestamp: Date.now()
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem('particle-presets', JSON.stringify(updatedPresets));
    
    alert(`Preset "${presetName}" saved successfully!`);
  };

  // Load a saved preset
  const loadPreset = (preset: any) => {
    const { settings } = preset;
    setVariation(settings.variation);
    setDarkBackground(settings.darkBackground);
    setNoise(settings.noise);
    setCustomColors(settings.customColors);
    setMultiColorMode(settings.multiColorMode);
    setColorPalette(settings.colorPalette);
    setNoiseType(settings.noiseType);
    setNoiseStrength(settings.noiseStrength);
    
    // Load advanced controls if they exist
    if (settings.particleSpeed !== undefined) setParticleSpeed(settings.particleSpeed);
    if (settings.particleSize !== undefined) setParticleSize(settings.particleSize);
    if (settings.particleCount !== undefined) setParticleCount(settings.particleCount);
    if (settings.particleOpacity !== undefined) setParticleOpacity(settings.particleOpacity);
    if (settings.particleTrail !== undefined) setParticleTrail(settings.particleTrail);
    if (settings.mouseInteraction !== undefined) setMouseInteraction(settings.mouseInteraction);
    if (settings.interactionRadius !== undefined) setInteractionRadius(settings.interactionRadius);
    if (settings.interactionStrength !== undefined) setInteractionStrength(settings.interactionStrength);
    if (settings.waveAmplitude !== undefined) setWaveAmplitude(settings.waveAmplitude);
    if (settings.waveFrequency !== undefined) setWaveFrequency(settings.waveFrequency);
    if (settings.spiralSpeed !== undefined) setSpiralSpeed(settings.spiralSpeed);
    if (settings.orbitRadius !== undefined) setOrbitRadius(settings.orbitRadius);
    if (settings.orbitSpeed !== undefined) setOrbitSpeed(settings.orbitSpeed);
    if (settings.motionType !== undefined) setMotionType(settings.motionType);
    if (settings.bloomEffect !== undefined) setBloomEffect(settings.bloomEffect);
    if (settings.bloomIntensity !== undefined) setBloomIntensity(settings.bloomIntensity);
    if (settings.bloomThreshold !== undefined) setBloomThreshold(settings.bloomThreshold);
  };

  // Delete a preset
  const deletePreset = (presetId: string) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      const updatedPresets = savedPresets.filter(p => p.id !== presetId);
      setSavedPresets(updatedPresets);
      localStorage.setItem('particle-presets', JSON.stringify(updatedPresets));
    }
  };

  // Export current settings as JSON
  const exportSettings = () => {
    const currentSettings = {
      variation,
      darkBackground,
      noise,
      customColors,
      multiColorMode,
      colorPalette,
      noiseType,
      noiseStrength,
      // Advanced controls
      particleSpeed,
      particleSize,
      particleCount,
      particleOpacity,
      particleTrail,
      mouseInteraction,
      interactionRadius,
      interactionStrength,
      waveAmplitude,
      waveFrequency,
      spiralSpeed,
      orbitRadius,
      orbitSpeed,
      motionType,
      bloomEffect,
      bloomIntensity,
      bloomThreshold,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };

    const dataStr = JSON.stringify(currentSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `particle-effect-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Generate website integration code
  const generateIntegrationCode = () => {
    const currentSettings = {
      variation,
      darkBackground,
      noise,
      customColors,
      multiColorMode,
      colorPalette,
      noiseType,
      noiseStrength,
      // Advanced controls
      particleSpeed,
      particleSize,
      particleCount,
      particleOpacity,
      particleTrail,
      mouseInteraction,
      interactionRadius,
      interactionStrength,
      waveAmplitude,
      waveFrequency,
      spiralSpeed,
      orbitRadius,
      orbitSpeed,
      motionType,
      bloomEffect,
      bloomIntensity,
      bloomThreshold
    };

    const code = `<!-- Particle Background Integration -->
<script type="module">
  // Import the KotaBackground component
  import KotaBackground from './path/to/KotaBackground.js';
  
  // Your current settings
  const settings = ${JSON.stringify(currentSettings, null, 2)};
  
  // Apply to your website
  const background = new KotaBackground({
    variation: settings.variation,
    darkBackground: settings.darkBackground,
    noise: settings.noise,
    customColors: settings.customColors,
    colorPalette: settings.colorPalette,
    noiseType: settings.noiseType,
    noiseStrength: settings.noiseStrength
  });
</script>`;
    
    return code;
  };

  useEffect(() => {
    const handleVariationChange = (event: CustomEvent) => {
      setVariation(event.detail.variation);
    };

    window.addEventListener('changeVariation', handleVariationChange as EventListener);
    
    return () => {
      window.removeEventListener('changeVariation', handleVariationChange as EventListener);
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <KotaBackground
        variation={variation}
        scrollTrigger={true}
        scrollTriggerOpacity={0.5}
        darkBackground={darkBackground}
        position="fixed"
        noise={noise}
        customColors={multiColorMode ? null : customColors}
        colorPalette={multiColorMode ? colorPalette : null}
        noiseType={noiseType}
        noiseStrength={noiseStrength}
        // Advanced controls
        particleSpeed={particleSpeed}
        particleSize={particleSize}
        particleCount={particleCount}
        particleOpacity={particleOpacity}
        particleTrail={particleTrail}
        mouseInteraction={mouseInteraction}
        interactionRadius={interactionRadius}
        interactionStrength={interactionStrength}
        waveAmplitude={waveAmplitude}
        waveFrequency={waveFrequency}
        spiralSpeed={spiralSpeed}
        orbitRadius={orbitRadius}
        orbitSpeed={orbitSpeed}
        motionType={motionType}
        bloomEffect={bloomEffect}
        bloomIntensity={bloomIntensity}
        bloomThreshold={bloomThreshold}
      />
      
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '100vh',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '1rem',
        pointerEvents: 'auto'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1rem', 
          textAlign: 'center',
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}>
          Particle Controls
        </h2>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {[0, 1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => setVariation(v)}
              style={{
                padding: '0.5rem 1rem',
                background: v === variation ? '#4CAF50' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseOver={(e) => {
                if (v !== variation) {
                  e.currentTarget.style.background = '#1976D2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (v !== variation) {
                  e.currentTarget.style.background = '#2196F3';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              Variation {v}
            </button>
          ))}
        </div>
        
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setDarkBackground(!darkBackground)}
            style={{
              padding: '0.5rem 1rem',
              background: darkBackground ? '#FF5722' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {darkBackground ? 'Light Background' : 'Dark Background'}
          </button>
          
          <button
            onClick={() => setNoise(!noise)}
            style={{
              padding: '0.5rem 1rem',
              background: noise ? '#FF5722' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {noise ? 'No Noise' : 'Add Noise'}
          </button>
        </div>
        
        {/* Color Controls */}
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1rem',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            Color Controls
          </h3>
          
          {/* Color Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '1rem',
            justifyContent: 'center'
          }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#fff',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="colorMode"
                checked={!multiColorMode}
                onChange={() => setMultiColorMode(false)}
                style={{ marginRight: '0.5rem' }}
              />
              Single Color
            </label>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#fff',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="colorMode"
                checked={multiColorMode}
                onChange={() => setMultiColorMode(true)}
                style={{ marginRight: '0.5rem' }}
              />
              Multi Color
            </label>
          </div>
          
          {!multiColorMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Red Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{
                  minWidth: '40px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#ff6b6b'
                }}>
                  Red
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={customColors.red}
                  onChange={(e) => setCustomColors(prev => ({ ...prev, red: parseFloat(e.target.value) }))}
                  style={{
                    flex: 1,
                    height: '6px',
                    background: `linear-gradient(to right, #000, #ff0000)`,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  minWidth: '40px',
                  fontSize: '12px',
                  color: '#ff6b6b',
                  fontWeight: '600'
                }}>
                  {Math.round(customColors.red * 100)}%
                </span>
              </div>

              {/* Green Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{
                  minWidth: '40px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#4caf50'
                }}>
                  Green
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={customColors.green}
                  onChange={(e) => setCustomColors(prev => ({ ...prev, green: parseFloat(e.target.value) }))}
                  style={{
                    flex: 1,
                    height: '6px',
                    background: `linear-gradient(to right, #000, #00ff00)`,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  minWidth: '40px',
                  fontSize: '12px',
                  color: '#4caf50',
                  fontWeight: '600'
                }}>
                  {Math.round(customColors.green * 100)}%
                </span>
              </div>

              {/* Blue Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{
                  minWidth: '40px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#2196f3'
                }}>
                  Blue
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={customColors.blue}
                  onChange={(e) => setCustomColors(prev => ({ ...prev, blue: parseFloat(e.target.value) }))}
                  style={{
                    flex: 1,
                    height: '6px',
                    background: `linear-gradient(to right, #000, #0000ff)`,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  minWidth: '40px',
                  fontSize: '12px',
                  color: '#2196f3',
                  fontWeight: '600'
                }}>
                  {Math.round(customColors.blue * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '1rem', 
                textAlign: 'center',
                color: '#fff'
              }}>
                Color Palette
              </h4>
              {colorPalette.map((color, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    background: `rgb(${Math.round(color.red * 255)}, ${Math.round(color.green * 255)}, ${Math.round(color.blue * 255)})`,
                    borderRadius: '4px',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }} />
                  <span style={{ 
                    minWidth: '60px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    {color.name}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={color.red}
                      onChange={(e) => setColorPalette(prev => prev.map((c, i) => 
                        i === index ? { ...c, red: parseFloat(e.target.value) } : c
                      ))}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: `linear-gradient(to right, #000, #ff0000)`,
                        borderRadius: '2px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={color.green}
                      onChange={(e) => setColorPalette(prev => prev.map((c, i) => 
                        i === index ? { ...c, green: parseFloat(e.target.value) } : c
                      ))}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: `linear-gradient(to right, #000, #00ff00)`,
                        borderRadius: '2px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={color.blue}
                      onChange={(e) => setColorPalette(prev => prev.map((c, i) => 
                        i === index ? { ...c, blue: parseFloat(e.target.value) } : c
                      ))}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: `linear-gradient(to right, #000, #0000ff)`,
                        borderRadius: '2px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Color Preview */}
          {!multiColorMode ? (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem',
              background: `rgb(${Math.round(customColors.red * 255)}, ${Math.round(customColors.green * 255)}, ${Math.round(customColors.blue * 255)})`,
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: customColors.red + customColors.green + customColors.blue > 1.5 ? '#000' : '#fff',
              textShadow: customColors.red + customColors.green + customColors.blue > 1.5 ? 'none' : '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              RGB({Math.round(customColors.red * 255)}, {Math.round(customColors.green * 255)}, {Math.round(customColors.blue * 255)})
            </div>
          ) : (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff'
            }}>
              Multi-Color Palette ({colorPalette.length} colors)
            </div>
          )}
        </div>

        {/* Advanced Particle Controls */}
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            Advanced Particle Controls
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Motion Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Motion Type
              </label>
              <select
                value={motionType}
                onChange={(e) => setMotionType(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#2a2a2a',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="organic">Organic</option>
                <option value="spiral">Spiral</option>
                <option value="wave">Wave</option>
                <option value="orbit">Orbit</option>
                <option value="chaos">Chaos</option>
                <option value="flow">Flow</option>
              </select>
            </div>

            {/* Particle Speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Speed
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={particleSpeed}
                onChange={(e) => setParticleSpeed(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: '6px',
                  background: `linear-gradient(to right, #000, #4caf50)`,
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                minWidth: '40px', 
                fontSize: '12px', 
                color: '#4caf50',
                fontWeight: '600'
              }}>
                {particleSpeed.toFixed(1)}x
              </span>
            </div>

            {/* Particle Size */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Size
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={particleSize}
                onChange={(e) => setParticleSize(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: '6px',
                  background: `linear-gradient(to right, #000, #ff9800)`,
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                minWidth: '40px', 
                fontSize: '12px', 
                color: '#ff9800',
                fontWeight: '600'
              }}>
                {particleSize.toFixed(1)}x
              </span>
            </div>

            {/* Particle Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Count
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={particleCount}
                onChange={(e) => setParticleCount(parseInt(e.target.value))}
                style={{
                  flex: 1,
                  height: '6px',
                  background: `linear-gradient(to right, #000, #9c27b0)`,
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                minWidth: '40px', 
                fontSize: '12px', 
                color: '#9c27b0',
                fontWeight: '600'
              }}>
                {particleCount}
              </span>
            </div>

            {/* Particle Opacity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={particleOpacity}
                onChange={(e) => setParticleOpacity(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: '6px',
                  background: `linear-gradient(to right, #000, #2196f3)`,
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                minWidth: '40px', 
                fontSize: '12px', 
                color: '#2196f3',
                fontWeight: '600'
              }}>
                {Math.round(particleOpacity * 100)}%
              </span>
            </div>

            {/* Mouse Interaction */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Mouse Interaction
              </label>
              <input
                type="checkbox"
                checked={mouseInteraction}
                onChange={(e) => setMouseInteraction(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Interaction Radius */}
            {mouseInteraction && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ 
                  minWidth: '80px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: '#fff'
                }}>
                  Interaction Radius
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={interactionRadius}
                  onChange={(e) => setInteractionRadius(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    background: `linear-gradient(to right, #000, #f44336)`,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ 
                  minWidth: '40px', 
                  fontSize: '12px', 
                  color: '#f44336',
                  fontWeight: '600'
                }}>
                  {Math.round(interactionRadius * 100)}%
                </span>
              </div>
            )}

            {/* Wave Controls */}
            {motionType === 'wave' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ 
                    minWidth: '80px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    Wave Amplitude
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={waveAmplitude}
                    onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      background: `linear-gradient(to right, #000, #00bcd4)`,
                      borderRadius: '3px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    minWidth: '40px', 
                    fontSize: '12px', 
                    color: '#00bcd4',
                    fontWeight: '600'
                  }}>
                    {waveAmplitude.toFixed(1)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ 
                    minWidth: '80px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    Wave Frequency
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={waveFrequency}
                    onChange={(e) => setWaveFrequency(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      background: `linear-gradient(to right, #000, #00bcd4)`,
                      borderRadius: '3px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    minWidth: '40px', 
                    fontSize: '12px', 
                    color: '#00bcd4',
                    fontWeight: '600'
                  }}>
                    {waveFrequency.toFixed(1)}
                  </span>
                </div>
              </>
            )}

            {/* Spiral Controls */}
            {motionType === 'spiral' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ 
                  minWidth: '80px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: '#fff'
                }}>
                  Spiral Speed
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={spiralSpeed}
                  onChange={(e) => setSpiralSpeed(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    background: `linear-gradient(to right, #000, #e91e63)`,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ 
                  minWidth: '40px', 
                  fontSize: '12px', 
                  color: '#e91e63',
                  fontWeight: '600'
                }}>
                  {spiralSpeed.toFixed(1)}x
                </span>
              </div>
            )}

            {/* Orbit Controls */}
            {motionType === 'orbit' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ 
                    minWidth: '80px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    Orbit Radius
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={orbitRadius}
                    onChange={(e) => setOrbitRadius(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      background: `linear-gradient(to right, #000, #ff5722)`,
                      borderRadius: '3px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    minWidth: '40px', 
                    fontSize: '12px', 
                    color: '#ff5722',
                    fontWeight: '600'
                  }}>
                    {orbitRadius.toFixed(1)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ 
                    minWidth: '80px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    Orbit Speed
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={orbitSpeed}
                    onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      background: `linear-gradient(to right, #000, #ff5722)`,
                      borderRadius: '3px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    minWidth: '40px', 
                    fontSize: '12px', 
                    color: '#ff5722',
                    fontWeight: '600'
                  }}>
                    {orbitSpeed.toFixed(1)}x
                  </span>
                </div>
              </>
            )}

            {/* Bloom Effect */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Bloom Effect
              </label>
              <input
                type="checkbox"
                checked={bloomEffect}
                onChange={(e) => setBloomEffect(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Bloom Intensity */}
            {bloomEffect && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ 
                  minWidth: '80px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: '#fff'
                }}>
                  Bloom Intensity
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={bloomIntensity}
                  onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    background: `linear-gradient(to right, #000, #ffeb3b)`,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ 
                  minWidth: '40px', 
                  fontSize: '12px', 
                  color: '#ffeb3b',
                  fontWeight: '600'
                }}>
                  {bloomIntensity.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Save/Load Controls */}
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            Save & Export
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Save Preset */}
            <button
              onClick={saveCurrentPreset}
              style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              💾 Save Current Effect
            </button>
            
            {/* Export JSON */}
            <button
              onClick={exportSettings}
              style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📁 Export as JSON
            </button>
            
            {/* Generate Integration Code */}
            <button
              onClick={() => {
                const code = generateIntegrationCode();
                navigator.clipboard.writeText(code);
                alert('Integration code copied to clipboard!');
              }}
              style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔗 Copy Integration Code
            </button>
          </div>
          
          {/* Saved Presets */}
          {savedPresets.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '1rem', 
                textAlign: 'center',
                color: '#fff'
              }}>
                Saved Presets
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {savedPresets.map((preset) => (
                  <div key={preset.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px'
                  }}>
                    <button
                      onClick={() => loadPreset(preset)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(76, 175, 80, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Load: {preset.name}
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(244, 67, 54, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Noise Controls */}
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            Noise Controls
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Noise Type Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Noise Type
              </label>
              <select
                value={noiseType}
                onChange={(e) => setNoiseType(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#2a2a2a',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="gradient">Gradient Noise</option>
                <option value="grain">🔥 HEAVY GRAIN</option>
                <option value="scanlines">📺 CRT Scanlines</option>
                <option value="glitch">⚡ Digital Glitch</option>
                <option value="vhs">📼 VHS Static</option>
                <option value="matrix">🟢 Matrix Rain</option>
                <option value="snow">❄️ TV Snow</option>
                <option value="interference">📻 Radio Interference</option>
                <option value="pixelated">🎮 8-bit Pixelated</option>
                <option value="dots">Dot Pattern</option>
                <option value="lines">Line Pattern</option>
                <option value="waves">Wave Pattern</option>
                <option value="cellular">Cellular Pattern</option>
                <option value="fractal">Fractal Pattern</option>
                <option value="static">Static Noise</option>
                <option value="film">Film Grain</option>
              </select>
            </div>
            
            {/* Noise Strength Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ 
                minWidth: '80px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#fff'
              }}>
                Strength
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={noiseStrength}
                onChange={(e) => setNoiseStrength(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: '6px',
                  background: `linear-gradient(to right, #000, #fff)`,
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                minWidth: '40px', 
                fontSize: '12px', 
                color: '#fff',
                fontWeight: '600'
              }}>
                {Math.round(noiseStrength * 100)}%
              </span>
            </div>
            
            {/* Noise Preview */}
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#1a1a1a',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff'
            }}>
              {noiseType.charAt(0).toUpperCase() + noiseType.slice(1)} Noise - {Math.round(noiseStrength * 100)}% Strength
              <br />
              <small style={{ color: '#888', fontSize: '10px' }}>
                Try: grain, scanlines, glitch, vhs, matrix, snow
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

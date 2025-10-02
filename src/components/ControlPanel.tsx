import { useState } from 'react';

interface ControlPanelProps {
  onParameterChange: (param: string, value: any) => void;
  onExport: () => void;
  onSavePreset: () => void;
}

export default function ControlPanel({ onParameterChange, onExport, onSavePreset }: ControlPanelProps) {
  const [collapsedPanels, setCollapsedPanels] = useState<Set<number>>(new Set());

  const togglePanel = (panelIndex: number) => {
    const newCollapsed = new Set(collapsedPanels);
    if (newCollapsed.has(panelIndex)) {
      newCollapsed.delete(panelIndex);
    } else {
      newCollapsed.add(panelIndex);
    }
    setCollapsedPanels(newCollapsed);
  };

  const controlGroups = [
    {
      title: 'Particle Properties',
      controls: [
        {
          id: 'numParticles',
          label: 'Number of Particles',
          type: 'range',
          min: 1000,
          max: 100000,
          step: 1000,
          defaultValue: 50000,
          unit: ''
        },
        {
          id: 'particleSize',
          label: 'Particle Size',
          type: 'range',
          min: 0.1,
          max: 5.0,
          step: 0.1,
          defaultValue: 1.0,
          unit: ''
        },
        {
          id: 'particleColor',
          label: 'Primary Color',
          type: 'color',
          defaultValue: '#00aaff',
          unit: ''
        },
        {
          id: 'particleColor2',
          label: 'Secondary Color',
          type: 'color',
          defaultValue: '#ff6b6b',
          unit: ''
        },
        {
          id: 'particleColor3',
          label: 'Tertiary Color',
          type: 'color',
          defaultValue: '#4ecdc4',
          unit: ''
        },
        {
          id: 'particleOpacity',
          label: 'Particle Opacity',
          type: 'range',
          min: 0.0,
          max: 1.0,
          step: 0.01,
          defaultValue: 1.0,
          unit: ''
        }
      ]
    },
    {
      title: 'Color Effects',
      controls: [
        {
          id: 'colorVariation',
          label: 'Color Variation',
          type: 'range',
          min: 0.0,
          max: 1.0,
          step: 0.01,
          defaultValue: 0.3,
          unit: ''
        },
        {
          id: 'gradientIntensity',
          label: 'Gradient Intensity',
          type: 'range',
          min: 0.0,
          max: 2.0,
          step: 0.1,
          defaultValue: 1.0,
          unit: ''
        },
        {
          id: 'colorPreset',
          label: 'Color Presets',
          type: 'select',
          options: [
            { value: 'custom', label: '🎨 Custom' },
            { value: 'video', label: '🎬 Video Gradient (Blue-Purple-Pink)' },
            { value: 'ocean', label: '🌊 Ocean Blue' },
            { value: 'sunset', label: '🌅 Sunset' },
            { value: 'aurora', label: '🌌 Aurora' },
            { value: 'fire', label: '🔥 Fire' },
            { value: 'forest', label: '🌲 Forest' },
            { value: 'cosmic', label: '🌌 Cosmic' },
            { value: 'neon', label: '💫 Neon' }
          ],
          defaultValue: 'custom',
          unit: ''
        }
      ]
    },
    {
      title: 'Motion Types',
      controls: [
        {
          id: 'motionType',
          label: 'Motion Type',
          type: 'select',
          options: [
            { value: 'noise', label: '🌊 Noise (Original)' },
            { value: 'spiral', label: '🌀 Spiral' },
            { value: 'wave', label: '🌊 Wave' },
            { value: 'orbit', label: '🔄 Orbit' },
            { value: 'swirl', label: '🌪️ Swirl' },
            { value: 'pulse', label: '💓 Pulse' },
            { value: 'combined', label: '✨ Combined' },
            { value: 'organic', label: '🌿 Organic Flow' },
            { value: '3d', label: '🎯 Full 3D Motion' }
          ],
          defaultValue: 'noise',
          unit: ''
        }
      ]
    },
    {
      title: 'Motion & Noise',
      controls: [
        {
          id: 'noiseScale',
          label: 'Noise Scale',
          type: 'range',
          min: 0.1,
          max: 20.0,
          step: 0.1,
          defaultValue: 2.0,
          unit: ''
        },
        {
          id: 'noiseSpeed',
          label: 'Noise Speed',
          type: 'range',
          min: 0.001,
          max: 0.1,
          step: 0.001,
          defaultValue: 0.02,
          unit: ''
        },
        {
          id: 'motionMagnitude',
          label: 'Motion Magnitude',
          type: 'range',
          min: 0.0,
          max: 10.0,
          step: 0.1,
          defaultValue: 1.0,
          unit: ''
        }
      ]
    },
    {
      title: 'Motion Parameters',
      controls: [
        {
          id: 'spiralSpeed',
          label: 'Spiral Speed',
          type: 'range',
          min: 0.1,
          max: 3.0,
          step: 0.1,
          defaultValue: 0.5,
          unit: ''
        },
        {
          id: 'waveAmplitude',
          label: 'Wave Amplitude',
          type: 'range',
          min: 1.0,
          max: 50.0,
          step: 1.0,
          defaultValue: 10.0,
          unit: ''
        },
        {
          id: 'waveFrequency',
          label: 'Wave Frequency',
          type: 'range',
          min: 0.01,
          max: 0.5,
          step: 0.01,
          defaultValue: 0.1,
          unit: ''
        },
        {
          id: 'orbitRadius',
          label: 'Orbit Radius',
          type: 'range',
          min: 5.0,
          max: 100.0,
          step: 5.0,
          defaultValue: 20.0,
          unit: ''
        },
        {
          id: 'orbitSpeed',
          label: 'Orbit Speed',
          type: 'range',
          min: 0.1,
          max: 2.0,
          step: 0.1,
          defaultValue: 0.3,
          unit: ''
        }
      ]
    },
    {
      title: 'Mouse Interaction',
      controls: [
        {
          id: 'interactionRadius',
          label: 'Interaction Radius',
          type: 'range',
          min: 10,
          max: 500,
          step: 10,
          defaultValue: 100,
          unit: 'px'
        },
        {
          id: 'interactionStrength',
          label: 'Interaction Strength',
          type: 'range',
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 50,
          unit: ''
        }
      ]
    },
    {
      title: 'Scene Settings',
      controls: [
        {
          id: 'backgroundColor',
          label: 'Background Color',
          type: 'color',
          defaultValue: '#1a1a1a',
          unit: ''
        }
      ]
    }
  ];

  const handleControlChange = (controlId: string, value: any) => {
    onParameterChange(controlId, value);
  };

  return (
    <>
      {controlGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={`panel ${collapsedPanels.has(groupIndex) ? 'collapsed' : ''}`}>
          <div className="panel-header" onClick={() => togglePanel(groupIndex)}>
            <div className="panel-title">{group.title}</div>
            <div className="panel-toggle">▼</div>
          </div>
          
          <div className="panel-content">
            {group.controls.map((control) => (
              <div key={control.id} className="control-item">
                <label htmlFor={control.id}>
                  {control.label}
                  {control.unit && <span className="unit">({control.unit})</span>}
                </label>
                
                {control.type === 'range' ? (
                  <div className="range-container">
                    <input
                      type="range"
                      id={control.id}
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      defaultValue={control.defaultValue}
                      onChange={(e) => handleControlChange(control.id, parseFloat(e.target.value))}
                      className="slider"
                    />
                    <span className="value-display" id={`${control.id}Value`}>
                      {control.defaultValue}
                    </span>
                  </div>
                ) : control.type === 'color' ? (
                  <input
                    type="color"
                    id={control.id}
                    defaultValue={control.defaultValue}
                    onChange={(e) => handleControlChange(control.id, e.target.value)}
                    className="color-picker"
                  />
                ) : control.type === 'select' ? (
                  <select
                    id={control.id}
                    defaultValue={control.defaultValue}
                    onChange={(e) => handleControlChange(control.id, e.target.value)}
                    className="select-input"
                  >
                    {control.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            ))}
            
            {groupIndex === controlGroups.length - 1 && (
              <div className="action-buttons">
                <button onClick={onSavePreset} className="btn btn-secondary">
                  Save Preset
                </button>
                <button onClick={onExport} className="btn btn-primary">
                  Export Code
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

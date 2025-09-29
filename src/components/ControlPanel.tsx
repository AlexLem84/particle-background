import { useState } from 'react';

interface ControlPanelProps {
  onParameterChange: (param: string, value: any) => void;
  onExport: () => void;
  onSavePreset: () => void;
}

export default function ControlPanel({ onParameterChange, onExport, onSavePreset }: ControlPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          label: 'Particle Color',
          type: 'color',
          defaultValue: '#00aaff',
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
    <div className={`control-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="control-panel-header">
        <h2>Particle Background Creator</h2>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '▶' : '▼'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="control-panel-content">
          {controlGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="control-group">
              <h3>{group.title}</h3>
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
                  ) : null}
                </div>
              ))}
            </div>
          ))}

          <div className="action-buttons">
            <button onClick={onSavePreset} className="btn btn-secondary">
              Save Preset
            </button>
            <button onClick={onExport} className="btn btn-primary">
              Export Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

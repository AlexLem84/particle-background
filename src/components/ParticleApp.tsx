import { useState, useCallback } from 'react';
import ParticleBackground from './ParticleBackground';
import ControlPanel from './ControlPanel';

interface ParticleParameters {
  numParticles: number;
  particleSize: number;
  particleColor: string;
  particleColor2: string;
  particleColor3: string;
  colorVariation: number;
  gradientIntensity: number;
  particleOpacity: number;
  noiseScale: number;
  noiseSpeed: number;
  motionMagnitude: number;
  interactionRadius: number;
  interactionStrength: number;
  backgroundColor: string;
  motionType: string;
  spiralSpeed: number;
  waveAmplitude: number;
  waveFrequency: number;
  orbitRadius: number;
  orbitSpeed: number;
}

export default function ParticleApp() {
  const [parameters, setParameters] = useState<ParticleParameters>({
    numParticles: 50000,
    particleSize: 1.0,
    particleColor: '#00aaff',
    particleColor2: '#ff6b6b',
    particleColor3: '#4ecdc4',
    colorVariation: 0.3,
    gradientIntensity: 1.0,
    particleOpacity: 1.0,
    noiseScale: 2.0,
    noiseSpeed: 0.02,
    motionMagnitude: 1.0,
    interactionRadius: 100,
    interactionStrength: 50,
    backgroundColor: '#1a1a1a',
    motionType: 'noise',
    spiralSpeed: 0.5,
    waveAmplitude: 10.0,
    waveFrequency: 0.1,
    orbitRadius: 20.0,
    orbitSpeed: 0.3
  });

  const handleParameterChange = useCallback((param: string, value: any) => {
    if (param === 'colorPreset') {
      const presets = {
        custom: { particleColor: '#00aaff', particleColor2: '#ff6b6b', particleColor3: '#4ecdc4' },
        video: { particleColor: '#0066ff', particleColor2: '#8a2be2', particleColor3: '#ff69b4' }, // Blue-Purple-Pink
        ocean: { particleColor: '#0066cc', particleColor2: '#00aaff', particleColor3: '#4ecdc4' },
        sunset: { particleColor: '#ff6b6b', particleColor2: '#ffa726', particleColor3: '#ffeb3b' },
        aurora: { particleColor: '#4caf50', particleColor2: '#8bc34a', particleColor3: '#cddc39' },
        fire: { particleColor: '#ff5722', particleColor2: '#ff9800', particleColor3: '#ffc107' },
        forest: { particleColor: '#2e7d32', particleColor2: '#4caf50', particleColor3: '#8bc34a' },
        cosmic: { particleColor: '#9c27b0', particleColor2: '#673ab7', particleColor3: '#3f51b5' },
        neon: { particleColor: '#00e676', particleColor2: '#ff1744', particleColor3: '#00bcd4' }
      };
      
      const preset = presets[value as keyof typeof presets] || presets.custom;
      setParameters(prev => ({
        ...prev,
        ...preset
      }));
    } else {
      setParameters(prev => ({
        ...prev,
        [param]: value
      }));
    }
  }, []);

  const handleExport = useCallback(() => {
    // Generate exportable HTML/CSS/JS code
    const exportCode = generateExportCode(parameters);
    
    // Create a blob and download it
    const blob = new Blob([exportCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'particle-background.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [parameters]);

  const handleSavePreset = useCallback(() => {
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
      const presets = JSON.parse(localStorage.getItem('particlePresets') || '{}');
      presets[presetName] = parameters;
      localStorage.setItem('particlePresets', JSON.stringify(presets));
      alert(`Preset "${presetName}" saved successfully!`);
    }
  }, [parameters]);

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: '100vh'
      }}>
        <ParticleBackground
          numParticles={parameters.numParticles}
          particleSize={parameters.particleSize}
          particleColor={parameters.particleColor}
          particleColor2={parameters.particleColor2}
          particleColor3={parameters.particleColor3}
          colorVariation={parameters.colorVariation}
          gradientIntensity={parameters.gradientIntensity}
          noiseScale={parameters.noiseScale}
          noiseSpeed={parameters.noiseSpeed}
          motionMagnitude={parameters.motionMagnitude}
          interactionRadius={parameters.interactionRadius}
          interactionStrength={parameters.interactionStrength}
          backgroundColor={parameters.backgroundColor}
          motionType={parameters.motionType}
          spiralSpeed={parameters.spiralSpeed}
          waveAmplitude={parameters.waveAmplitude}
          waveFrequency={parameters.waveFrequency}
          orbitRadius={parameters.orbitRadius}
          orbitSpeed={parameters.orbitSpeed}
        />
      </div>
      <div style={{
        width: '350px',
        background: '#2a2a2a',
        borderLeft: '1px solid #404040',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <ControlPanel
          onParameterChange={handleParameterChange}
          onExport={handleExport}
          onSavePreset={handleSavePreset}
        />
      </div>
    </div>
  );
}

function generateExportCode(params: ParticleParameters): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Particle Background</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: ${params.backgroundColor};
        }
        #particle-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
    </style>
</head>
<body>
    <canvas id="particle-canvas"></canvas>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // Particle Background Configuration
        const CONFIG = {
            numParticles: ${params.numParticles},
            particleSize: ${params.particleSize},
            particleColor: '${params.particleColor}',
            noiseScale: ${params.noiseScale},
            noiseSpeed: ${params.noiseSpeed},
            motionMagnitude: ${params.motionMagnitude},
            interactionRadius: ${params.interactionRadius},
            interactionStrength: ${params.interactionStrength},
            backgroundColor: '${params.backgroundColor}'
        };

        // GLSL Shaders
        const vertexShader = \`
            uniform float uTime;
            uniform vec3 uMouse;
            uniform float uPixelRatio;
            uniform float uSize;
            uniform float uNoiseScale;
            uniform float uNoiseSpeed;
            uniform float uMotionMagnitude;
            uniform float uInteractionRadius;
            uniform float uInteractionStrength;

            attribute float aRandom;

            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

            float snoise(vec3 v){
              const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
              const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

              vec3 i  = floor(v + dot(v, C.yyy) );
              vec3 x0 =   v - i + dot(i, C.xxx) ;

              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min( g.xyz, l.zxy );
              vec3 i2 = max( g.xyz, l.zxy );

              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;

              i = mod(i, 289.0 );
              vec4 p = permute( permute( permute(
                         i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                       + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                       + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

              float n_ = 0.142857142857;
              vec3  ns = n_ * D.wad - D.xyz ;

              vec4 o0 = permute( p + vec4(0.0, ns.yzx) );
              vec4 o1 = permute( p + ns.xyz );
              vec4 o2 = permute( p + ns.zyw );
              vec4 o3 = permute( p + D.www );

              vec4 h0 = abs(o0) - 0.5;
              vec4 h1 = abs(o1) - 0.5;
              vec4 h2 = abs(o2) - 0.5;
              vec4 h3 = abs(o3) - 0.5;

              vec4 s0 = floor(o0) * 2.0 + 1.0;
              vec4 s1 = floor(o1) * 2.0 + 1.0;
              vec4 s2 = floor(o2) * 2.0 + 1.0;
              vec4 s3 = floor(o3) * 2.0 + 1.0;

              vec4 sh0 = -step(h0, vec4(0.0));
              vec4 sh1 = -step(h1, vec4(0.0));
              vec4 sh2 = -step(h2, vec4(0.0));
              vec4 sh3 = -step(h3, vec4(0.0));

              o0 *= (vec4(1.0) + sh0);
              o1 *= (vec4(1.0) + sh1);
              o2 *= (vec4(1.0) + sh2);
              o3 *= (vec4(1.0) + sh3);

              vec4 g0 = vec4( o0.xzyw, o1.xzyw, o2.xzyw, o3.xzyw );
              vec4 g1 = vec4( o0.xyzw, o1.xyzw, o2.xyzw, o3.xyzw );

              vec4 v4 = vec4( 0.6 + 0.5 * dot(g0, g1), 0.6 + 0.5 * dot(g0.yzxw, g1.yzxw),
                              0.6 + 0.5 * dot(g0.zxyw, g1.zxyw), 0.6 + 0.5 * dot(g0.wxyz, g1.wxyz) );

              vec4 gr = normalize(g0);
              vec4 gi = normalize(g1);
              vec4 gs = gr + floor(gi) * 2.0;

              vec4 w = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              vec4 h = taylorInvSqrt(w);
              vec4 gw = w * w * w * h;
              vec4 g = vec4( dot(gr.xyz, x0), dot(gr.yzw, x1), dot(gi.xyz, x2), dot(gi.yzw, x3) );
              return 35.0 * dot(gw, g);
            }

            void main() {
                vec3 displacedPosition = position;

                float noise = snoise(displacedPosition * uNoiseScale + uTime * uNoiseSpeed + aRandom * 0.1);
                displacedPosition.z += noise * uMotionMagnitude;

                float dist = distance(displacedPosition.xy, uMouse.xy);
                float strength = smoothstep(uInteractionRadius, 0.0, dist);
                displacedPosition.xy += normalize(displacedPosition.xy - uMouse.xy) * strength * uInteractionStrength;

                vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
                gl_PointSize = uSize * uPixelRatio;
                gl_Position = projectionMatrix * modelViewPosition;
            }
        \`;

        const fragmentShader = \`
            uniform vec3 uColor;

            void main() {
                float r = 0.5;
                vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                float alpha = 1.0 - smoothstep(r, r + 0.1, length(cxy));

                gl_FragColor = vec4(uColor, alpha);
            }
        \`;

        // Three.js Setup
        let scene, camera, renderer, particles;
        const mouse = new THREE.Vector3();
        const targetMouse = new THREE.Vector3();

        function init() {
            const canvas = document.getElementById('particle-canvas');
            
            scene = new THREE.Scene();
            scene.background = new THREE.Color(CONFIG.backgroundColor);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 50;

            renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            createParticles();
            animate();

            window.addEventListener('resize', onWindowResize);
            window.addEventListener('mousemove', onMouseMove);
        }

        function createParticles() {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(CONFIG.numParticles * 3);
            const randoms = new Float32Array(CONFIG.numParticles);

            for (let i = 0; i < CONFIG.numParticles; i++) {
                positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
                randoms[i] = Math.random();
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0.0 },
                    uMouse: { value: new THREE.Vector3() },
                    uPixelRatio: { value: window.devicePixelRatio },
                    uSize: { value: CONFIG.particleSize },
                    uColor: { value: new THREE.Color(CONFIG.particleColor) },
                    uNoiseScale: { value: CONFIG.noiseScale },
                    uNoiseSpeed: { value: CONFIG.noiseSpeed },
                    uMotionMagnitude: { value: CONFIG.motionMagnitude },
                    uInteractionRadius: { value: CONFIG.interactionRadius },
                    uInteractionStrength: { value: CONFIG.interactionStrength },
                },
                vertexShader,
                fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onMouseMove(event) {
            const mouse2D = new THREE.Vector2();
            mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse2D, camera);
            
            const intersectionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersects = new THREE.Vector3();
            raycaster.ray.intersectPlane(intersectionPlane, intersects);

            if (intersects) {
                targetMouse.copy(intersects);
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            particles.material.uniforms.uTime.value += 0.01;
            mouse.lerp(targetMouse, 0.1);
            particles.material.uniforms.uMouse.value.copy(mouse);

            renderer.render(scene, camera);
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    </script>
</body>
</html>`;
}

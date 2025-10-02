# 🚀 Particle Background Export Guide

Complete guide for exporting your particle background effects to any website.

## 📋 Quick Export Methods

### Method 1: Copy Integration Code (Easiest)
1. Go to `http://localhost:4321/kota-test`
2. Configure your particle effect
3. Click **"🔗 Copy Integration Code"**
4. Paste into your website

### Method 2: Export as JSON
1. Configure your particle effect
2. Click **"📁 Export as JSON"**
3. Use the JSON in your project

### Method 3: Save as Preset
1. Configure your particle effect
2. Click **"💾 Save Current Effect"**
3. Load preset in other projects

## 🎯 Integration Options

### Option 1: Vanilla HTML/JavaScript (Recommended for any website)

**Step 1:** Include the particle script
```html
<script src="particle-export.js"></script>
```

**Step 2:** Initialize with your config
```html
<script>
const particleBG = new ParticleBackground();
particleBG.init({
  numParticles: 15000,
  particleColor: '#0066ff',
  particleColor2: '#8a2be2',
  particleColor3: '#ff69b4',
  motionType: 'organic',
  backgroundColor: '#0a0a0a'
});
</script>
```

**Step 3:** Add container to your HTML
```html
<div id="particle-background" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;"></div>
```

### Option 2: React Component

**Step 1:** Install dependencies
```bash
npm install three @types/three
```

**Step 2:** Use the component
```jsx
import ParticleBackground from './ParticleBackground';

function App() {
  return (
    <div>
      <ParticleBackground
        numParticles={15000}
        particleColor="#0066ff"
        particleColor2="#8a2be2"
        particleColor3="#ff69b4"
        motionType="organic"
        backgroundColor="#0a0a0a"
      />
      {/* Your content */}
    </div>
  );
}
```

### Option 3: Vue Component

**Step 1:** Install dependencies
```bash
npm install three
```

**Step 2:** Use the component
```vue
<template>
  <div>
    <ParticleBackground
      :num-particles="15000"
      particle-color="#0066ff"
      particle-color2="#8a2be2"
      particle-color3="#ff69b4"
      motion-type="organic"
      background-color="#0a0a0a"
    />
    <!-- Your content -->
  </div>
</template>
```

### Option 4: Astro Integration

**Step 1:** Install dependencies
```bash
npm install three
```

**Step 2:** Use in Astro component
```astro
---
import ParticleBackground from '../components/ParticleBackground';
---

<ParticleBackground
  numParticles={15000}
  particleColor="#0066ff"
  particleColor2="#8a2be2"
  particleColor3="#ff69b4"
  motionType="organic"
  backgroundColor="#0a0a0a"
/>

<main>
  <!-- Your content -->
</main>
```

## 🎨 Configuration Options

### Basic Settings
```javascript
{
  numParticles: 15000,        // Number of particles (1000-50000)
  particleSize: 1.2,            // Size of particles (0.5-5.0)
  backgroundColor: '#0a0a0a',   // Background color
  motionType: 'organic'         // Motion type
}
```

### Color Settings
```javascript
{
  particleColor: '#0066ff',     // Primary color (top)
  particleColor2: '#8a2be2',    // Secondary color (middle)
  particleColor3: '#ff69b4',    // Tertiary color (bottom)
  colorVariation: 0.05,         // Color variation (0-1)
  gradientIntensity: 1.0       // Gradient strength (0-2)
}
```

### Motion Settings
```javascript
{
  motionType: 'organic',        // 'noise', 'spiral', 'wave', 'orbit', 'swirl', 'pulse', 'combined', 'organic', '3d'
  motionMagnitude: 0.8,         // Motion strength (0-2)
  noiseScale: 1.5,             // Noise scale (0.5-3.0)
  noiseSpeed: 0.015,            // Animation speed (0.001-0.1)
  spiralSpeed: 0.3,             // Spiral speed (0.1-1.0)
  waveAmplitude: 8.0,           // Wave amplitude (1-20)
  waveFrequency: 0.08,          // Wave frequency (0.01-0.2)
  orbitRadius: 15.0,            // Orbit radius (5-50)
  orbitSpeed: 0.2               // Orbit speed (0.1-1.0)
}
```

### Interaction Settings
```javascript
{
  interactionRadius: 80,       // Mouse interaction radius (20-200)
  interactionStrength: 40      // Interaction strength (10-100)
}
```

## 🎭 Motion Types Explained

| Type | Description | Best For |
|------|-------------|----------|
| `organic` | Flowing, natural movement | General use, elegant backgrounds |
| `wave` | Wave-like motion | Ocean themes, fluid designs |
| `spiral` | Spiral patterns | Dynamic, energetic sites |
| `3d` | Full 3D rotation | Modern, tech-focused sites |
| `pulse` | Pulsing motion | Music sites, rhythmic content |
| `orbit` | Orbital motion | Space themes, scientific sites |
| `swirl` | Swirling patterns | Artistic, creative sites |
| `noise` | Random noise-based | Abstract, experimental designs |

## 🎨 Color Themes

### Predefined Themes
```javascript
// Blue Theme
{
  particleColor: '#0066ff',
  particleColor2: '#0044cc',
  particleColor3: '#0088ff'
}

// Purple Theme
{
  particleColor: '#8a2be2',
  particleColor2: '#6a1b9a',
  particleColor3: '#ba68c8'
}

// Pink Theme
{
  particleColor: '#ff69b4',
  particleColor2: '#e91e63',
  particleColor3: '#f8bbd9'
}

// Rainbow Theme
{
  particleColor: '#ff0000',
  particleColor2: '#00ff00',
  particleColor3: '#0000ff'
}
```

## 📱 Responsive Design

### CSS for Responsive Particles
```css
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}

/* Ensure content is above particles */
.content {
  position: relative;
  z-index: 1;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .particle-container {
    /* Reduce particle count on mobile */
    --particle-count: 5000;
  }
}
```

### JavaScript Responsive Handling
```javascript
// Adjust particle count based on device
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 5000 : 15000;

particleBG.init({
  numParticles: particleCount,
  // ... other config
});
```

## ⚡ Performance Optimization

### Performance Tips
1. **Reduce particle count on mobile** (5000-8000)
2. **Disable noise on low-end devices**
3. **Use `position: 'absolute'` instead of `'fixed'` for better performance**
4. **Reduce `noiseStrength` for smoother animation**
5. **Limit to 30fps on mobile devices**

### Performance Monitoring
```javascript
// Monitor performance
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime - lastTime >= 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(monitorPerformance);
}
```

## 🔧 Advanced Usage

### Dynamic Configuration Updates
```javascript
// Update particle effect dynamically
function updateParticleEffect(newConfig) {
  if (particleBG) {
    particleBG.update(newConfig);
  }
}

// Example: Change colors based on time of day
const hour = new Date().getHours();
const isNight = hour < 6 || hour > 18;

updateParticleEffect({
  backgroundColor: isNight ? '#000011' : '#f0f8ff',
  particleColor: isNight ? '#1a1a2e' : '#0066ff',
  particleColor2: isNight ? '#16213e' : '#8a2be2',
  particleColor3: isNight ? '#0f3460' : '#ff69b4'
});
```

### Scroll-Based Effects
```javascript
// Change particles based on scroll position
window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  
  particleBG.update({
    motionMagnitude: 0.5 + scrollPercent * 1.5,
    noiseSpeed: 0.01 + scrollPercent * 0.02
  });
});
```

### User Interaction
```javascript
// Change particles based on user interaction
document.addEventListener('click', (e) => {
  const colors = [
    { particleColor: '#ff0000', particleColor2: '#ff6600', particleColor3: '#ffcc00' },
    { particleColor: '#00ff00', particleColor2: '#00cc66', particleColor3: '#00ffcc' },
    { particleColor: '#0000ff', particleColor2: '#6600ff', particleColor3: '#cc00ff' }
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  particleBG.update(randomColor);
});
```

## 🐛 Troubleshooting

### Common Issues

**Particles not showing:**
- Check z-index (should be negative)
- Verify canvas positioning
- Check browser console for errors

**Performance issues:**
- Reduce particle count
- Disable noise effects
- Use `position: 'absolute'` instead of `'fixed'`

**Colors not updating:**
- Ensure proper state management
- Check uniform updates
- Verify color format (hex strings)

**Scroll effects not working:**
- Check ScrollTrigger setup
- Verify event listeners
- Test with simple scroll handlers

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (with reduced particle count)

### Debug Mode
```javascript
// Enable debug logging
particleBG.init({
  // ... your config
  debug: true
});

// Check particle count
console.log('Particles:', particleBG.particles.geometry.attributes.position.count);

// Monitor performance
console.log('FPS:', particleBG.getFPS());
```

## 📦 Export Formats

### Available Export Formats
1. **HTML** - Complete HTML file with embedded script
2. **React** - React component with TypeScript
3. **Vue** - Vue 3 component with Composition API
4. **Astro** - Astro component for static sites
5. **Vanilla JS** - Plain JavaScript implementation
6. **JSON** - Configuration object
7. **Config** - JavaScript configuration object

### Using Export Utils
```javascript
import { ParticleExporter } from './export-utils.js';

const exporter = new ParticleExporter();
const config = {
  numParticles: 15000,
  particleColor: '#0066ff',
  motionType: 'organic'
};

// Export as HTML
const htmlExport = exporter.exportAsHTML(config);

// Export as React component
const reactExport = exporter.exportAsReact(config);

// Export multiple formats
const multipleExports = exporter.exportMultiple(config, ['html', 'react', 'json']);
```

## 🎯 Best Practices

### Design Guidelines
1. **Keep particle count reasonable** (5000-20000)
2. **Use subtle colors** for professional sites
3. **Test on mobile devices** with reduced settings
4. **Consider accessibility** - provide option to disable
5. **Optimize for performance** - monitor FPS

### Code Organization
1. **Separate configuration** from implementation
2. **Use TypeScript** for better type safety
3. **Implement cleanup** functions
4. **Handle resize events** properly
5. **Test across browsers**

### Accessibility
```javascript
// Provide option to disable particles
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Use static background instead
  document.body.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e)';
} else {
  // Initialize particles
  particleBG.init(config);
}
```

## 📞 Support

### Getting Help
1. Check browser console for errors
2. Verify all dependencies are loaded
3. Test with default settings first
4. Check browser compatibility
5. Monitor performance metrics

### Common Solutions
- **Three.js not loading**: Check CDN links and network
- **Particles not visible**: Check z-index and positioning
- **Performance issues**: Reduce particle count and effects
- **Colors not working**: Verify color format and uniforms

---

**Happy coding!** 🎨✨

Your particle background is now ready to be exported and used on any website!


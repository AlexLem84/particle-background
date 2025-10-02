# Particle Background Integration Guide

This guide shows you how to integrate the particle background effects into your website.

## 🚀 Quick Start

### Method 1: Copy Integration Code
1. Go to `http://localhost:4321/kota-test`
2. Configure your desired particle effect
3. Click **"🔗 Copy Integration Code"**
4. Paste the code into your website

### Method 2: Export JSON Settings
1. Configure your particle effect
2. Click **"📁 Export as JSON"**
3. Use the exported settings in your website

## 📋 Integration Options

### Option 1: React Component
```jsx
import KotaBackground from './components/KotaBackground';

function App() {
  return (
    <div>
      <KotaBackground
        variation={0}
        darkBackground={false}
        noise={true}
        customColors={{ red: 0.45, green: 0.18, blue: 0.82 }}
        noiseType="gradient"
        noiseStrength={0.5}
      />
      {/* Your website content */}
    </div>
  );
}
```

### Option 2: Vanilla JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <style>
        .particle-bg {
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
    <div id="particle-bg" class="particle-bg"></div>
    
    <script type="module">
        // Your particle configuration
        const config = {
            variation: 0,
            darkBackground: false,
            noise: true,
            customColors: { red: 0.45, green: 0.18, blue: 0.82 },
            noiseType: 'gradient',
            noiseStrength: 0.5
        };
        
        // Initialize particle background
        // (Implementation depends on your setup)
    </script>
</body>
</html>
```

### Option 3: Astro Integration
```astro
---
import KotaBackground from '../components/KotaBackground';
---

<html>
<head>
    <title>My Astro Site</title>
</head>
<body>
    <KotaBackground
        variation={0}
        darkBackground={false}
        noise={true}
        customColors={{ red: 0.45, green: 0.18, blue: 0.82 }}
        noiseType="gradient"
        noiseStrength={0.5}
    />
    
    <main>
        <!-- Your content -->
    </main>
</body>
</html>
```

## 🎨 Configuration Options

### Basic Settings
- `variation`: Particle pattern (0-5)
- `darkBackground`: Dark or light background
- `noise`: Enable/disable noise overlay
- `position`: CSS position ('fixed', 'absolute', 'relative')

### Color Settings
- `customColors`: Single RGB color `{ red: 0.45, green: 0.18, blue: 0.82 }`
- `colorPalette`: Multi-color array `[{ red: 0.45, green: 0.18, blue: 0.82, name: 'Purple' }]`
- `multiColorMode`: Use multiple colors instead of single color

### Noise Settings
- `noiseType`: 'gradient', 'dots', 'lines', 'waves', 'cellular', 'fractal', 'static', 'film'
- `noiseStrength`: Noise intensity (0-1)

### Scroll Settings
- `scrollTrigger`: Enable scroll-based effects
- `scrollTriggerOpacity`: Opacity during scroll (0-1)

## 💾 Save & Load Presets

### Save Current Effect
1. Configure your particle effect
2. Click **"💾 Save Current Effect"**
3. Enter a name for your preset
4. Preset is saved to browser localStorage

### Load Saved Preset
1. Click **"Load: [Preset Name]"** from saved presets
2. All settings are restored instantly

### Export Settings
1. Click **"📁 Export as JSON"**
2. Download the configuration file
3. Use in other projects or share with others

## 🔧 Advanced Usage

### Custom Integration
```javascript
// Load saved preset
const savedPreset = JSON.parse(localStorage.getItem('particle-presets'));
const myPreset = savedPreset.find(p => p.name === 'My Effect');

// Apply to your website
const particleConfig = myPreset.settings;
// Use particleConfig in your particle system
```

### Dynamic Configuration
```javascript
// Update particle effect dynamically
function updateParticleEffect(newConfig) {
    // Update your particle system with new settings
    particleSystem.updateConfig(newConfig);
}

// Example: Change colors based on time of day
const hour = new Date().getHours();
const isNight = hour < 6 || hour > 18;
updateParticleEffect({
    darkBackground: isNight,
    customColors: isNight 
        ? { red: 0.1, green: 0.1, blue: 0.3 }
        : { red: 0.8, green: 0.9, blue: 1.0 }
});
```

## 📱 Responsive Design

The particle background automatically adapts to different screen sizes. For best results:

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
```

## 🎯 Performance Tips

1. **Limit particle count** on mobile devices
2. **Disable noise** on low-end devices
3. **Use `position: 'absolute'`** instead of `'fixed'` for better performance
4. **Reduce `noiseStrength`** for smoother animation

## 🐛 Troubleshooting

### Common Issues
- **Particles not showing**: Check z-index and positioning
- **Performance issues**: Reduce particle count or disable noise
- **Colors not updating**: Ensure proper state management
- **Scroll effects not working**: Check ScrollTrigger setup

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify all dependencies are loaded
3. Test with default settings first
4. Check browser compatibility

---

**Happy coding!** 🎨✨

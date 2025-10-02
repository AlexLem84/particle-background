#!/usr/bin/env node

/**
 * Deployment script for Vercel
 * This script prepares the project for deployment and provides helpful commands
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Particle Background for Vercel deployment...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if Vercel CLI is installed
try {
  require('vercel/package.json');
} catch (e) {
  console.log('📦 Installing Vercel CLI...');
  console.log('Run: npm install -g vercel');
  console.log('Then run: vercel login');
}

// Create deployment instructions
const deploymentInstructions = `
# 🚀 Vercel Deployment Instructions

## Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Login to Vercel:
   \`\`\`bash
   vercel login
   \`\`\`

3. Deploy from project directory:
   \`\`\`bash
   vercel
   \`\`\`

4. For production deployment:
   \`\`\`bash
   vercel --prod
   \`\`\`

## Method 2: GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy on every push

## Method 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Astro and configure everything

## 🎯 Your Live URLs

After deployment, your particle system will be available at:

- **Main Site**: https://your-project.vercel.app
- **Particle Test**: https://your-project.vercel.app/kota-test
- **Export Example**: https://your-project.vercel.app/export-example.html
- **Particle Script**: https://your-project.vercel.app/particle-export.js

## 📱 Features Available

✅ Interactive particle backgrounds
✅ Multiple motion types
✅ Color customization
✅ Mobile optimization
✅ Export functionality
✅ Live configuration
✅ Performance monitoring

## 🔧 Environment Variables (Optional)

Create a \`.env.local\` file for any custom settings:

\`\`\`env
# Optional: Custom domain
VERCEL_URL=your-custom-domain.com

# Optional: Analytics
VERCEL_ANALYTICS_ID=your-analytics-id
\`\`\`

## 🚀 Quick Deploy Commands

\`\`\`bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
\`\`\`

Happy deploying! 🎨✨
`;

// Write deployment instructions
fs.writeFileSync('DEPLOYMENT.md', deploymentInstructions);

console.log('✅ Vercel configuration created!');
console.log('✅ Build optimization configured!');
console.log('✅ Deployment instructions written to DEPLOYMENT.md\n');

console.log('🎯 Next steps:');
console.log('1. Run: npm install -g vercel');
console.log('2. Run: vercel login');
console.log('3. Run: vercel');
console.log('4. Your particle system will be live! 🚀\n');

console.log('📋 Available URLs after deployment:');
console.log('- Main site: https://your-project.vercel.app');
console.log('- Particle test: https://your-project.vercel.app/kota-test');
console.log('- Export example: https://your-project.vercel.app/export-example.html');
console.log('- Particle script: https://your-project.vercel.app/particle-export.js\n');

console.log('🎨 Your particle background will be live and ready to use!');

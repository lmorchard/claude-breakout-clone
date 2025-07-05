# Session Spec: GitHub Pages Deployment

## Overview

Deploy the completed Breakout clone game to GitHub Pages for public hosting and accessibility. The game will be automatically deployed from the main branch to `https://lmorchard.github.io/claude-breakout-clone/` using GitHub's modern Actions-based deployment method.

## Repository Context

- **Repository**: https://github.com/lmorchard/claude-breakout-clone
- **Deployment Target**: GitHub Pages (project repository)
- **Public URL**: https://lmorchard.github.io/claude-breakout-clone/
- **Source**: Vite-based Breakout game (TypeScript + Phaser)

## Goals

- Configure GitHub Pages deployment using modern GitHub Actions method
- Set up automated build and deployment pipeline
- Ensure game works correctly in hosted environment with proper base path
- Provide public URL for game access
- Maintain simple, fast deployment process

## Technical Requirements

### Deployment Setup
- **Platform**: GitHub Pages with GitHub Actions deployment
- **Build Process**: Vite production build
- **Base Path**: Environment-based configuration
  - Development: No base path (root `/`)
  - Production: `/claude-breakout-clone/` subdirectory
- **Assets**: Ensure all assets are properly referenced with correct base path

### Vite Configuration
- **Environment Variables**: Use conditional base path configuration
- **Development**: `base: '/'` for local development
- **Production**: `base: '/claude-breakout-clone/'` for GitHub Pages
- **Asset Resolution**: Ensure all static assets work with subdirectory deployment

### Automation
- **CI/CD**: GitHub Actions for automated deployment
- **Build Triggers**: Deploy automatically on every push to main branch
- **Node.js Version**: Latest LTS version
- **Deployment Method**: Direct GitHub Actions deployment (no gh-pages branch needed)
- **Pipeline Scope**: Build and deploy only (no linting/testing for now)
- **Error Handling**: Rely on GitHub's built-in notifications

### GitHub Actions Workflow
- **Trigger**: Push to main branch
- **Build Environment**: Latest Node.js LTS
- **Dependencies**: Standard npm install with caching for performance
- **Build Process**: `npm run build` to generate `dist` folder
- **Deployment**: Deploy `dist` contents directly to GitHub Pages
- **Permissions**: Proper GitHub Pages deployment permissions

## Success Criteria

- [ ] Vite config properly handles environment-based base path
- [ ] GitHub Actions workflow builds project successfully
- [ ] Game deploys successfully to GitHub Pages
- [ ] Public URL https://lmorchard.github.io/claude-breakout-clone/ is accessible
- [ ] All game functionality works in hosted environment
- [ ] Assets load correctly with subdirectory base path
- [ ] Automated deployment triggers on main branch pushes
- [ ] Build failures are reported through GitHub notifications

## Implementation Phases

### Phase 1: Vite Configuration
- Update Vite config for environment-based base path
- Test local build works with both configurations
- Verify production build generates correct asset paths

### Phase 2: GitHub Actions Setup
- Create `.github/workflows/deploy.yml`
- Configure Node.js LTS environment
- Set up build and deployment steps
- Configure GitHub Pages deployment permissions

### Phase 3: Deployment and Testing
- Enable GitHub Pages in repository settings
- Trigger initial deployment
- Verify game functionality in hosted environment
- Test all features work with subdirectory base path

## Dependencies

### Existing Setup
- Functional Vite + TypeScript + Phaser Breakout game
- GitHub repository with main branch
- Local development environment working

### GitHub Configuration
- GitHub Pages enabled for repository
- GitHub Actions permissions configured
- Repository deployment settings configured for Actions method
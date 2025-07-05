# Session Plan: GitHub Pages Deployment

## Implementation Steps

### Phase 1: Vite Configuration
1. **Update Vite config for environment-based base path**
   - Read current vite.config.ts
   - Add conditional base path using environment variables
   - Development: `base: '/'` for local development
   - Production: `base: '/claude-breakout-clone/'` for GitHub Pages

2. **Test local build process**
   - Verify current build works locally
   - Test production build with new base path configuration
   - Verify asset paths are correctly generated

### Phase 2: GitHub Actions Setup
3. **Create GitHub Actions workflow**
   - Create `.github/workflows/deploy.yml`
   - Configure trigger for pushes to main branch
   - Set up Node.js LTS environment
   - Add npm install with caching
   - Configure Vite build step
   - Set up GitHub Pages deployment

4. **Configure workflow permissions**
   - Set proper permissions for GitHub Pages deployment
   - Ensure workflow can write to repository and deploy

### Phase 3: Deployment and Testing
5. **Initial deployment**
   - Commit and push changes to trigger deployment
   - Monitor GitHub Actions workflow execution
   - Verify deployment completes successfully

6. **Verify hosted game functionality**
   - Access https://lmorchard.github.io/claude-breakout-clone/
   - Test all game features work correctly
   - Verify assets load properly with subdirectory base path
   - Confirm responsive design works in hosted environment

## Technical Approach

### Environment-Based Configuration
- Use process.env.NODE_ENV or custom environment variable
- Conditional base path in Vite config
- Ensure assets resolve correctly in both environments

### GitHub Actions Deployment
- Modern GitHub Actions deployment method (no gh-pages branch)
- Latest Node.js LTS for consistency
- Simple build-and-deploy pipeline
- Standard GitHub notifications for errors

### Testing Strategy
- Local build testing before deployment
- Verify production build generates correct paths
- End-to-end testing in hosted environment

## Dependencies

### Local Environment
- Functional Vite + TypeScript + Phaser Breakout game
- Working npm/node environment
- Git repository with main branch

### GitHub Configuration
- Repository at https://github.com/lmorchard/claude-breakout-clone
- GitHub Pages will be enabled via Actions deployment
- No additional GitHub configuration needed initially
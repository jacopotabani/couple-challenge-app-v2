# AI Coding Agent Instructions

## Project Overview

This is a cross-platform monorepo built with Tamagui + Solito + Next.js + Expo, supporting both web and native mobile applications with shared business logic and UI components.

## Architecture & Structure

### Monorepo Layout

- `apps/expo/` - React Native/Expo mobile app (iOS/Android)
- `apps/next/` - Next.js web application (App Router)
- `packages/app/` - Shared business logic, features, and providers
- `packages/ui/` - Tamagui-based design system and UI components
- `packages/auth/` - Better Auth integration for authentication
- `packages/config/` - Shared configuration files

### Key Architectural Patterns

**Feature-Based Organization**: Use `packages/app/features/` not `screens/`. Each feature contains its platform-specific implementations:

- `screen.tsx` - Native mobile component
- `screen.web.tsx` - Web-specific component (when different from native)
- `layout.web.tsx` - Web layout components

**Platform Routing**:

- Expo: File-based routing in `apps/expo/app/` using Expo Router
- Next.js: App Router in `apps/next/app/`
- Shared navigation: Use Solito's `useLink()` and `useRouter()` for cross-platform navigation

**Authentication Flow**:

- Better Auth with MongoDB adapter (`packages/auth/better-auth.ts`)
- Expo plugin for native support
- Trusted origins configured for local dev and mobile schemes
- Auth state managed via `@my/auth/client/auth-client`

## Development Workflows

### Essential Commands

```bash
# Install dependencies (always run from root)
yarn

# Development
yarn web          # Next.js development server
yarn native       # Expo development server
yarn ios          # iOS simulator
yarn android      # Android emulator

# Build
yarn build        # Build all packages
yarn web:prod     # Production Next.js build

# Database
docker-compose up # Start MongoDB (localhost:27017)
```

### Testing & Linting

- Vitest for testing (`yarn test`, `yarn test:watch`)
- Biome for linting/formatting (configured to error on `console.log`)
- Use `useImportType` rule - prefer type imports

## Critical Conventions

### Import Patterns

```typescript
// Correct: Use workspace aliases
import { Button } from '@my/ui'
import { authClient } from '@my/auth/client/auth-client'

// Avoid: Direct package imports that break tree-shaking
import { something } from 'packages/app/features/...'
```

### Cross-Platform Components

```typescript
// Feature components should handle platform differences
// Use `.native.tsx` and `.web.tsx` extensions when needed
// Example: ProfileScreen has different implementations

// Native: Uses DrawerContentScrollView from @react-navigation/drawer
// Web: Uses custom Popover-based navigation
```

### Navigation & Routing

```typescript
// Use Solito for cross-platform navigation
import { useLink, useRouter } from 'solito/navigation'

const linkProps = useLink({ href: '/profile/edit' })
const router = useRouter()
router.push('/dashboard')
```

### UI Component Patterns

- Tamagui components: Use `$` tokens (`$4`, `$sm`, `$color10`)
- Responsive design: Use `$sm`, `$gtSm` breakpoint props
- Theme variants: Components support `accentTheme` prop
- Platform detection: Use `Platform.OS === 'web'` for web-specific logic

## Integration Points

### State Management

- React state and context patterns
- Auth state via Better Auth hooks (`authClient.useSession()`)
- No global state management library - uses React patterns

### External Dependencies

- **MongoDB**: Local development via Docker, connection configured in `.env`
- **Better Auth**: Handles OAuth (Google), email/password auth
- **Tamagui**: UI library with compile-time optimizations
- **Expo**: Native capabilities (image picker, document picker, secure store)

### Build System

- **Turbo**: Monorepo task runner (`turbo.json`)
- **Yarn Workspaces**: Dependency management
- **Tamagui Compiler**: CSS extraction for web builds
- **Metro**: React Native bundler for Expo app

## Common Gotchas

1. **Dependency Installation**: Install pure JS deps in `packages/app`, native deps in `apps/expo`
2. **Tree Shaking**: Don't re-export from `packages/app/index.ts` (breaks Next.js optimization)
3. **Platform Files**: Use `.native.tsx`/`.web.tsx` when implementations differ significantly
4. **Tamagui Extraction**: Set `DISABLE_EXTRACTION=false` for testing optimized builds
5. **Navigation**: Drawer navigation on native, popover-based nav on web - different UX patterns
6. **Image Handling**: Use `SolitoImage` from solito/image for cross-platform images

## File Patterns to Follow

- `packages/app/features/[feature]/screen.tsx` - Main component
- `packages/app/features/[feature]/screen.web.tsx` - Web-specific variant
- `apps/expo/app/[route]/_layout.tsx` - Expo route layouts
- `apps/next/app/[route]/layout.tsx` - Next.js route layouts
- Component imports should use `@my/*` workspace aliases

This setup prioritizes code sharing while allowing platform-specific optimizations where needed.

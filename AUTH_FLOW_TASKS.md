# Auth Flow Implementation Tasks

## Overview
This document outlines the tasks needed to create a unified authentication flow across Next.js (web) and Expo (mobile) platforms, ensuring consistent routing, auth state management, and user experience.

## Project Context
- **Next.js**: Using App Router with server-side auth protection
- **Expo**: Using Expo Router with file-based routing
- **Auth Provider**: Better Auth with MongoDB adapter
- **Navigation**: Solito for cross-platform navigation compatibility
- **UI**: Tamagui components with platform-specific layouts

---

## Phase 1: Analysis & Planning

### Task 1: Analyze current auth routing structure
**Status**: 🔄 In Progress  
**Priority**: High  
**Estimated Time**: 2-3 hours

**Objectives**:
- Document current Next.js auth routes and protection mechanisms
- Analyze existing Expo auth implementation
- Identify auth state management inconsistencies
- Map out current navigation flows

**Current State Analysis**:
- **Next.js Routes**:
  - `/auth/sign-in` - Sign-in page with AuthLayoutWrapper
  - `/auth/sign-up` - Sign-up page with AuthLayoutWrapper  
  - `/private/*` - Protected routes with server-side auth check
  - `/private/layout.tsx` - Server component with session validation
- **Expo Routes**:
  - `/auth/sign-in.tsx` - Using OLD_lib/auth/auth-client ❌
  - `/auth/sign-up.tsx` - Basic implementation
  - `/(drawer)/` - Drawer navigation structure
  - Missing route protection ❌

**Deliverables**:
- [ ] Complete audit of existing auth routes
- [ ] Document auth state management differences
- [ ] Identify security gaps in Expo implementation
- [ ] List files that need to be updated/created

---

### Task 2: Create unified auth route structure
**Status**: ⏳ Not Started  
**Priority**: High  
**Estimated Time**: 1-2 hours

**Objectives**:
- Define consistent route structure for both platforms
- Plan navigation flows and user journey
- Document expected behaviors for each route

**Proposed Route Structure**:
```
Public Routes (Unauthenticated Users):
├── / (landing/home page)
├── /auth/sign-in
└── /auth/sign-up

Private Routes (Authenticated Users):
├── /private/dashboard (main entry point)
├── /profile/edit
├── /settings
└── [other protected routes]

Navigation Flow:
- Unauthenticated → /auth/sign-in
- After login → /private/dashboard  
- Logout → /auth/sign-in
- Deep link protection → redirect to /auth/sign-in if not authenticated
```

**Platform-Specific Considerations**:
- **Web**: Popover-based navigation in PrivateLayout
- **Mobile**: Drawer navigation with ProfileScreen as drawer content
- **Auth Guards**: Server-side for Next.js, client-side for Expo

**Deliverables**:
- [ ] Finalized route structure documentation
- [ ] Navigation flow diagrams
- [ ] Platform-specific implementation notes

---

## Phase 2: Expo Auth Implementation

### Task 3: Set up Expo auth route guards
**Status**: ⏳ Not Started  
**Priority**: High  
**Estimated Time**: 4-5 hours

**Objectives**:
- Implement route protection similar to Next.js private layout
- Create middleware for unauthenticated route access
- Handle auth state changes and redirects

**Implementation Plan**:
1. Create `AuthGuard` component for protected routes
2. Update Expo router layouts to include auth protection
3. Implement redirect logic for unauthenticated access
4. Handle loading states during auth check

**Files to Create/Update**:
- `apps/expo/app/private/_layout.tsx` - Auth protection wrapper
- `packages/app/components/AuthGuard.tsx` - Reusable auth guard
- `apps/expo/app/_layout.tsx` - Global auth state handling

**Deliverables**:
- [ ] AuthGuard component implementation
- [ ] Protected route layouts
- [ ] Redirect logic for auth failures

---

### Task 4: Fix Expo auth state management
**Status**: ⏳ Not Started  
**Priority**: Critical  
**Estimated Time**: 2-3 hours

**Objectives**:
- Replace `OLD_lib/auth/auth-client` with `@my/auth/client/auth-client`
- Ensure consistent auth hooks usage across platforms
- Fix auth state synchronization issues

**Current Issues**:
- Expo sign-in screen imports from `../../OLD_lib/auth/auth-client`
- Inconsistent auth client usage
- Missing auth state persistence on mobile

**Implementation Steps**:
1. Update all Expo auth imports to use `@my/auth/client/auth-client`
2. Implement proper auth state persistence for mobile
3. Add auth session validation
4. Test auth state consistency

**Files to Update**:
- `apps/expo/app/auth/sign-in.tsx`
- `apps/expo/app/auth/sign-up.tsx`
- Any other files using old auth client

**Deliverables**:
- [ ] Updated auth client imports
- [ ] Consistent auth state management
- [ ] Mobile auth persistence working

---

### Task 5: Implement Expo private area layout
**Status**: ⏳ Not Started  
**Priority**: High  
**Estimated Time**: 3-4 hours

**Objectives**:
- Create native equivalent of Next.js PrivateLayout
- Set up drawer navigation with proper content
- Integrate user profile and navigation items

**Implementation Plan**:
1. Create `PrivateLayout.native.tsx` component
2. Configure drawer navigation with ProfileScreen content
3. Add navigation items and user profile integration
4. Ensure responsive design for different screen sizes

**Design Requirements**:
- Drawer with user profile at bottom
- Navigation items matching web version
- Settings and logout functionality
- Consistent styling with Tamagui theme

**Files to Create**:
- `packages/app/features/private/layout.native.tsx`
- Update existing drawer configuration
- Navigation components for mobile

**Deliverables**:
- [ ] Native private layout implementation
- [ ] Drawer navigation setup
- [ ] User profile integration

---

## Phase 3: Cross-Platform Navigation

### Task 6: Create cross-platform navigation components
**Status**: ⏳ Not Started  
**Priority**: Medium  
**Estimated Time**: 3-4 hours

**Objectives**:
- Standardize navigation using Solito's useRouter and useLink
- Ensure identical behavior across platforms
- Create reusable navigation components

**Implementation Areas**:
1. Update all navigation to use Solito hooks
2. Create platform-agnostic navigation components
3. Ensure deep linking works consistently
4. Test navigation state persistence

**Files to Update**:
- All components using navigation
- Replace platform-specific routing with Solito
- Update link components

**Deliverables**:
- [ ] Solito navigation implementation
- [ ] Cross-platform navigation components
- [ ] Consistent routing behavior

---

### Task 7: Set up auth redirect logic
**Status**: ⏳ Not Started  
**Priority**: High  
**Estimated Time**: 2-3 hours

**Objectives**:
- Implement consistent redirect logic across platforms
- Handle post-login navigation
- Manage deep link protection

**Redirect Scenarios**:
- **After Login**: → `/private/dashboard`
- **After Logout**: → `/auth/sign-in`
- **Unauthenticated Access**: → `/auth/sign-in` with return URL
- **Authenticated Auth Pages**: → `/private/dashboard`

**Implementation Requirements**:
1. Create redirect utility functions
2. Handle return URLs for deep links
3. Implement loading states during redirects
4. Test edge cases and error scenarios

**Deliverables**:
- [ ] Redirect utility functions
- [ ] Deep link protection
- [ ] Consistent redirect behavior

---

## Phase 4: Testing & Validation

### Task 8: Test auth flow end-to-end
**Status**: ⏳ Not Started  
**Priority**: High  
**Estimated Time**: 3-4 hours

**Objectives**:
- Validate complete auth flow on both platforms
- Ensure consistent user experience
- Test edge cases and error scenarios

**Test Scenarios**:
1. **Sign-up Flow**: New user registration → email verification → login
2. **Sign-in Flow**: Existing user login → dashboard access
3. **Route Protection**: Accessing private routes while unauthenticated
4. **Session Management**: Token refresh, logout, session expiry
5. **Deep Links**: Direct access to protected routes
6. **Navigation**: Consistent behavior between platforms

**Testing Checklist**:
- [ ] Web auth flow complete
- [ ] Mobile auth flow complete
- [ ] Cross-platform consistency verified
- [ ] Error handling working
- [ ] Loading states appropriate
- [ ] Deep links protected
- [ ] Session persistence working

**Deliverables**:
- [ ] Test results documentation
- [ ] Bug fixes for identified issues
- [ ] Performance optimization notes

---

## Implementation Notes

### Key Dependencies
- `@my/auth/client/auth-client` - Unified auth client
- `solito/navigation` - Cross-platform navigation
- `@react-navigation/drawer` - Mobile drawer navigation
- `better-auth` - Authentication provider

### File Organization
```
packages/app/features/
├── auth/
│   ├── components/
│   ├── SignInScreen.tsx
│   └── AuthLayoutWrapper.tsx
├── private/
│   ├── layout.web.tsx (existing)
│   ├── layout.native.tsx (new)
│   └── nav-tabs.web.tsx
└── components/
    └── AuthGuard.tsx (new)

apps/expo/app/
├── auth/
│   ├── sign-in.tsx (update)
│   └── sign-up.tsx (update)
├── private/
│   ├── _layout.tsx (new)
│   └── dashboard/
└── _layout.tsx (update)

apps/next/app/
├── auth/ (existing)
├── private/ (existing)
└── layout.tsx
```

### Success Criteria
- ✅ Unified auth state management across platforms
- ✅ Consistent routing and navigation behavior  
- ✅ Proper route protection on both web and mobile
- ✅ Seamless user experience between platforms
- ✅ Secure authentication flow with proper session handling

---

**Next Steps**: Begin with Task 1 (Analysis) to establish current state baseline before implementing changes.
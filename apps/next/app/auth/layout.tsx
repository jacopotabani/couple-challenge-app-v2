import { AuthLayout } from 'app/features/auth/layout.web'

export default function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}

import { AuthLayoutWrapper } from 'app/features/auth/AuthLayoutWrapper'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
}

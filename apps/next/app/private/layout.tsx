import { PrivateLayout } from 'app/features/private/layout.web'

export default function PrivateLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <PrivateLayout>{children}</PrivateLayout>
}

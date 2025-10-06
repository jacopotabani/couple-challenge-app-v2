import { CoupleDetailScreen } from '@my/app/features/couples/detail-screen'

interface PageProps {
  params: {
    coupleId: string
  }
}

export default function Page({ params }: PageProps) {
  return <CoupleDetailScreen coupleId={params.coupleId} />
}

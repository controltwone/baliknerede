import Feed from "@/components/Feed";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'Balık avcıları için sosyal platform. Nerede, ne zaman, hangi balığı yakaladığını paylaş. Diğer avcılarla deneyimlerini paylaş ve yeni av noktaları keşfet.',
  openGraph: {
    title: 'Balık Nerede - Balık Avcıları İçin Sosyal Platform',
    description: 'Balık avcıları için sosyal platform. Nerede, ne zaman, hangi balığı yakaladığını paylaş.',
    url: 'https://baliknerde.com',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Balık Nerede - Balık Avcıları İçin Sosyal Platform',
      },
    ],
  },
}

export default function Home() {
  return (
    <div className="py-4 page-content">
      <div className="rounded-xl bg-transparent p-4">
        <Feed />
      </div>
    </div>
  );
}

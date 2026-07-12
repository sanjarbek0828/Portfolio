import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sanjarbek Otabekov Portfolio',
    short_name: 'Sanjarbek',
    description: 'Full-Stack Developer & UI/UX Designer Portfolio',
    start_url: '/',
    display: 'standalone',
    background_color: '#020611',
    theme_color: '#4569ff',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

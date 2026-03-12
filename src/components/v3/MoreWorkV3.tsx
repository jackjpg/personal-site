"use client";

import Link from 'next/link';

interface Project {
  slug: string;
  title: string;
  href: string;
  media: string;
  isVideo?: boolean;
}

const projects: Project[] = [
  {
    slug: 'pov',
    title: 'Generative statuses from screenshots',
    href: '/case/pov',
    media: '/Project_reactions/Seenit_pov_distribution.mov',
    isVideo: true,
  },
  {
    slug: 'post-sale',
    title: 'Building trust after the sale',
    href: '/case/post-sale',
    media: '/Project_post-sale/hero_bmwpostsale.png',
  },
  {
    slug: 'seenit-identity',
    title: 'AI-generated identity system',
    href: '/case/seenit-identity',
    media: '/Project_seenit-identity/seenit-identity.mov',
    isVideo: true,
  },
  {
    slug: 'verification',
    title: 'Improving first-time approval',
    href: '/case/verification',
    media: '/Project_verification/verification-hero.png',
  },
];

interface MoreWorkV3Props {
  current: string;
}

export default function MoreWorkV3({ current }: MoreWorkV3Props) {
  const currentIndex = projects.findIndex(p => p.slug === current);
  if (currentIndex === -1) return null;

  const next1 = projects[(currentIndex + 1) % projects.length];
  const next2 = projects[(currentIndex + 2) % projects.length];
  const nextProjects = [next1, next2];

  return (
    <section className="more-seenit-section">
      <h2 className="more-seenit-title">More work</h2>
      <div className="homepage-grid" style={{ padding: 0 }}>
        {nextProjects.map(project => (
          <Link
            key={project.slug}
            href={project.href}
            className="homepage-grid-item"
          >
            <div className="homepage-grid-item-media">
              {project.isVideo ? (
                <video
                  src={project.media}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={project.media}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              <div className="homepage-grid-item-overlay">
                <span className="homepage-grid-item-overlay-title">{project.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

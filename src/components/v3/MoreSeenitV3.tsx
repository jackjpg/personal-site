"use client";

import Link from 'next/link';

interface SeenitProject {
  id: string;
  title: string;
  href: string;
  video: string;
}

const seenitProjects: SeenitProject[] = [
  {
    id: 'pov',
    title: 'Turning screenshots into statuses',
    href: '/case/pov',
    video: '/Project_pov/Seenit-remix-transparent.mov'
  },
  {
    id: 'seenit-identity',
    title: 'Onboarding into a single tap',
    href: '/case/seenit-identity',
    video: '/Project_seenit-identity/Seenit-identity-transparent.mov'
  },
  {
    id: 'reactions',
    title: 'Lowering the cost of replying',
    href: '/case/reactions',
    video: '/Project_reactions/Seenit-reactions-transparent.mov'
  }
];

interface MoreSeenitV3Props {
  current: 'pov' | 'seenit-identity' | 'reactions';
}

export default function MoreSeenitV3({ current }: MoreSeenitV3Props) {
  const otherProjects = seenitProjects.filter(p => p.id !== current);

  return (
    <section className="more-seenit-section">
      <h2 className="more-seenit-title">More from Seenit</h2>
      <div className="homepage-grid" style={{ padding: 0 }}>
        {otherProjects.map(project => (
          <Link
            key={project.id}
            href={project.href}
            className="homepage-grid-item"
          >
            <div className="homepage-grid-item-media">
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
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

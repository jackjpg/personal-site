"use client";

import { useState } from "react";
import Link from "next/link";

// Project data
const projects = [
  {
    title: "Seenit POVs",
    description: "Generative statuses from screenshots",
    href: "/case/pov",
    media: "/Project_pov/POV_1.png",
    isVideo: false,
  },
  {
    title: "Motorway Last Mile",
    description: "Building trust after the sale",
    href: "/case/post-sale",
    media: "/Icons/MW_postsale_thumb@3x.png",
    isVideo: false,
  },
  {
    title: "Seenit Identity",
    description: "AI-generated identity system",
    href: "/case/seenit-identity",
    media: ["/Project_seenit-identity/Onboarding_3.png", "/Icons/Seenitidentity2.png"],
    isVideo: false,
    isMultiple: true,
  },
  {
    title: "Seenit Reactions",
    description: "Lowering the cost of replying",
    href: "/case/reactions",
    media: ["/Project_reactions/Reaction_1.png", "/Project_reactions/Reaction_2.png"],
    isVideo: false,
    isMultiple: true,
  },
  {
    title: "Motorway Verification",
    description: "Improving first-time approval",
    href: "/case/verification",
    media: "/Icons/verifiction_hero.png",
    isVideo: false,
  },
];

// Lessons data
const lessons = [
  "Start from emotional intent",
  "Design the rubric it scores itself against",
  "Tone is the interface",
  "Specificity beats blandness",
  "Prompt structure is a design system",
];

function LeftArrow() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 43L6 28L20 13" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 28H50" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function RightArrow() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M36 13L50 28L36 43" stroke="currentColor" strokeWidth="2"/>
      <path d="M50 28H6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function ContactArrow() {
  return (
    <img
      src="/Icons/Arrow_link.svg"
      alt=""
      width="20"
      height="20"
      className="homepage-v2-contact-arrow"
    />
  );
}

export default function HomePageV2() {
  const [currentProject, setCurrentProject] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeProject = (newIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // After scale down, change the project
    setTimeout(() => {
      setCurrentProject(newIndex);
      // After a brief moment, end transition (pop back)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 30);
    }, 120);
  };

  const goToPrevious = () => {
    const newIndex = currentProject === 0 ? projects.length - 1 : currentProject - 1;
    changeProject(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentProject === projects.length - 1 ? 0 : currentProject + 1;
    changeProject(newIndex);
  };

  const project = projects[currentProject];

  return (
    <div className="homepage-v2">
      {/* Navigation */}
      <nav className="homepage-v2-nav">
        <div className="homepage-v2-nav-left">
          <h1>Jack Parrish</h1>
          <p>Designing consumer AI and marketplaces</p>
        </div>
      </nav>

      {/* Projects Section */}
      <section className="homepage-v2-section">
        <div className="homepage-v2-carousel">
          <div className={`homepage-v2-carousel-content ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="homepage-v2-carousel-image">
            {projects.map((p, index) => (
              <div
                key={p.title}
                className={`homepage-v2-carousel-media ${index === currentProject ? 'active' : ''}`}
              >
                {p.isVideo ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={p.media as string} type="video/webm" />
                  </video>
                ) : p.isMultiple ? (
                  <div className="homepage-v2-carousel-multiple">
                    {(p.media as string[]).map((src, i) => (
                      <img key={i} src={src} alt={`${p.title} ${i + 1}`} />
                    ))}
                  </div>
                ) : (
                  <img src={p.media as string} alt={p.title} />
                )}
              </div>
            ))}
            <div className="homepage-v2-carousel-nav">
              <button
                className="homepage-v2-carousel-nav-left"
                onClick={goToPrevious}
                aria-label="Previous project"
              >
                <span className="homepage-v2-carousel-arrow">
                  <LeftArrow />
                </span>
              </button>
              <button
                className="homepage-v2-carousel-nav-right"
                onClick={goToNext}
                aria-label="Next project"
              >
                <span className="homepage-v2-carousel-arrow">
                  <RightArrow />
                </span>
              </button>
            </div>
          </div>
          <div className="homepage-v2-carousel-info">
            <div className="homepage-v2-carousel-text">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <Link href={project.href} className="homepage-v2-btn">
              View project
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Lessons Section */}
      <section className="homepage-v2-section">
        <h2 className="homepage-v2-section-title">Notes on designing with LLMs</h2>
        <ol className="homepage-v2-lessons">
          {lessons.map((lesson, index) => (
            <li key={index}>
              <span className="homepage-v2-lessons-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="homepage-v2-lessons-text">{lesson}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Experience Section */}
      <section className="homepage-v2-section">
        <h2 className="homepage-v2-section-title">Experience</h2>
        <div className="homepage-v2-experience">
          <div className="homepage-v2-experience-item">
            <div className="homepage-v2-experience-left">
              <span className="homepage-v2-experience-role">Founding Product Designer</span>
              <span className="homepage-v2-experience-company">Seenit</span>
            </div>
            <span className="homepage-v2-experience-date">Aug 2025 - Present</span>
          </div>
          <div className="homepage-v2-experience-item">
            <div className="homepage-v2-experience-left">
              <span className="homepage-v2-experience-role">Lead Product Designer</span>
              <span className="homepage-v2-experience-company">Motorway</span>
            </div>
            <span className="homepage-v2-experience-date">Dec 2024 - Jul 2025</span>
          </div>
          <div className="homepage-v2-experience-item">
            <div className="homepage-v2-experience-left">
              <span className="homepage-v2-experience-role">Senior Product Designer</span>
              <span className="homepage-v2-experience-company">Motorway</span>
            </div>
            <span className="homepage-v2-experience-date">Jul 2021 - Dec 2024</span>
          </div>
          <div className="homepage-v2-experience-item">
            <div className="homepage-v2-experience-left">
              <span className="homepage-v2-experience-role">Product Designer</span>
              <span className="homepage-v2-experience-company">Festicket (Acq)</span>
            </div>
            <span className="homepage-v2-experience-date">May 2018 - Sep 2020</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="homepage-v2-section">
        <h2 className="homepage-v2-section-title">Contact</h2>
        <div className="homepage-v2-contact">
          <a href="mailto:parrish.jack@gmail.com">
            <ContactArrow />
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/jjackparrish"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ContactArrow />
            LinkedIn
          </a>
          <a
            href="https://x.com/_jackparrish"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ContactArrow />
            X
          </a>
        </div>
      </section>
    </div>
  );
}

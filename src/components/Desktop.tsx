"use client";

import Link from "next/link";
import { icons } from "@/lib/icons";

export default function Desktop() {
  // Filter to only show project routes
  const projects = icons.filter(icon => icon.kind === "route");

  return (
    <div className="homepage-grid-wrapper">
      <div className="homepage-grid">
        {projects.map((project) => {
          const previewMedia = project.previewImage;
          const isVideo = previewMedia?.match(/\.(mp4|mov|webm)$/i);

          return (
            <Link
              key={project.id}
              href={project.href}
              className="homepage-grid-item"
            >
              <div className="homepage-grid-item-media">
                {isVideo && previewMedia ? (
                  <video
                    src={previewMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : previewMedia ? (
                  <img
                    src={previewMedia}
                    alt={project.text || project.label}
                  />
                ) : (
                  <div
                    className="homepage-grid-item-placeholder"
                    style={{ backgroundColor: project.bgColor }}
                  >
                    <span>{project.text}</span>
                  </div>
                )}
                <div className="homepage-grid-item-overlay">
                  <span className="homepage-grid-item-overlay-title">{project.text}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

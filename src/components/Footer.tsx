"use client";

import Image from "next/image";

interface FooterProps {
  interClassName?: string;
}

export default function Footer({ interClassName }: FooterProps) {
  const socialLinks = [
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com",
      icon: "/Social/ig.jpg"
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: "/Social/linkedin.jpg"
    },
    {
      id: "x",
      label: "X (Twitter)",
      href: "https://x.com",
      icon: "/Social/x-social.jpg"
    }
  ];

  return (
    <footer className={`siteFooter ${interClassName || ''}`}>
      <div className="siteFooter__leading">
        © 2025 All rights reserved
      </div>
      <div className="siteFooter__centre">
        Images created using generative ai, as visual interpretations of mood and memory
      </div>
      <div className="siteFooter__trailing">
        <div className="siteFooter__socialIcons">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="siteFooter__socialIcon"
            >
              <div className="siteFooter__iconWrapper">
                <Image
                  src={social.icon}
                  alt=""
                  fill
                  sizes="24px"
                  quality={95}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}


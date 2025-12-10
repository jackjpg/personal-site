"use client";

import Link from "next/link";

interface FooterV3Props {
  links?: Array<{
    title: string;
    href: string;
  }>;
}

export default function FooterV3({ links = [] }: FooterV3Props) {
  if (links.length === 0) {
    return null;
  }

  return (
    <footer className="case-study-v3-footer">
      <div className="case-study-v3-footer__content">
        <h2 className="case-study-v3-footer__title">See more</h2>
        <nav className="case-study-v3-footer__links">
          {links.map((link, index) => (
            <Link key={index} href={link.href} className="case-study-v3-footer__link">
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}


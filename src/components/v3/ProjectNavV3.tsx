"use client";

import Link from "next/link";

interface ProjectNavV3Props {
  title: string;
  date?: string;
}

export default function ProjectNavV3({ title, date }: ProjectNavV3Props) {
  return (
    <nav className="case-study-v3-nav">
      <Link href="/" className="case-study-v3-nav__back">
        <svg 
          width="56" 
          height="56" 
          viewBox="0 0 56 56" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
          aria-label="Back to home"
        >
          <path d="M20 43L6 28L20 13" stroke="#250E00" strokeWidth="2"/>
          <path d="M6 28H50" stroke="#250E00" strokeWidth="2"/>
        </svg>
      </Link>
      <div className="case-study-v3-nav__center">
        <h1 className="case-study-v3-nav__title">{title}</h1>
        {date && <p className="case-study-v3-nav__date">{date}</p>}
      </div>
    </nav>
  );
}


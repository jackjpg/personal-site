"use client";

import Link from "next/link";
import Image from "next/image";

interface ProjectNavV3Props {
  title: string;
  date?: string;
}

export default function ProjectNavV3({ title, date }: ProjectNavV3Props) {
  return (
    <nav className="case-study-v3-nav">
      <Link href="/" className="case-study-v3-nav__back">
        <Image 
          src="/Icons/Arrow full.svg"
          alt="Back to home"
          width={56}
          height={56}
          style={{ display: 'block' }}
        />
      </Link>
      <div className="case-study-v3-nav__center">
        <h1 className="case-study-v3-nav__title">{title}</h1>
        {date && <p className="case-study-v3-nav__date">{date}</p>}
      </div>
    </nav>
  );
}


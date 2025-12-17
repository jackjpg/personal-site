"use client";

import Link from "next/link";

export default function Header({ interClassName }: { interClassName: string }) {
  return (
    <header className={`siteHeader ${interClassName}`}>
      <div className="siteHeader__content">
        <div className="siteHeader__leadingGroup">
          <Link href="/" className="siteHeader__leading">
            Jack Parrish
          </Link>
        </div>
        <a 
          href="mailto:parrish.jack@gmail.com" 
          className="siteHeader__trailing"
        >
          Contact
        </a>
      </div>
    </header>
  );
}

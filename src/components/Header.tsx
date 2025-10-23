"use client";

import Link from "next/link";

export default function Header({ interClassName }: { interClassName: string }) {
  return (
    <header className={`siteHeader ${interClassName}`}>
      <div className="siteHeader__content">
        <div className="siteHeader__leadingGroup">
          <a 
            href="https://www.linkedin.com/in/jackparrish/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="siteHeader__linkedin"
          >
            <img 
              src="/Icons/linkedin.png" 
              alt="LinkedIn" 
              width={24} 
              height={24}
              style={{ borderRadius: '50%', display: 'block' }}
            />
          </a>
          <Link href="/" className="siteHeader__leading">
            JACK PARRISH
          </Link>
        </div>
        <a 
          href="mailto:parrish.jack@gmail.com" 
          className="siteHeader__trailing"
        >
          CONTACT
        </a>
      </div>
    </header>
  );
}

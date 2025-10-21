"use client";

export default function Header({ interClassName }: { interClassName: string }) {
  return (
    <header className={`siteHeader ${interClassName}`}>
      <div className="siteHeader__content">
        <div className="siteHeader__leading">JACK PARRISH</div>
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

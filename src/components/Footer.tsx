import Image from "next/image";

export default function Footer() {
  return (
    <footer className="siteFooter" role="contentinfo" aria-label="Site footer">
      <span className="siteFooter__text">Website vibe-coded using Cursor</span>
      <span className="siteFooter__spacer" />
      <a
        href="https://www.instagram.com/jackparrish/"
        target="_blank"
        rel="noopener noreferrer"
        className="siteFooter__link"
      >
        <Image
          className="siteFooter__icon"
          src="/Social/ig.jpg"
          alt="Instagram"
          width={16}
          height={16}
        />
      </a>
    </footer>
  );
}
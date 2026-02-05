export default function Footer({ interClassName }: { interClassName: string }) {
  return (
    <footer className={`siteFooter ${interClassName}`}>
      <div className="siteFooter__content">
        <span className="siteFooter__text">Need to reach me?</span>
        <div className="siteFooter__links">
          <a href="mailto:parrish.jack@gmail.com" className="siteFooter__link">Email</a>
          <a href="https://www.linkedin.com/in/jjackparrish" target="_blank" rel="noopener noreferrer" className="siteFooter__link">Linkedin</a>
          <a href="https://x.com/_jackparrish" target="_blank" rel="noopener noreferrer" className="siteFooter__link">X</a>
        </div>
      </div>
      <div className="siteFooter__spacer"></div>
    </footer>
  );
}

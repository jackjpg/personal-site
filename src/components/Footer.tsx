export default function Footer({ interClassName }: { interClassName: string }) {
  return (
    <footer className={`siteHeader ${interClassName}`}>
      <div className="siteHeader__content">
        <p className="case-study-v3-body">
          Send me an <a href="mailto:parrish.jack@gmail.com">email</a>, follow me on <a href="https://x.com/_jackparrish" target="_blank" rel="noopener noreferrer">twitter</a> or download my <a href="/Icons/jackparrish-resume-2026.pdf" target="_blank" rel="noopener noreferrer">resume</a>
        </p>
      </div>
    </footer>
  );
}

import dynamic from "next/dynamic";

// Dynamically import Desktop to code-split Framer Motion
// Desktop is already a client component, so it will only render on client
const Desktop = dynamic(() => import("@/components/Desktop"), {
  loading: () => (
    <div className="desktop">
      <div className="workspace" style={{ height: 'calc(100vh - 72px)', marginTop: '16px', marginLeft: '24px', marginRight: '24px' }} />
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Desktop />
    </>
  );
}

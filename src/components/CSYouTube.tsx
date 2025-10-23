interface CSYouTubeProps {
  url: string;
  title?: string;
}

export default function CSYouTube({ url, title }: CSYouTubeProps) {
  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);
  
  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  return (
    <figure className="cs-image-figure" style={{ margin: '32px 0', maxWidth: '810px' }}>
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '0',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#000'
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?vq=hd1080&autoplay=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&start=0&end=0&loop=0&controls=1&disablekb=0&enablejsapi=0`}
          title={title || 'YouTube video'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </figure>
  );
}

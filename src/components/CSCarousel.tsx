import CSCarouselInteractive from './CSCarouselInteractive';

interface CSCarouselProps {
  images?: string[];
  captions?: string[];
  items?: number;
  fullWidth?: boolean;
}

export default function CSCarousel(props: CSCarouselProps) {
  return <CSCarouselInteractive {...props} />;
}

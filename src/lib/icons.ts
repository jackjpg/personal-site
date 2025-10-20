export interface Icon {
  id: string;
  label: string;
  kind: "route" | "link" | "mailto";
  href: string;
  size: "L" | "S";
  img: string;
}

export const icons: Icon[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    kind: "link",
    href: "https://www.linkedin.com/in/jack-parrish/",
    size: "S",
    img: "/Icons/LinkedIn.jpg"
  },
  {
    id: "twitter",
    label: "Twitter/X",
    kind: "link",
    href: "https://x.com/",
    size: "S",
    img: "/Icons/X.jpg"
  },
  {
    id: "img1",
    label: ".img",
    kind: "link",
    href: "https://example.com",
    size: "S",
    img: "/Icons/img1.jpg"
  },
  {
    id: "img2",
    label: ".img",
    kind: "link",
    href: "https://example.com",
    size: "S",
    img: "/Icons/img2.jpg"
  },
  {
    id: "img3",
    label: ".img",
    kind: "link",
    href: "https://example.com",
    size: "S",
    img: "/Icons/img3.jpeg"
  }
];

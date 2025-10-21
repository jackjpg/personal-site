export interface Icon {
  id: string;
  label: string;
  kind: "route" | "link" | "mailto";
  href: string;
  ratio: "square" | "portrait" | "landscape";
  img: string;
  focal?: { x: number; y: number }; // 0–100 percentages, default {50,50}
}

export const icons: Icon[] = [
  {
    id: "forest",
    label: "FOREST.JPG",
    kind: "link",
    href: "https://example.com",
    ratio: "landscape",
    img: "/Icons/forest.jpg"
  },
  {
    id: "sweden",
    label: "SWEDEN.JPG",
    kind: "link",
    href: "https://example.com",
    ratio: "landscape",
    img: "/Icons/sweden.jpg"
  },
  {
    id: "seenit-image",
    label: "SEENIT.JPG",
    kind: "link",
    href: "https://example.com",
    ratio: "portrait",
    img: "/Icons/seenit.jpg"
  },
  {
    id: "cornfields",
    label: "CORNFIELDS.JPG",
    kind: "link",
    href: "https://example.com",
    ratio: "portrait",
    img: "/Icons/cornfields.jpg"
  },
  {
    id: "clouds",
    label: "CLOUDS.JPG",
    kind: "link",
    href: "https://example.com",
    ratio: "portrait",
    img: "/Icons/clouds.jpg"
  },
  {
    id: "post-sale",
    label: "POST-SALE.JPG",
    kind: "link",
    href: "https://example.com",
    ratio: "portrait",
    img: "/Icons/post-sale@3x.jpg"
  },
  {
    id: "verification",
    label: "VERIFICATION.JPG",
    kind: "link",
    href: "https://example.com",
    ratio: "portrait",
    img: "/Icons/Verification@3x.jpg"
  }
];

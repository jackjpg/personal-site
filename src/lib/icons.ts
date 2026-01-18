export interface Icon {
  id: string;
  label: string;
  kind: "route" | "link" | "mailto";
  href: string;
  ratio: "square" | "portrait" | "landscape";
  img?: string; // Optional for text-only thumbnails
  video?: string; // Video file path
  focal?: { x: number; y: number }; // 0–100 percentages, default {50,50}
  text?: string; // Text content for text-only thumbnails
  bgColor?: string; // Background color for text-only thumbnails
  showLabel?: boolean; // Show label pill even on text thumbnails
  curvedText?: string; // Custom text for curved decoration (defaults to "PROJECT")
  year?: string; // Year for project thumbnails
  previewImage?: string; // Preview media (image or video) from case study (for hover chip)
}

const iconsBase: Omit<Icon, 'previewImage'>[] = [
  {
    id: "forest",
    label: "FOREST.JPG",
    kind: "link",
    href: "https://x.com/_jackparrish/status/1947599813475799125/video/1",
    ratio: "landscape",
    video: "/Icons/social_u7618731978_cinematic_animation_of_a_single_blue_flower_petal_1346aa9c-69a1-4a31-b487-4831c18a465b_3.mp4"
  },
  {
    id: "sweden",
    label: "SWEDEN.JPG",
    kind: "link",
    href: "https://x.com/_jackparrish/status/1963538827689042375",
    ratio: "landscape",
    img: "/Icons/sweden.jpg"
  },
  {
    id: "seenit-image",
    label: "VIEW",
    kind: "route",
    href: "/case/seenit",
    ratio: "portrait",
    text: "Turning screenshots into status updates",
    bgColor: "#FC6DB3",
    showLabel: true,
    year: "2025"
  },
  {
    id: "cornfields",
    label: "CORNFIELDS.JPG",
    kind: "link",
    href: "https://x.com/_jackparrish/status/1959298827220898051/photo/1",
    ratio: "portrait",
    img: "/Icons/cornfields.jpg"
  },
  {
    id: "clouds",
    label: "CLOUDS.JPG",
    kind: "link",
    href: "https://x.com/_jackparrish/status/1946687804165034475/video/1",
    ratio: "portrait",
    video: "/Icons/social_u7618731978_cinematic_4k_video_pan_dreamy_vector_surrealism_s_30e469f0-d7ea-46d6-9bb8-54728f6ebdde_3.mp4"
  },
  {
    id: "post-sale",
    label: "VIEW",
    kind: "route",
    href: "/case/post-sale",
    ratio: "portrait",
    text: "Building trust after the sale",
    bgColor: "#A8E6CF",
    showLabel: true,
    year: "2025"
  },
  {
    id: "verification",
    label: "VIEW",
    kind: "route",
    href: "/case/verification",
    ratio: "portrait",
    text: "Reducing verification failures",
    bgColor: "#FFF5A6",
    showLabel: true,
    year: "2024"
  }
];

// Preview media extracted from case studies (hardcoded for client/server compatibility)
// Uses first media (image or video) from each case study
const previewMediaMap: Record<string, string> = {
  'seenit': '/Project_seenit/seenit_hero.png',
  'post-sale': '/Project_post-sale/hero_bmwpostsale.png',
  'verification': '/Project_verification/verification-hero.png'
};

// Add preview media to project thumbnails
export const icons: Icon[] = iconsBase.map(icon => {
  if (icon.kind === "route") {
    // Extract slug from href (e.g., "/case/seenit" -> "seenit")
    const slugMatch = icon.href.match(/\/case\/(.+)$/);
    if (slugMatch && slugMatch[1]) {
      const slug = slugMatch[1];
      const previewImage = previewMediaMap[slug];
      if (previewImage) {
        return { ...icon, previewImage };
      }
    }
  }
  return icon;
});

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
    id: "seenit-identity",
    label: "VIEW",
    kind: "route",
    href: "/case/seenit-identity",
    ratio: "portrait",
    text: "Onboarding into a single tap",
    bgColor: "#D4A5FF",
    showLabel: true,
    year: "2025"
  },
  {
    id: "reactions",
    label: "VIEW",
    kind: "route",
    href: "/case/reactions",
    ratio: "portrait",
    text: "Lowering the cost of replying",
    bgColor: "#FFB347",
    showLabel: true,
    year: "2025"
  },
  {
    id: "pov",
    label: "VIEW",
    kind: "route",
    href: "/case/pov",
    ratio: "portrait",
    text: "Turning screenshots into statuses",
    bgColor: "#87CEEB",
    showLabel: true,
    year: "2025"
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
  'seenit-identity': '/Project_seenit-identity/Seenit-identity-Newnew.mov',
  'reactions': '/Project_reactions/Seenit-reactions.mov',
  'pov': '/Project_pov/Seenit-Remix.mov',
  'post-sale': '/Project_post-sale/motorway-post-sale-1.png',
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

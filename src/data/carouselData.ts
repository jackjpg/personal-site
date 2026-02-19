export interface CarouselData {
  images: string[];
  captions: string[];
  fullWidth?: boolean;
}

export const carouselData: Record<string, CarouselData> = {
  'post-sale-desktop': {
    fullWidth: true,
    images: [
      '/Project_post-sale/PS-Desktop-1@2x.png',
      '/Project_post-sale/PS-Desktop-2@2x.png',
      '/Project_post-sale/PS-Desktop-3@2x.png',
      '/Project_post-sale/PS-Desktop-4@2x.png',
      '/Project_post-sale/PS-Desktop-5@2x.png',
      '/Project_post-sale/PS-Desktop-6@2x.png',
      '/Project_post-sale/PS-Desktop-7@2x.png',
      '/Project_post-sale/PS-Desktop-8@2x.png',
      '/Project_post-sale/PS-Desktop-9@2x.png',
      '/Project_post-sale/PS-Desktop-10@2x.png',
    ],
    captions: [
      'Ready for collection',
      'Preparing your collection',
      'What to know',
      'Schedule collection',
      'Schedule collection',
      'Schedule collection',
      'Matching you with a collection partner',
      'Collection scheduled',
      'Collection underway',
      'Sale complete',
    ],
  },
};

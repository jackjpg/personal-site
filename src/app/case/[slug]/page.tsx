import { notFound } from 'next/navigation';
import React from 'react';
import { getAllCaseSlugs, getCaseBySlug, getAllCases } from '@/lib/case-studies';
import CaseStudyLayout from '@/components/CaseStudyLayout';
import CaseStudyLayoutV2 from '@/components/CaseStudyLayoutV2';
import CaseStudyLayoutV3 from '@/components/CaseStudyLayoutV3';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CSImage from '@/components/CSImage';
import Section from '@/components/Section';
import CSTable from '@/components/CSTable';
import CSYouTube from '@/components/CSYouTube';
import CSCarousel from '@/components/CSCarousel';
import CSChip from '@/components/CSChip';
import Content from '@/components/Content';
import SectionV3 from '@/components/v3/SectionV3';
import ImageBlockV3 from '@/components/v3/ImageBlockV3';
import ImageBlockV3Wrapper from '@/components/v3/ImageBlockV3Wrapper';
import BodyTextV3 from '@/components/v3/BodyTextV3';
import SectionWithMediaV3 from '@/components/v3/SectionWithMediaV3';
import MoreSeenitV3 from '@/components/v3/MoreSeenitV3';
import ScoringRubricV3 from '@/components/v3/ScoringRubricV3';
import NumberedListV3 from '@/components/v3/NumberedListV3';

const components = {
  CSImage,
  Section,
  CSTable,
  CSYouTube,
  CSCarousel,
  CSChip,
  Content,
  'Content.P': Content.P,
  'Content.H2': Content.H2,
  'Content.Image': Content.Image,
};

const componentsV3 = {
  Section: SectionV3,
  SectionWithMedia: SectionWithMediaV3,
  CSImage: ImageBlockV3Wrapper,
  V3Image: ImageBlockV3Wrapper,
  p: BodyTextV3,
  div: BodyTextV3,
  CSTable,
  CSYouTube,
  CSCarousel,
  CSChip,
  MoreSeenit: MoreSeenitV3,
  ScoringRubric: ScoringRubricV3,
  NumberedList: NumberedListV3,
};

export async function generateStaticParams() {
  const slugs = getAllCaseSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function CasePage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await Promise.resolve(params);
  const { slug } = resolved;
  let caseStudy;
  
  try {
    caseStudy = getCaseBySlug(slug);
  } catch {
    notFound();
  }

  const { metadata, content } = caseStudy;
  const isV2 = metadata.layout === 'v2';
  const isV3 = metadata.layout === 'v3';

  // Extract hero image from MDX content for V2 layout
  let heroImageElement: React.ReactElement | null = null;
  let contentWithoutHero = content;

  if (isV2) {
    // Find first CSImage with size="large"
    const heroImageMatch = content.match(/<CSImage\s+([^>]*?)\s*\/>/);
    if (heroImageMatch) {
      const fullMatch = heroImageMatch[0];
      const attrs = heroImageMatch[1];

      // Check if it has size="large"
      if (attrs.includes('size="large"') || attrs.includes("size='large'")) {
        // Extract props
        const srcMatch = attrs.match(/src=["']([^"']+)["']/);
        const altMatch = attrs.match(/alt=["']([^"']+)["']/);
        const aspectRatioMatch = attrs.match(/aspectRatio=["']([^"']+)["']/);
        
        if (srcMatch) {
          heroImageElement = (
            <CSImage
              src={srcMatch[1]}
              alt={altMatch ? altMatch[1] : ''}
              aspectRatio={(aspectRatioMatch ? aspectRatioMatch[1] : '16:9') as '16:9' | '4:3' | '1:1' | '3:2' | 'none'}
              size="large"
            />
          );

          // Remove this hero image tag from the MDX content so it doesn't render twice
          contentWithoutHero = content.replace(fullMatch, '');
        }
      }
    }
  }

  if (isV3) {
    // Get all case studies and filter out the current one
    const allCases = getAllCases();
    const otherCases = allCases
      .filter(c => c.slug !== slug && c.metadata.layout === 'v3')
      .slice(0, 2) // Get first 2 other v3 case studies
      .map(c => ({
        title: c.metadata.title,
        href: `/case/${c.slug}`
      }));

    return (
      <CaseStudyLayoutV3
        slug={slug}
        title={metadata.title}
        date={metadata.date}
      >
        <MDXRemote source={content} components={componentsV3} />
      </CaseStudyLayoutV3>
    );
  }

  if (isV2) {
    return (
      <CaseStudyLayoutV2
        title={metadata.title}
        subtitle={metadata.subtitle}
        date={metadata.date}
        role={metadata.role}
        client={metadata.client}
        introduction={metadata.introduction as string | undefined}
        slug={slug}
        heroImage={heroImageElement}
      >
        <MDXRemote source={contentWithoutHero} components={components} />
      </CaseStudyLayoutV2>
    );
  }

  return (
    <CaseStudyLayout
      title={metadata.title}
      subtitle={metadata.subtitle}
      introduction={metadata.introduction as string | undefined}
      meta={[]}
      slug={slug}
    >
      <MDXRemote source={content} components={components} />
    </CaseStudyLayout>
  );
}


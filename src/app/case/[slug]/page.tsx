import { notFound } from 'next/navigation';
import { getAllCaseSlugs, getCaseBySlug, getAllCases } from '@/lib/case-studies';
import CaseStudyLayoutV3 from '@/components/CaseStudyLayoutV3';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CSTable from '@/components/CSTable';
import CSYouTube from '@/components/CSYouTube';
import CSCarousel from '@/components/CSCarousel';
import CSChip from '@/components/CSChip';
import SectionV3 from '@/components/v3/SectionV3';
import ImageBlockV3Wrapper from '@/components/v3/ImageBlockV3Wrapper';
import BodyTextV3 from '@/components/v3/BodyTextV3';
import SectionWithMediaV3 from '@/components/v3/SectionWithMediaV3';
import MoreSeenitV3 from '@/components/v3/MoreSeenitV3';
import ScoringRubricV3 from '@/components/v3/ScoringRubricV3';
import NumberedListV3 from '@/components/v3/NumberedListV3';

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

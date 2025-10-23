import { notFound } from 'next/navigation';
import { getAllCaseSlugs, getCaseBySlug } from '@/lib/case-studies';
import CaseStudyLayout from '@/components/CaseStudyLayout';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CSImage from '@/components/CSImage';
import Section from '@/components/Section';
import CSTable from '@/components/CSTable';
import CSYouTube from '@/components/CSYouTube';

const components = {
  CSImage,
  Section,
  CSTable,
  CSYouTube,
};

export async function generateStaticParams() {
  const slugs = getAllCaseSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let caseStudy;
  
  try {
    caseStudy = getCaseBySlug(slug);
  } catch {
    notFound();
  }

  const { metadata, content } = caseStudy;
  
  // Build meta array from metadata
  const meta = [];
  if (metadata.date) meta.push({ label: 'Date', value: metadata.date });
  if (metadata.role) meta.push({ label: 'Role', value: metadata.role });
  if (metadata.client) meta.push({ label: 'Company', value: metadata.client });

  return (
    <CaseStudyLayout
      title={metadata.title}
      subtitle={metadata.subtitle}
      introduction={metadata.introduction}
      meta={meta}
    >
      <MDXRemote source={content} components={components} />
    </CaseStudyLayout>
  );
}


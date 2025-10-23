import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const casesDirectory = path.join(process.cwd(), 'src/content/case-studies');

export interface CaseMetadata {
  title: string;
  subtitle?: string;
  date: string;
  role?: string;
  client?: string;
  [key: string]: string | undefined;
}

export interface CaseStudy {
  slug: string;
  metadata: CaseMetadata;
  content: string;
}

export function getAllCaseSlugs(): string[] {
  const files = fs.readdirSync(casesDirectory);
  return files
    .filter(file => file.endsWith('.mdx') && !file.startsWith('_'))
    .map(file => file.replace(/\.mdx$/, ''));
}

export function getCaseBySlug(slug: string): CaseStudy {
  const fullPath = path.join(casesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: data as CaseMetadata,
    content,
  };
}

export function getAllCases(): CaseStudy[] {
  const slugs = getAllCaseSlugs();
  return slugs.map(slug => getCaseBySlug(slug));
}


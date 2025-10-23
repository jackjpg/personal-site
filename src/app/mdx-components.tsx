import type { MDXComponents } from 'mdx/types'
import CSImage from '@/components/CSImage'
import Section from '@/components/Section'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    CSImage,
    Section,
    ...components,
  }
}


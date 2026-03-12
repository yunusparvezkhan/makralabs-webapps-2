export type DocsConfig = {
  site: {
    title: string;
    product?: string;
    description?: string;
  };
  versions: DocsVersion[];
};

export type DocsVersion = {
  id: string;
  label: string;
  tag?: string;
  default?: boolean;
  tabs?: DocsTab[];
  primaryLinks?: DocsLinkItem[];
  sections: DocsSection[];
};

export type DocsTab = {
  title: string;
  href: string;
};

export type DocsLinkItem = {
  title: string;
  href: string;
  icon?: string;
};

export type DocsSection = {
  id: string;
  title: string;
  pages: DocsPage[];
};

export type DocsPage = {
  title: string;
  slug: string;
  file: string;
  description?: string;
  icon?: string;
  trailingChevron?: boolean;
};

export type DocsTocItem = {
  depth: 2 | 3;
  title: string;
  id: string;
};

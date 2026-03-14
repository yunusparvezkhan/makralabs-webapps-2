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
  sections: DocsSection[];
};

export type DocsTab = {
  id: string;
  title: string;
  href: string;
};

export type DocsSection = {
  id: string;
  tabId: string;
  title: string;
  slug: string;
  pages: DocsPage[];
};

export type DocsPage = {
  title: string;
  slug: string;
  path: string;
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

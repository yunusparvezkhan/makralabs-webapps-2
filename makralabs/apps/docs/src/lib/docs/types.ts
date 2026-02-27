export type DocsConfig = {
  site: {
    title: string;
    product?: string;
    description?: string;
  };
  sections: DocsSection[];
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
};

export type DocsTocItem = {
  depth: 2 | 3;
  title: string;
  id: string;
};


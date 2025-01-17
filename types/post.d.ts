// types/post.d.ts
export type Post = {
  authorName: ReactNode;
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage?: string;
  draft: boolean;
  createdAt: string;
  authorImage: string;
  updatedAt: string;
  category: string[]; // Update this to be an array of strings
  description: string;
};

// types/post.d.ts

export type Post = {
    id: number;
    title: string;
    content: string;
    slug: string;
    featuredImage?: string;
    draft: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
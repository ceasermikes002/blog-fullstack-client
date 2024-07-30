// lib/readingTime.ts

export const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 200; // Average reading speed
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };
  
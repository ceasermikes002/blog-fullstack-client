"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import Image from 'next/image';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/posts';

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  // Function to render HTML content safely
  const renderHtmlContent = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                <a>{post.title}</a>
              </Link>
              <div dangerouslySetInnerHTML={renderHtmlContent(post.content)} />
              {post.featuredImage ? (
                <Image src={post.featuredImage.startsWith('/') ? `http://localhost:3000${post.featuredImage}` : post.featuredImage} alt="Featured Image" width={300} height={200} />
              ) : (
                <p>No image available</p>
              )}
            </li>
          ))
        ) : (
          <div>No data</div>
        )}
      </ul>
    </div>
  );
}

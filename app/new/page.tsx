"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.slug}`} legacyBehavior>
                <a>{post.title}</a>
              </Link>
            </li>
          ))
        ) : (
          <div>No data</div>
        )}
      </ul>
    </div>
  );
}

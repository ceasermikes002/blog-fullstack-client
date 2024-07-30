"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct import for dynamic routes
import { Post } from "@/types/post";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, StarIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import { calculateReadingTime } from "@/lib/readingTime"; // Add this utility function
import PortableText from "react-portable-text";
import parse from "html-react-parser";

const BlogPostPage = () => {
  const { slug } = useParams(); // Correctly retrieve slug from URL parameters
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return; // Return early if slug is not yet available

    const fetchPost = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_8 || "";

      if (!apiUrl) {
        setError("API URL is not defined");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}${slug}`);
        if (!response.ok) {
          throw new Error("Post not found");
        }
        const data: Post = await response.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        {post.title}
      </h1>
      <div className="text-center mb-4">
        <p className="text-gray-700 font-semibold">By {post.authorName}</p>
        <p className="text-gray-500 text-sm">
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm">
          Approx. Reading Time: {readingTime}
        </p>
      </div>
      {post.featuredImage && (
        <div className="mb-6">
          <Image
            src={
              post.featuredImage.startsWith("/")
                ? `http://localhost:3000${post.featuredImage}`
                : post.featuredImage
            }
            alt="Featured Image"
            width={1200}
            height={800}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      )}
      <div className="prose">{parse(post.content)}</div>
      <footer className="mt-6">
        <p className="text-gray-500 text-sm">
          Last updated on {new Date(post.updatedAt).toLocaleDateString()}
        </p>
      </footer>
      <div className="mt-6 flex justify-between items-center">
        <Link href={`/new`} passHref legacyBehavior>
          <a className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Back to Posts
          </a>
        </Link>
        {/* Add Like/Un-like and Favorite/Un-favorite buttons if needed */}
      </div>
    </div>
  );
};

export default BlogPostPage;

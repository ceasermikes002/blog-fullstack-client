"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Post } from "@/types/post";
import PortableText from "react-portable-text"
import { HeartIcon, StarIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import { Badge } from "./ui/badge";
import "quill/dist/quill.core.css";

export const revalidate = 3

const BlogPosts = () => {
  const { user } = useUser(); // Get the current user from Clerk
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [favoritedPosts, setFavoritedPosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "";
      console.log("Fetching posts from:", apiUrl);

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchUserLikes = async () => {
      if (!user) return;

      const apiUrlLikedPosts: string = `${process.env.NEXT_PUBLIC_API_URL_6}?userId=${user.id}`;
      console.log("Fetching liked posts from:", apiUrlLikedPosts);

      try {
        const res = await fetch(apiUrlLikedPosts);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setLikedPosts(data.map((like: { postId: string }) => like.postId));
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    const fetchUserFavorites = async () => {
      if (!user) return;

      const apiUrlFavoritedPosts: string = `${process.env.NEXT_PUBLIC_API_URL_7}?userId=${user.id}`;
      console.log("Fetching favorited posts from:", apiUrlFavoritedPosts);

      try {
        const res = await fetch(apiUrlFavoritedPosts);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setFavoritedPosts(
          data.map((favorite: { postId: string }) => favorite.postId)
        );
      } catch (error) {
        console.error("Error fetching favorited posts:", error);
      }
    };

    fetchPosts();
    fetchUserLikes();
    fetchUserFavorites();
  }, [user]);

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const payload = { postId, userId: user.id };

      console.log("Sending like request with:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_2}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error liking post");

      setLikedPosts((prev) => [...prev, postId]);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async (postId: string) => {
    if (!user) return;

    try {
      const payload = { postId, userId: user.id };

      console.log("Sending unlike request with:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_3}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error unliking post");

      setLikedPosts((prev) => prev.filter((id) => id !== postId));
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleFavorite = async (postId: string) => {
    if (!user) return;

    try {
      const payload = { postId, userId: user.id };

      console.log("Sending favorite request with:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_4}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error favoriting post");

      setFavoritedPosts((prev) => [...prev, postId]);
    } catch (error) {
      console.error("Error favoriting post:", error);
    }
  };

  const handleUnfavorite = async (postId: string) => {
    if (!user) return;

    try {
      const payload = { postId, userId: user.id };

      console.log("Sending unfavorite request with:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_5}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error unfavoriting post");

      setFavoritedPosts((prev) => prev.filter((id) => id !== postId));
    } catch (error) {
      console.error("Error unfavoriting post:", error);
    }
  };

  const renderHtmlContent = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Blog Posts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                <h1 className="text-2xl font-semibold">
                  {post.title}
                </h1>
              </Link>
              {post.featuredImage && (
                <div className="mt-4">
                  <Image
                    src={
                      post.featuredImage.startsWith("/")
                        ? `http://localhost:3000${post.featuredImage}`
                        : post.featuredImage
                    }
                    alt="Featured Image"
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover rounded"
                  />
                </div>
              )}
              {/* <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              /> */}
              <PortableText content={post.content}/>
              <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-4">
                  {post.authorImage && (
                    <Image
                      src={post.authorImage}
                      alt="Author Image"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Author: <span className="text-sm">{post.authorName}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Published on:{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  {likedPosts.includes(post.id) ? (
                    <HeartSolidIcon
                      onClick={() => handleUnlike(post.id)}
                      className="w-6 h-6 cursor-pointer text-red-500"
                    />
                  ) : (
                    <HeartIcon
                      onClick={() => handleLike(post.id)}
                      className="w-6 h-6 cursor-pointer text-gray-600"
                    />
                  )}
                  {favoritedPosts.includes(post.id) ? (
                    <StarSolidIcon
                      onClick={() => handleUnfavorite(post.id)}
                      className="w-6 h-6 cursor-pointer text-yellow-500"
                    />
                  ) : (
                    <StarIcon
                      onClick={() => handleFavorite(post.id)}
                      className="w-6 h-6 cursor-pointer text-gray-600"
                    />
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-row  gap-3 justify-between">
                <Badge className="bg-gray-200 text-gray-700 p-2 rounded text-sm">
                  {post.category}
                </Badge>

                <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                  <a className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Read More
                  </a>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            No posts available
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPosts;

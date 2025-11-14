import fs from "fs";
import path from "path";
import Link from "next/link";

export const metadata = {
  title: "Blog — Qatar Tender Platform",
  description: "Guides, tips, and tender insights for businesses in Qatar.",
};

export default function BlogPage() {
  const blogPath = path.join(process.cwd(), "public/blog");
  const files = fs.readdirSync(blogPath);

  const posts = files.map((file) => {
    const data = JSON.parse(
      fs.readFileSync(path.join(blogPath, file), "utf-8")
    );
    return { ...data, slug: file.replace(".json", "") };
  });

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Blog</h1>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer bg-white">
              <h2 className="text-2xl font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="text-gray-600 mt-2">{post.description}</p>
              <p className="text-sm text-gray-400 mt-3">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

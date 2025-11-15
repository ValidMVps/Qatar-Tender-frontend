import fs from "fs";
import path from "path";
import Link from "next/link";
import Background from "@/components/animations/Background";
import NavbarLanding from "@/components/Navbarladning";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Blog, Qatar Tender Platform",
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
    <div className="relative min-h-screen bg-gray-50/30 ">
      <Background />
      <NavbarLanding />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 min-h-screen py-45">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-16 text-center">
          Blog
        </h1>

        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden transition-shadow duration-300 cursor-pointer ">
                {/* BLOG IMAGE */}
                <div className="w-full h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  />
                </div>

                <div className="px-6 py-8 flex flex-col flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3 transition-colors duration-300">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 line-clamp-3 flex-1">
                    {post.description}
                  </p>

                  <p className="text-sm text-gray-800 mt-4">
                    {new Date(post.pubDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
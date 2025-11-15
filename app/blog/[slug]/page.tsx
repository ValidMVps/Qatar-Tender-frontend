import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavbarLanding from "@/components/Navbarladning";
import Footer from "@/components/Footer";
import Background from "@/components/animations/Background";

// ------- Types -------
interface PostFile {
  title: string;
  authorName: string;
  image: string;
  pubDate: string | Date;
  description: string;
  authorImage: string;
  content: string;
}

// ------- Static Params -------
export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), "public/blog");
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".json"));
  return files.map((file) => ({ slug: file.replace(".json", "") }));
}

// ------- Helper: Load Post -------
async function loadPost(slug: string): Promise<PostFile | null> {
  const filePath = path.join(process.cwd(), "public/blog", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(raw) as PostFile;
  } catch {
    return null;
  }
}

// ------- Metadata -------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ← AWAIT params!
  const post = await loadPost(slug);

  if (!post) return { title: "Post Not Found" };

  const published =
    typeof post.pubDate === "string"
      ? post.pubDate
      : post.pubDate.toISOString();

  const url = `https://your-domain.com/blog/${slug}`;

  return {
    title: `${post.title} | Blog`,
    description: post.description,

    // IMPORTANT SEO ADDITIONS
    metadataBase: new URL("https://your-domain.com"),
    alternates: {
      canonical: url,
    },
    keywords: [
      "Qatar tenders",
      "tender guide",
      "procurement Qatar",
      "tender submission",
      "public procurement",
      "bidding process Qatar",
      "tender template",
    ],
    authors: [{ name: post.authorName }],
    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: published,
      images: post.image ? [{ url: post.image }] : [],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },

    // JSON-LD Structured Data
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        author: {
          "@type": "Person",
          name: post.authorName,
        },
        datePublished: published,
        image: post.image,
        mainEntityOfPage: url,
      }),
    },
  };
}

// ------- PAGE -------
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ← AWAIT params!
  const post = await loadPost(slug);

  if (!post) notFound();

  const pubDate =
    typeof post.pubDate === "string" ? new Date(post.pubDate) : post.pubDate;

  return (
    <>
      <NavbarLanding />
      <Background />
      <main className="w-full">
        <article className="min-h-screen bg-gray-50/35 mt-20">
          {/* HERO SECTION */}
          <section className="py-20 md:py-28 lg:py-22">
            <div className="container max-w-7xl mx-auto px-4 text-center space-y-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-pretty leading-tight">
                {post.title}
              </h1>
              <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
                {post.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Avatar className="h-14 w-14 ring-2 ring-border ring-offset-2 ring-offset-background">
                  <AvatarImage src={post.authorImage} alt={post.authorName} />
                  <AvatarFallback>
                    {post.authorName?.charAt(0) ?? "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-foreground">
                    {post.authorName}
                  </p>
                  <time className="text-sm text-muted-foreground">
                    {format(pubDate, "MMMM d, yyyy")}
                  </time>
                </div>
              </div>
              {post.image && (
                <div className="mt-16 overflow-hidden rounded-2xl border bg-muted/50 ">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </section>

          {/* CONTENT */}
          <section className="bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-16 md:py-20 lg:py-14">
              <div
                className="
    prose prose-lg dark:prose-invert
    mx-auto text-base md:text-lg

    /* Headings - clear scale & spacing */
    prose-headings:font-semibold prose-headings:leading-tight
    prose-h1:text-4xl md:prose-h1:text-5xl lg:prose-h1:text-6xl prose-h1:mt-8 prose-h1:mb-6 prose-h1:text-center md:prose-h1:text-left
    prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/20 prose-h2:pb-3
    prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
    prose-h4:text-lg md:prose-h4:text-xl prose-h4:mt-5 prose-h4:mb-2

    /* Paragraphs & lists */
    prose-p:my-9 prose-p:leading-relaxed prose-p:text-foreground/90
    prose-ul:my-9 prose-ol:my-9 
    prose-ul:space-y-9 prose-ol:space-y-9 /* Adds vertical spacing between list items */
    prose-li:my-0 prose-li:py-9 prose-li:text-foreground/90 prose-li:marker:text-primary

    /* Images */
    prose-img:my-8 prose-img:rounded-xl prose-img:shadow-sm prose-img:object-cover prose-img:w-full

    /* Code blocks & inline code */
    prose-code:bg-muted prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium
    prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:font-mono

    /* Blockquotes */
    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:bg-muted/10 prose-blockquote:italic prose-blockquote:my-6

    /* Tables */
    prose-table:w-full prose-table:my-6 prose-th:bg-muted/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold
    prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-foreground/90
  "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

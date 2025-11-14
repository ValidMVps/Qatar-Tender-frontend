import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Lightbulb } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavbarLanding from "@/components/Navbarladning";
import Footer from "@/components/Footer";

// ------- Types -------
interface PostFile {
  title: string;
  authorName: string;
  image: string;
  pubDate: string | Date;
  description: string;
  authorImage: string;
  content: string; // HTML content
}

// ------- Static Params -------
export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), "public/blog");
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".json"));
  return files.map((file) => ({ slug: file.replace(".json", "") }));
}

// ------- Metadata -------
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(
    process.cwd(),
    "public/blog",
    `${params.slug}.json`
  );
  if (!fs.existsSync(filePath)) return {};

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const post: PostFile = JSON.parse(data);
    const published =
      typeof post.pubDate === "string"
        ? post.pubDate
        : post.pubDate.toISOString();

    return {
      title: `${post.title} | Blog`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: published,
        images: post.image ? [{ url: post.image }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [post.image],
      },
    };
  } catch {
    return {};
  }
}

// ------- PAGE -------
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(
    process.cwd(),
    "public/blog",
    `${params.slug}.json`
  );
  if (!fs.existsSync(filePath)) notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const post: PostFile = JSON.parse(raw);

  const pubDate =
    typeof post.pubDate === "string" ? new Date(post.pubDate) : post.pubDate;

  return (
    <>
      <NavbarLanding />
      <main className="w-full">
        <article className="min-h-screen bg-background/95">
          {/* HERO SECTION */}
          <section className="py-20 md:py-28 lg:py-32">
            <div className="container max-w-7xl mx-auto px-4 text-center space-y-12">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-pretty leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
                {post.description}
              </p>

              {/* Author */}
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

              {/* Featured Image */}
              {post.image && (
                <div className="mt-16 overflow-hidden rounded-2xl border bg-muted/50 shadow-xl">
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
            <div className="container max-w-7xl mx-auto px-4 py-16 md:py-20 lg:py-24">
              <div
                className="
        prose prose-lg dark:prose-invert mx-auto max-w-none

        /* Headings */
        prose-h1:text-4xl md:prose-h1:text-5xl lg:prose-h1:text-6xl
        prose-h1:font-bold prose-h1:leading-tight prose-h1:tracking-tight
        prose-h1:mt-12 prose-h1:mb-6 text-center md:text-left

        prose-h2:text-2xl md:prose-h2:text-3xl lg:prose-h2:text-4xl
        prose-h2:font-semibold prose-h2:leading-snug
        prose-h2:mt-10 prose-h2:mb-4
        prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-3
        prose-h2:text-primary/90

        prose-h3:text-xl md:prose-h3:text-2xl
        prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3

        prose-h4:text-lg md:prose-h4:text-xl
        prose-h4:font-medium prose-h4:mt-6 prose-h4:mb-2

        /* Paragraphs */
        prose-p:text-base md:prose-p:text-lg
        prose-p:leading-relaxed prose-p:my-4 text-foreground/90

        /* Lists */
        prose-ul:my-4 prose-ol:my-4
        prose-li:my-2 prose-li:text-foreground/90
        prose-li:marker:text-primary

        /* Images */
        prose-img:my-6 prose-img:rounded-xl prose-img:shadow-md
        prose-img:w-full prose-img:object-cover

        /* Code */
        prose-code:bg-muted prose-code:px-2 prose-code:py-1
        prose-code:rounded-md prose-code:text-sm prose-code:font-medium

        /* Pre / Code Blocks */
        prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg
        prose-pre:shadow-sm prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:font-mono prose-pre:border

        /* Blockquotes */
        prose-blockquote:border-l-4 prose-blockquote:border-primary
        prose-blockquote:pl-6 prose-blockquote:bg-muted/20
        prose-blockquote:text-base md:prose-blockquote:text-lg
        prose-blockquote:italic prose-blockquote:my-6

        /* Tables */
        prose-table:w-full prose-table:border-collapse prose-table:rounded-lg
        prose-table:overflow-hidden prose-table:my-6
        prose-th:bg-muted/50 prose-th:border prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm font-semibold text-foreground
        prose-td:border prose-td:px-4 prose-td:py-3 prose-td:text-sm text-foreground/90
      "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </section>

          {/* TIP CALL-TO-ACTION */}
          <section className="bg-muted/30 py-16">
            <div className="container max-w-7xl mx-auto px-4">
              <Alert className="border-primary/20 bg-background shadow-sm">
                <Lightbulb className="h-5 w-5 text-primary" />
                <AlertTitle className="text-lg font-semibold">
                  Pro Tip
                </AlertTitle>
                <AlertDescription className="mt-2 text-foreground/80">
                  Always keep a version-controlled copy of your tender template
                  and update it after every project to reflect lessons learned.
                </AlertDescription>
              </Alert>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

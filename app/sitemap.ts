import fs from "fs";
import path from "path";

export default function sitemap() {
  const blogDir = path.join(process.cwd(), "public/blog");
  const files = fs.readdirSync(blogDir);

  const blogUrls = files.map((file) => ({
    url: `https://gotenderly.com/blog/${file.replace(".json", "")}`,
    lastModified: new Date(),
  }));

  return [
    { url: "https://gotenderly.com/", lastModified: new Date() },
    ...blogUrls,
  ];
}

import { MDXRemote } from "next-mdx-remote/rsc";
import { getContent } from "@/utils/content"




export default async function SEO({slug}:{slug: string}) {
  const data = getContent(slug);

  if (!data) { return <div></div>; }

  const { content, data: frontmatter } = data;
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 policy-container">      

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={content} />
      </article>
    </main>
  );
}
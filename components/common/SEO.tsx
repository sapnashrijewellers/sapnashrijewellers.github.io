import { MDXRemote } from "next-mdx-remote/rsc";
import { getContent } from "@/utils/content"

export default async function SEO({ slug }: { slug: string }) {
  const data = getContent(slug);

  if (!data) { return <div></div>; }

  const { content } = data;
  return (    

      <article className="policy-container max-w-6xl mx-auto px-4 py-16">
        <MDXRemote source={content} />
      </article>    
  );
}
import { MDXRemote } from "next-mdx-remote/rsc";
import Highlight from "@/components/mdx/Highlight";
import Metrics from "@/components/mdx/Metrics";
import Testimonial from "@/components/mdx/Testimonial";
import SectionCard from "@/components/mdx/SectionCard";
import Timeline from "@/components/mdx/Timeline";
import Comparison from "@/components/mdx/Comparison";
import KeyTakeaways from "@/components/mdx/KeyTakeaways";
import { Metadata } from "next";
import {getContent} from "@/utils/content"
import { notFound } from "next/navigation";

const policies = [
  {
    slug:"privacy",    
    title:"Privacy Policy",    
    description: "At task360, your data security is our priority. Explore our Privacy Policy to understand our commitment to protecting your business and financial information."
  },
  {
    slug:"terms",    
    title:"Terms of Service",    
    description: "Legal terms and conditions for task360 services. Read our Terms of Service to understand your rights and responsibilities when scaling your business with us."
  },
  {
    slug:"shipping",    
    title:"Shipping Policy",    
    description: "Learn about our shipping policies, including delivery times and costs, to ensure a smooth shopping experience."
  },
  {
    slug:"disclaimer",    
    title:"Disclaimer",    
    description: "Legal terms and conditions for task360 services. Read our Disclaimer to understand your rights and responsibilities when scaling your business with us."
  },
  {
    slug:"returns",    
    title:"Return Policy",    
    description: "Learn about our return policies, including eligibility and procedures, to ensure a hassle-free shopping experience."
  }

]


export async function generateStaticParams() {
    return policies.map(c => ({
        slug: c.slug,
    }));
}

// --- Generate SEO metadata dynamically ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;  
  const cs = policies.find((s) => s.slug === slug);

  if (!cs) return notFound();

  return {
    title: `${cs.title}`,
    description: cs.description,
    openGraph: {
      title: `${cs.title}`,
      description: cs.description,
      url: `/policies/${cs.slug}`,      
    },    
    alternates: {
      canonical: `/policies/${slug}`,
    },
  };
}

const components = {
    Highlight,
    Metrics,
    Testimonial,
    SectionCard,
    Timeline,
    Comparison,
    KeyTakeaways,
};

export default async function PrivacyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log(slug);
    const data = getContent(slug);

    if (!data) {
        return <div className="p-16">Privacy Policy not found</div>;
    }

    const { content, data: frontmatter } = data;

    return (
        <main className="max-w-5xl mx-auto px-4 py-16">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
                <p className="text-muted max-w-xl">{frontmatter.description}</p>                
            </header>

            <article className="prose prose-neutral dark:prose-invert max-w-none">
                <MDXRemote source={content} components={components} />
            </article>
        </main>
    );
}
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getContent(slug: string) {    
    
    const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    if (fs.existsSync(fullPath)) {
        const file = fs.readFileSync(fullPath, "utf8");
        return matter(file);
    }
    return null;
}
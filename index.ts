import { Eta } from "eta";
import { readdir, stat } from "node:fs/promises";
import { join, extname, relative, sep } from "node:path";
import { Buffer } from "node:buffer";
import { minify } from "@minify-html/node";

const PAGES_PATH = "pages";
const OUTPUT_PATH = "docs";
const BASE_URL = "https://AmerikadanSat.com";

const ETA = new Eta({ views: join(import.meta.dirname, "./") })

async function getEtaFiles(dir: string): Promise<string[]> {
    const generatedPages: string[] = [];
    async function walk(sourcePath: string): Promise<void> {
        const entries = await readdir(sourcePath, { withFileTypes: true });
        for (const entry of entries) {
            const srcFullPath = join(sourcePath, entry.name);
            if (entry.isDirectory()) {
                await walk(srcFullPath);
            } else if (entry.isFile() && extname(entry.name).toLowerCase() === ".eta") {
                const sourcePage = srcFullPath.substring(0, srcFullPath.length - 4);
                const targetPath = sourcePath.replace(PAGES_PATH, OUTPUT_PATH);
                const targetPage = sourcePage.replace(PAGES_PATH, OUTPUT_PATH) + ".html";
                const uriFullPath = targetPage.replace(OUTPUT_PATH, "");
                const uriFile = uriFullPath.split("/").pop() ?? "";
                const uriPath = uriFullPath.substring(0, uriFullPath.lastIndexOf('/')) + "/";
                let content = ETA.render(
                    sourcePage,
                    {
                        path: uriPath,
                        file: uriFile,
                    },
                );
                // content = minify(Buffer.from(content),
                //     {
                //         keep_comments: false
                //     }).toString();
                await Bun.$`mkdir -p ${targetPath}`;
                await Bun.write(targetPage, content);
                generatedPages.push(targetPage);
                console.log(uriFullPath);
            }
        }
    }
    await walk(dir);
    return generatedPages;
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function toUrlPath(filePath: string): string {
    const relativePath = relative(OUTPUT_PATH, filePath).split(sep).join("/");
    const urlPath = "/" + relativePath;

    // Directory index pages are served from their directory URL.
    if (urlPath.endsWith("/index.html")) {
        return urlPath.slice(0, -"index.html".length);
    }

    return urlPath;
}

function encodeUrlPath(urlPath: string): string {
    return urlPath.split("/").map(encodeURIComponent).join("/");
}

async function generateSitemaps(htmlFiles: string[]): Promise<void> {
    const pages = await Promise.all(
        [...htmlFiles].sort().map(async (filePath) => {
            const stats = await stat(filePath);
            return {
                url: BASE_URL + encodeUrlPath(toUrlPath(filePath)),
                lastmod: stats.mtime.toISOString(),
            };
        }),
    );

    const xmlSitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...pages.flatMap(({ url, lastmod }) => [
            "  <url>",
            `    <loc>${escapeXml(url)}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            "  </url>",
        ]),
        "</urlset>",
        "",
    ].join("\n");

    await Bun.write(join(OUTPUT_PATH, "sitemap.xml"), xmlSitemap);
    console.log("Generated sitemap.xml");

    const txtSitemap = pages.length > 0
        ? pages.map(({ url }) => url).join("\n") + "\n"
        : "";

    await Bun.write(join(OUTPUT_PATH, "sitemap.txt"), txtSitemap);
    console.log("Generated sitemap.txt");
}

await Bun.$`mkdir -p ${OUTPUT_PATH}`;

const generatedPages = await getEtaFiles(PAGES_PATH);
await generateSitemaps(generatedPages);

import { Eta } from "eta";
import { cp, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { Buffer } from "node:buffer";
import { minify } from "@minify-html/node";

const PAGES_PATH = "pages";
const OUTPUT_PATH = "docs";
const BASE_URL = "https://AmerikadanSat.com";

const ETA = new Eta({ views: join(import.meta.dirname, "./") })

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function encodeUrlPath(urlPath: string): string {
    return urlPath.split("/").map(encodeURIComponent).join("/");
}

async function generateFiles(dir: string): Promise<void> {
    const sitemap: Array<{ url: string; lastmod: string }> = [];
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
                /*
                content = minify(Buffer.from(content),
                    {
                        keep_comments: false
                    }).toString();
                */
                await Bun.$`mkdir -p ${targetPath}`;
                await Bun.write(targetPage, content);
                const stats = await stat(srcFullPath);
                let urlPath = uriFullPath;
                if (uriFullPath.endsWith("/index.html")) {
                    urlPath = uriFullPath.slice(0, -"index.html".length);
                }
                sitemap.push({
                    url: BASE_URL + encodeUrlPath(urlPath),
                    lastmod: stats.mtime.toISOString(),
                });
                console.log(uriFullPath);
            }
        }
    }
    await walk(dir);

    const xmlSitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...sitemap.flatMap(({ url, lastmod }) => [
            "  <url>",
            `    <loc>${escapeXml(url)}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            "  </url>",
        ]),
        "</urlset>",
        "",
    ].join("\n");

    await Bun.write(join(OUTPUT_PATH, "sitemap.xml"), xmlSitemap);
    console.log("/sitemap.xml");

    const txtSitemap = sitemap.length > 0
        ? sitemap.map(({ url }) => url).join("\n") + "\n"
        : "";

    await Bun.write(join(OUTPUT_PATH, "sitemap.txt"), txtSitemap);
    console.log("/sitemap.txt");
}

await Bun.$`rm -rf ${OUTPUT_PATH}`;

await Bun.$`mkdir -p ${OUTPUT_PATH}`;

await generateFiles(PAGES_PATH);

await cp("assets", OUTPUT_PATH, { recursive: true });

import { Eta } from "eta";
import { readdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { Buffer } from "node:buffer";
import { minify } from "@minify-html/node";

const PAGES_PATH = "pages";
const OUTPUT_PATH = "docs";

const ETA = new Eta({ views: join(import.meta.dirname, "./") })

async function getEtaFiles(dir: string): Promise<void> {
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
                console.log(uriFullPath);
            }
        }
    }
    await walk(dir);
}

await Bun.$`mkdir -p ${OUTPUT_PATH}`;

await getEtaFiles(PAGES_PATH);

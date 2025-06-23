import puppeteer from "@cloudflare/puppeteer";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function GET(request) {
    const { env, cf, ctx } = getCloudflareContext();

    const { searchParams } = new URL(request.url);
    let url = searchParams.get("url");
    let img;
    if (url) {
        url = new URL(url).toString(); // normalize
        img = await env.KV.get(url, { type: "arrayBuffer" });
        if (img === null) {
            const browser = await puppeteer.launch(env.BROWSER);
            const page = await browser.newPage();
            await page.goto(url);
            img = await page.screenshot();
            await env.KV.put(url, img, {
                expirationTtl: 60 * 60 * 24,
            });
            await browser.close();
        }
        return new Response(img, {
            headers: {
                "content-type": "image/jpeg",
            },
        });
    } else {
        return new Response("Please add an ?url=https://example.com/ parameter");
    }
}

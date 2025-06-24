import puppeteer from "@cloudflare/puppeteer";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request) {
    const { env, cf, ctx } = getCloudflareContext();

    const { searchParams } = new URL(request.url);
    let url = searchParams.get("url");
    let pdf;
    if (url) {
        url = new URL(url).toString(); // normalize
        pdf = await env.KV.get(url, { type: "arrayBuffer" });
        if (pdf === null) {
            const browser = await puppeteer.launch(env.BR);
            const page = await browser.newPage();
            page.setViewport({ width: 1366, height: 768 })
            await page.goto(url, { waitUntil: 'networkidle0' });
            pdf = await page.pdf({
                // 隐藏页头页脚
                displayHeaderFooter: false,
                // 输出背景图
                printBackground: false,
                // 输出纸张格式
                format: 'a3',
                // 超时时间，这里的超时时间需要单独设置
                timeout: 180e3,
                // 边距
                margin: { left: 0.2, top: 0.2, right: 0.2, bottom: 0.2 },
            })
            await env.KV.put(url, pdf, {
                expirationTtl: 60 * 10, // 缓存10分钟
            });
            await browser.close();
        }
        return new Response(pdf, {
            headers: {
                "content-type": "application/pdf",
            },
        });
    } else {
        return new Response("Please add an ?url=https://example.com/ parameter");
    }
}

import puppeteer from 'puppeteer';

let id = 0;

async function _visit(url: string) {
    console.info(`[#${++id}] Received bot request`);

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-gpu',
            "--no-sandbox",
            '--disable-dev-shm-usage'
        ]
    });

    const page = await browser.newPage();

    await page.setCookie({
        name: 'FLAG',
        value: process.env['FLAG'] || 'flag{test_flag}',
        httpOnly: false,
        path: '/',
        domain: 'localhost:3000',
        sameSite: 'Strict'
    });

    console.info(`[#${id}] Visiting ${url}`);

    page.goto(url, { timeout: 3 * 1000 }).then(_ => {
        setTimeout(async () => {
            await page.close();
            await browser.close();
            console.info(`[#${id}] Visited`);
        }, 5 * 1000);
    })
}

export function visit(url: string) {
    return _visit(url).then(_ => true).catch(e => (console.error(e), false));
}

export default visit;
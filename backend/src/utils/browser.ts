import puppeteer, { type Browser } from "puppeteer";

export let cachedBrowser: Browser = null;

export async function launch() {
  if (!cachedBrowser) {
    cachedBrowser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1900, height: 1000 },
      args: ["--no-sandbox"],
    });
  }

  return cachedBrowser;
}

export async function kill() {
  if (cachedBrowser) {
    await cachedBrowser.close();
    cachedBrowser = null;
  }
}

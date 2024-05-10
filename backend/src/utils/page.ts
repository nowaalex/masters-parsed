import type { HTTPRequest, Handler, Page } from "puppeteer";
import { launch, kill, cachedBrowser } from "./browser";

const JS_BLACKLIST = [
  // irritating cookiebar
  "enzuzo.com",
  "gstatic.com",
  "fxx.bcdn.net",
  "connect.facebook.net",
  "bootstrap",
  // custom dropdowns, derived from regular selects
  "select2",
  // overlays
  "lightbox",
  "gk.scripts",
  "k2.frontend",
];

const requestInterceptor: Handler<HTTPRequest> = (request) => {
  switch (request.resourceType()) {
    case "image":
    case "stylesheet":
    case "font":
    case "manifest":
    case "xhr":
    case "other":
      request.abort();
      break;
    case "script": {
      const path = request.url().toLowerCase();
      if (JS_BLACKLIST.some((suffix) => path.includes(suffix))) {
        request.abort();
      } else {
        request.continue();
      }
      break;
    }
    case "document": {
      const path = request.url().toLowerCase();
      if (path.includes("facebook.com")) {
        request.abort();
      } else {
        request.continue();
      }
      break;
    }
    default:
      request.continue();
      break;
  }
};

export async function open() {
  try {
    const browser = await launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", requestInterceptor);
    return page;
  } catch (e) {
    throw e;
  }
}

export async function close(page: Page) {
  if (cachedBrowser) {
    try {
      await page.close();
      const pages = await cachedBrowser.pages();
      if (!pages.length) {
        await kill();
      }
    } catch (e) {
      throw e;
    }
  }
}

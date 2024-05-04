import type { Browser } from "puppeteer";

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

async function newPage(browser: Browser) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const path = request.url().toLowerCase();
    switch (request.resourceType()) {
      case "image":
      case "stylesheet":
      case "font":
      case "manifest":
      case "xhr":
      case "other":
        request.abort();
        break;
      case "script":
        if (JS_BLACKLIST.some((suffix) => path.includes(suffix))) {
          request.abort();
        } else {
          request.continue();
        }
        break;
      case "document":
        if (path.includes("facebook.com")) {
          request.abort();
        } else {
          request.continue();
        }
        break;
      default:
        request.continue();
        break;
    }
  });
  return page;
}

export default newPage;

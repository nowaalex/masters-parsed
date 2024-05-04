import type { Browser } from "puppeteer";

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
        if (
          // irritating cookiebar
          path.includes("enzuzo.com") ||
          path.includes("gstatic.com") ||
          path.includes("fxx.bcdn.net") ||
          path.includes("connect.facebook.net")
        ) {
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

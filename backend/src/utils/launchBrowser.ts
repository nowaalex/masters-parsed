import puppeteer from "puppeteer";

const launchBrowser = () =>
  puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1900, height: 1000 },
    args: ["--no-sandbox"],
  });

export default launchBrowser;

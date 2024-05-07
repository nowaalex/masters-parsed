import puppeteer from "puppeteer";
import { getOptionValueByText } from "./dropdowns";
import newPage from "./newPage";
import launchBrowser from "./launchBrowser";

async function getAllPlayerEntries() {
  const browser = await launchBrowser();
  const page = await newPage(browser);
  await page.goto("https://masterspl.com/players.html");
  const select = await page.$("#jslimit");
  const allOption = await getOptionValueByText(select, "Wszystko");
  await select.select("#jslimit", allOption);
  await page.waitForNavigation({ timeout: 15000 });
  const result = await page.$eval("#jstable_plz", (table) => {
    const result = [];

    for (const playerLink of table.querySelectorAll(
      "td:first-child .js_div_particName a"
    )) {
      result.push([
        playerLink.textContent.trim(),
        "https://masterspl.com" + playerLink.getAttribute("href"),
      ]);
    }

    return result;
  });

  await browser.close();

  return result;
}

export default getAllPlayerEntries;

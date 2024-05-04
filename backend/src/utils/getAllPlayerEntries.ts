import puppeteer from "puppeteer";
import { getOptionValueByText } from "./dropdowns";
import newPage from "./newPage";

async function getAllPlayerEntries() {
  const browser = await puppeteer.launch({ headless: true });
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

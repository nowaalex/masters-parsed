import type { Page } from "puppeteer";
import { getOptionValueByText } from "./dropdowns";
import { open, close } from "./page";

async function getAllPlayerEntries() {
  let page: Page = null;
  try {
    page = await open();
    await page.goto("https://masterspl.com/players.html");
    const select = await page.$("#jslimit");
    const allOption = await getOptionValueByText(select, "Wszystko");
    await select.select("#jslimit", allOption);
    await page.waitForNavigation({ timeout: 25000 });
    const result = await page.$eval("#jstable_plz", (table) => {
      const result: [string, string][] = [];

      for (const playerLink of table.querySelectorAll(
        "td:first-child .js_div_particName a"
      )) {
        result.push([
          playerLink.textContent.trim(),
          "https://masterspl.com" + playerLink.getAttribute("href"),
        ] as const);
      }

      return result;
    });
    return result;
  } catch (e) {
    throw e;
  } finally {
    if (page) {
      close(page);
    }
  }
}

export default getAllPlayerEntries;

import puppeteer, { type ElementHandle, type Page } from "puppeteer";
import clickDropdownOption from "./clickDropdownOption";
import extractMatchesFromElement from "./extractMatchesFromElement";
import newPage from "./newPage";

async function clickMatchesTab(page: Page) {
  await page.click(".nav a::-p-text(Mecze)");
}

async function getPlayerMatches(
  playerLink: string,
  playerName: string,
  league: string
) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1900, height: 1000 },
  });
  const page = await newPage(browser);
  await page.goto(playerLink);
  await clickMatchesTab(page);
  await clickDropdownOption(page, "#jslimit", "Wszystko", false);
  await clickDropdownOption(page, "#sid", league, true);
  await clickMatchesTab(page);

  const table = await page.waitForSelector("#stab_matches .jstable", {
    timeout: 5000,
  });

  const result = await table.evaluate(extractMatchesFromElement, playerName);

  await browser.close();

  return result;
}

export default getPlayerMatches;

import puppeteer from "puppeteer";
import { getOptionValueByText } from "./dropdowns";
import extractMatchesFromElement from "./extractMatchesFromElement";
import newPage from "./newPage";
import type { MatchesEntryBackend } from "common-types";

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
  const leagueSelect = await page.waitForSelector("#sid", { timeout: 1000 });
  const leagueValue = await getOptionValueByText(leagueSelect, league);

  let result: MatchesEntryBackend["data"] = [];

  if (leagueValue) {
    const matchesQuantitySelect = await page.waitForSelector(
      "#stab_matches #jslimit",
      { timeout: 1000 }
    );
    const allOptionValue = await getOptionValueByText(
      matchesQuantitySelect,
      "Wszystko"
    );
    await matchesQuantitySelect.select(allOptionValue);
    await page.waitForNavigation({
      timeout: 30000,
    });

    await page.select("#sid", leagueValue);
    await page.waitForNavigation({
      timeout: 30000,
    });
    result = await page.$eval(
      "#stab_matches .jstable",
      extractMatchesFromElement,
      playerName
    );
  }

  await browser.close();

  return result;
}

export default getPlayerMatches;

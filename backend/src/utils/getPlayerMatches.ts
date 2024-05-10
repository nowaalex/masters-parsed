import type { Page } from "puppeteer";
import { getOptionValueByText } from "./dropdowns";
import extractMatchesFromElement from "./extractMatchesFromElement";
import { open, close } from "./page";

async function getPlayerMatches(
  playerLink: string,
  playerName: string,
  league: string
) {
  let page: Page = null;

  try {
    page = await open();
    await page.goto(playerLink);
    const leagueSelect = await page.waitForSelector("#sid", { timeout: 3000 });
    const leagueValue = await getOptionValueByText(leagueSelect, league);

    if (leagueValue) {
      const matchesQuantitySelect = await page.waitForSelector(
        "#stab_matches #jslimit",
        { timeout: 3000 }
      );
      const allOptionValue = await getOptionValueByText(
        matchesQuantitySelect,
        "Wszystko"
      );
      await matchesQuantitySelect.select(allOptionValue);
      await page.waitForNavigation({
        timeout: 40000,
      });

      await page.select("#sid", leagueValue);
      await page.waitForNavigation({
        timeout: 40000,
      });
      const result = await page.$eval(
        "#stab_matches .jstable",
        extractMatchesFromElement,
        playerName
      );
      return result;
    }
  } catch (e) {
    throw e;
  } finally {
    if (page) {
      close(page);
    }
  }
}
export default getPlayerMatches;

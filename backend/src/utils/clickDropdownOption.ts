import type { Page } from "puppeteer";

async function clickDropdownOption(
  page: Page,
  selector: string,
  optionText: string,
  silent: boolean
) {
  const select = await page.waitForSelector(selector, { timeout: 5000 });
  const option = await select.$(`${selector} option::-p-text(${optionText})`);

  if (option || !silent) {
    const optionValue = await option.evaluate((el) => el.getAttribute("value"));
    await select.select(optionValue);
    await page.waitForNavigation({
      timeout: 25000,
      waitUntil: ["load", "networkidle0"],
    });
  }
}

export default clickDropdownOption;

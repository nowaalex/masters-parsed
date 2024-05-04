import type { ElementHandle } from "puppeteer";

export async function getOptionValueByText(
  handle: ElementHandle,
  optionText: string
) {
  const option = await handle.$(`option::-p-text(${optionText})`);
  if (option) {
    return option.evaluate((el) => el.getAttribute("value"));
  }

  return "";
}

import { mkdir } from 'node:fs/promises';
import type { Browser } from 'webdriverio';

export async function tapByText(driver: Browser, text: string) {
  const element = await driver.$(`android=new UiSelector().text("${text}")`);
  await element.waitForDisplayed({ timeout: 10_000 });
  await element.click();
}

export async function isTextVisible(driver: Browser, text: string) {
  const element = await driver.$(`android=new UiSelector().textContains("${text}")`);
  return element.isDisplayed().catch(() => false);
}

export async function isTextOrDescriptionVisible(driver: Browser, text: string) {
  if (await isTextVisible(driver, text)) return true;

  const element = await driver.$(`android=new UiSelector().descriptionContains("${text}")`);
  return element.isDisplayed().catch(() => false);
}

export async function waitForTextOrDescription(driver: Browser, text: string, timeout = 10_000) {
  await driver.waitUntil(async () => (await driver.getPageSource()).includes(text), {
    timeout,
    timeoutMsg: `Texto não apareceu na tela: ${text}`,
  });
}

export async function tapByDescription(driver: Browser, text: string) {
  const element = await driver.$(`android=new UiSelector().descriptionContains("${text}")`);
  await element.waitForDisplayed({ timeout: 10_000 });
  await element.click();
}

export async function tapLastButton(driver: Browser) {
  const button = await driver.$('(//android.widget.Button)[last()]');
  await button.waitForDisplayed({ timeout: 10_000 });
  await button.click();
}

export async function tapByTextOrDescription(driver: Browser, text: string) {
  const textElement = await driver.$(`android=new UiSelector().textContains("${text}")`);

  if (await textElement.isDisplayed().catch(() => false)) {
    await textElement.click();
    return;
  }

  await tapByDescription(driver, text);
}

export async function scrollDown(driver: Browser) {
  await driver.execute('mobile: scrollGesture', {
    left: 100,
    top: 900,
    width: 880,
    height: 1_000,
    direction: 'down',
    percent: 0.8,
  });
}

export async function saveScreenshot(driver: Browser, name: string) {
  await mkdir('screenshots', { recursive: true });
  await driver.saveScreenshot(`screenshots/${name}-${Date.now()}.png`);
}

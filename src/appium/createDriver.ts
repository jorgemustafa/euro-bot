import { remote } from 'webdriverio';
import { config } from '../config.js';

export async function createDriver() {
  return remote({
    hostname: config.appium.hostname,
    logLevel: 'error',
    port: config.appium.port,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': config.appium.deviceName,
      ...(config.appium.udid ? { 'appium:udid': config.appium.udid } : {}),
      'appium:appPackage': config.appium.appPackage,
      ...(config.appium.appActivity ? { 'appium:appActivity': config.appium.appActivity } : {}),
      'appium:noReset': true,
      'appium:newCommandTimeout': 120,
    },
  });
}

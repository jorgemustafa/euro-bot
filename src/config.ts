import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  ANDROID_DEVICE_NAME: z.string().default('Android'),
  ANDROID_UDID: z.string().optional(),
  APPIUM_HOST: z.string().default('127.0.0.1'),
  APPIUM_PORT: z.coerce.number().default(4723),
  APP_PACKAGE: z.string().default('net.dzigne.sigmaapp.euroville'),
  APP_ACTIVITY: z.string().optional(),
  BOOKING_COURTS: z.string().default('Quadra 1'),
  BOOKING_TIMES: z.string().default('19:00'),
  BOOKING_DAY_OFFSET: z.coerce.number().default(1),
  DRY_RUN: z.coerce.boolean().default(true),
});

const env = envSchema.parse(process.env);

export const config = {
  appium: {
    hostname: env.APPIUM_HOST,
    port: env.APPIUM_PORT,
    deviceName: env.ANDROID_DEVICE_NAME,
    udid: env.ANDROID_UDID || undefined,
    appPackage: env.APP_PACKAGE,
    appActivity: env.APP_ACTIVITY || undefined,
  },
  booking: {
    preferredCourts: splitCsv(env.BOOKING_COURTS),
    preferredTimes: splitCsv(env.BOOKING_TIMES),
    dayOffset: env.BOOKING_DAY_OFFSET,
    dryRun: env.DRY_RUN,
  },
};

function splitCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

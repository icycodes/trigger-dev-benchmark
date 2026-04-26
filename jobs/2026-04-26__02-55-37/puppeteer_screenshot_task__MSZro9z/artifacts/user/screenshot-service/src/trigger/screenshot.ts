import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

export const screenshotTask = task({
  id: "puppeteer-screenshot-puppeteer_screenshot_task__MSZro9z",
  maxDuration: 300,
  run: async (payload: { url: string }) => {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
      const page = await browser.newPage();
      await page.goto(payload.url, { waitUntil: "networkidle2" });

      const screenshotsDir = "/home/user/screenshot-service/screenshots";
      await fs.mkdir(screenshotsDir, { recursive: true });

      // Generate a slug from the URL
      const urlSlug = payload.url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const screenshotPath = path.join(screenshotsDir, `${urlSlug}.png`);

      await page.screenshot({ path: screenshotPath, fullPage: true });

      return screenshotPath;
    } finally {
      await browser.close();
    }
  }
});

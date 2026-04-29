import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

export const screenshotTask = task({
  id: "puppeteer-screenshot-puppeteer_screenshot_task__9BLXpnW",
  run: async (payload: { url: string; url_slug: string }) => {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto(payload.url, { waitUntil: "networkidle2" });

      const screenshotDir = "/home/user/screenshot-service/screenshots";
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const screenshotPath = path.join(screenshotDir, `${payload.url_slug}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      return screenshotPath;
    } finally {
      await browser.close();
    }
  },
});

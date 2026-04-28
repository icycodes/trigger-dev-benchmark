import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

export const screenshotTask = task({
  id: "puppeteer-screenshot-puppeteer_screenshot_task__ag8UHAt",
  run: async ({ url }: { url: string }) => {
    // Ensure screenshots directory exists
    const screenshotsDir = path.join(process.cwd(), "screenshots");
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Create a slug from the URL
    const urlSlug = url
      .replace(/^https?:\/\//, "")
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const screenshotPath = path.join(screenshotsDir, `${urlSlug}.png`);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url, { waitUntil: "networkidle0" });

      // Take a full-page screenshot
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      await page.close();

      return {
        screenshotPath,
        url
      };
    } finally {
      await browser.close();
    }
  },
});
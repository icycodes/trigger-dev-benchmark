import { task } from "@trigger.dev/sdk";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

export const screenshotTask = task({
  id: "puppeteer-screenshot-puppeteer_screenshot_task__CpV8wbs",
  run: async ({ url }: { url: string }) => {
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(__dirname, "../../screenshots");
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Create a URL slug for the filename
    const urlSlug = url
      .replace(/^https?:\/\//, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();

    const screenshotPath = path.join(screenshotsDir, `${urlSlug}.png`);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url, { waitUntil: "networkidle0" });

    // Take a full-page screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    await browser.close();

    return screenshotPath;
  },
});
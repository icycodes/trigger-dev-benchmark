import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

export const screenshotTask = task({
  id: "puppeteer-screenshot-puppeteer_screenshot_task__ya5RkyJ",
  run: async (payload: { url: string }, { ctx }) => {
    const { url } = payload;
    if (!url) {
      throw new Error("URL is required");
    }

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      
      const urlSlug = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const screenshotsDir = path.join("/home/user/screenshot-service", "screenshots");
      
      await fs.mkdir(screenshotsDir, { recursive: true });
      
      const screenshotPath = path.join(screenshotsDir, `${urlSlug}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      
      return { screenshotPath };
    } finally {
      await browser.close();
    }
  }
});

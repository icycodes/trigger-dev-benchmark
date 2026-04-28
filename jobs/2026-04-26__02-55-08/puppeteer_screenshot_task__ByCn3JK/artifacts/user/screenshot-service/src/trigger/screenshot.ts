import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export const screenshotTask = task({
  id: "puppeteer-screenshot-puppeteer_screenshot_task__ByCn3JK",
  run: async (payload: { url: string }) => {
    const { url } = payload;
    const urlSlug = url.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const screenshotDir = "/home/user/screenshot-service/screenshots";
    const screenshotPath = path.join(screenshotDir, `${urlSlug}.png`);

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      await page.screenshot({ path: screenshotPath, fullPage: true });
      
      return {
        path: screenshotPath
      };
    } finally {
      await browser.close();
    }
  },
});

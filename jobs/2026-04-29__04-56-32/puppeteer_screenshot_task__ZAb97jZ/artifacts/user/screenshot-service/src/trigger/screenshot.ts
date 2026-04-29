import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

const trialId = "puppeteer_screenshot_task__ZAb97jZ";

function urlToSlug(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export const screenshotTask = task({
  id: `puppeteer-screenshot-${trialId}`,
  maxDuration: 300,
  run: async (payload: { url: string }) => {
    const { url } = payload;

    const screenshotsDir = path.join("/home/user/screenshot-service/screenshots");
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const slug = urlToSlug(url);
    const screenshotPath = path.join(screenshotsDir, `${slug}.png`);

    const browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } finally {
      await browser.close();
    }

    return { screenshotPath };
  },
});

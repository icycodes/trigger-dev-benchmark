import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

const TRIAL_ID = "puppeteer_screenshot_task__PZwjwuE";
const SCREENSHOTS_DIR = "/home/user/screenshot-service/screenshots";

function urlToSlug(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export const screenshotTask = task({
  id: `puppeteer-screenshot-${TRIAL_ID}`,
  maxDuration: 300,
  run: async (payload: { url: string }) => {
    const { url } = payload;

    // Ensure screenshots directory exists
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }

    const slug = urlToSlug(url);
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${slug}.png`);

    const browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } finally {
      await browser.close();
    }

    return { screenshotPath };
  },
});

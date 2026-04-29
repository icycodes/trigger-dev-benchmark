import { task } from "@trigger.dev/sdk";
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const trialId = (await fs.readFile("/logs/trial_id", "utf8")).trim();

const screenshotsDir = "/home/user/screenshot-service/screenshots";

const slugifyUrl = (url: string) =>
  url
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const screenshotTask = task({
  id: `puppeteer-screenshot-${trialId}`,
  run: async (payload: { url: string }) => {
    const slug = slugifyUrl(payload.url) || "screenshot";
    const screenshotPath = path.join(screenshotsDir, `${slug}.png`);

    await fs.mkdir(screenshotsDir, { recursive: true });

    const browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto(payload.url, { waitUntil: "networkidle2" });
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } finally {
      await browser.close();
    }

    return screenshotPath;
  },
});

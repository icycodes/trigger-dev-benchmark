import { task } from "@trigger.dev/sdk";
import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();
const screenshotsDir = "/home/user/screenshot-service/screenshots";

const slugifyUrl = (value: string) => {
  const slug = value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "screenshot";
};

export const screenshotTask = task({
  id: `puppeteer-screenshot-${trialId}`,
  run: async ({ url }: { url: string }) => {
    const urlSlug = slugifyUrl(url);

    await mkdir(screenshotsDir, { recursive: true });

    const screenshotPath = path.join(screenshotsDir, `${urlSlug}.png`);
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

    return screenshotPath;
  },
});

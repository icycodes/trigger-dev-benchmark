import fs from "node:fs";
import path from "node:path";
import { task } from "@trigger.dev/sdk";
import { z } from "zod";
import puppeteer from "puppeteer";

const trialId = fs.readFileSync("/logs/trial_id", "utf8").trim();

const screenshotSchema = z.object({
  url: z.string().url(),
});

const screenshotsDir = "/home/user/screenshot-service/screenshots";

const toSlug = (url: string) => {
  const slug = url
    .replace(/^https?:\/\//i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return slug.length > 0 ? slug : "screenshot";
};

export const screenshotTask = task({
  id: `puppeteer-screenshot-${trialId}`,
  schema: screenshotSchema,
  run: async (payload) => {
    await fs.promises.mkdir(screenshotsDir, { recursive: true });

    const screenshotPath = path.join(
      screenshotsDir,
      `${toSlug(payload.url)}.png`
    );

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

    return { path: screenshotPath };
  },
});

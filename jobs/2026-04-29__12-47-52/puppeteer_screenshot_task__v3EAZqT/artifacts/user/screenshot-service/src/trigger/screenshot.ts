import { task } from "@trigger.dev/sdk/v3";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

// Create a URL slug from a URL
function createUrlSlug(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, "_");
    const pathname = urlObj.pathname.replace(/[^a-zA-Z0-9]/g, "_");
    return `${hostname}${pathname}`.replace(/_+/g, "_").replace(/^_|_$/g, "");
  } catch (error) {
    return url.replace(/[^a-zA-Z0-9]/g, "_");
  }
}

// Read the trial_id from /logs/trial_id
const trialId = fs.readFileSync("/logs/trial_id", "utf-8").trim();

export const puppeteerScreenshotTask = task({
  id: `puppeteer-screenshot-${trialId}`,
  run: async ({ payload }: { payload: { url: string } }) => {
    const { url } = payload;
    
    // Create the screenshots directory if it doesn't exist
    const screenshotsDir = "/home/user/screenshot-service/screenshots";
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    // Create a URL slug for the filename
    const urlSlug = createUrlSlug(url);
    const screenshotPath = path.join(screenshotsDir, `${urlSlug}.png`);
    
    // Launch Puppeteer with the specified options
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Navigate to the URL
      await page.goto(url, { waitUntil: "networkidle2" });
      
      // Take a full-page screenshot
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      
      return {
        success: true,
        screenshotPath: screenshotPath,
        url: url,
      };
    } finally {
      // Close the browser
      await browser.close();
    }
  },
});
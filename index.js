const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Example route
app.get("/fetchImage", async (req, res) => {
  const url = req.query.url;
  console.log("fetching");
  try {
    const imageUrl = await fetchFeaturedImageUrl(url);
    console.log(imageUrl);
    res.status(200).send(imageUrl);
  } catch (error) {
    console.error("Error fetching featured image URL:", error);
    res.status(500).send("Error fetching featured image URL");
  }
});

// Example route to replace Firebase function
app.get("/fetchPinterestImage", async (req, res) => {
  const url = req.query.url;
  try {
    const imageUrl = await fetchPinterestImageUrl(url);
    console.log(imageUrl);
    res.status(200).send(imageUrl);
  } catch (error) {
    console.error("Error fetching featured image URL:", error);
    res.status(500).send("Error fetching featured image URL");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
async function fetchPinterestImageUrl(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: await puppeteer.executablePath(), // Use Puppeteer's bundled Chromium
  });
  const page = await browser.newPage();

  // Set User-Agent to avoid detection
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle2" });

  // Fetch the URL of the second image
  const imageUrl = await page.evaluate(() => {
    const images = document.querySelectorAll("img");
    return images.length > 1 ? images[1].src : null;
  });

  await browser.close();
  return imageUrl;
}
async function fetchFeaturedImageUrl(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: await puppeteer.executablePath(), // Use Puppeteer's bundled Chromium
  });
  const page = await browser.newPage();

  // Set User-Agent to avoid detection
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle2" });

  // Extract the featured image URL
  const featuredImageUrl = await page.evaluate(() => {
    const metaTag = document.querySelector('meta[property="og:image"]');
    return metaTag ? metaTag.content : null;
  });

  await browser.close();
  return featuredImageUrl;
}

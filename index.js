import express from "express";

import "dotenv/config";
import { replaceEmptyStringWithNull } from "./utils.js";
import { scrapeLiveMatches } from "./liveScore.js";
const app = express();

const port = process.env.PORT;
const apiDocumentation = {
  liveMatches: {
    description: "Get a list of live matches.",
    endpoint: "/liveMatches",
    method: "GET",
  },
  recentMatches: {
    description: "Get a list of recent matches.",
    endpoint: "/recentMatches",
    method: "GET",
  },
};

app.get("/", async (_, res) => {
  res.json(apiDocumentation);
});

app.get("/liveMatches", async (req, res) => {
  const url = process.env.LIVE_URL;
  try {
    const matches = await scrapeLiveMatches(url);
    const finalData = replaceEmptyStringWithNull(matches);
    res.json(finalData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while scraping data." });
  }
});

app.get("/recentMatches", async (req, res) => {
  const url = process.env.RECENT_URL;
  try {
    const matches = await scrapeLiveMatches(url);
    const finalData = replaceEmptyStringWithNull(matches);
    res.json(finalData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while scraping data." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

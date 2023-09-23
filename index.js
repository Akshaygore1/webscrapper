import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import "dotenv/config";
const app = express();

const port = process.env.PORT;
const url = process.env.URL;

async function scrapeMatches(url) {
  try {
    // Fetch the HTML content
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Create an array to store the scraped match data
    const matches = [];

    // Select all the elements with class 'list-content'
    const listContentElements = $(".list-content");

    listContentElements.each((index, element) => {
      const matchElement = $(element);

      // Extract data for each match
      const team1 = matchElement
        .find(".ui-team-matches-name")
        .eq(0)
        .text()
        .trim();
      const score1 = matchElement
        .find('.ui-completed-batteam-scores span[style="font-size:16px"]')
        .eq(0)
        .text()
        .trim();
      const overs1 = matchElement
        .find(".ui-completed-batteam-scores span")
        .eq(2)
        .text()
        .trim();
      const team2 = matchElement
        .find(".ui-team-matches-name")
        .eq(1)
        .text()
        .trim();
      const score2 = matchElement
        .find('.ui-team2-scores span[style="font-size:16px"]')
        .eq(0)
        .text()
        .trim();
      const overs2 = matchElement
        .find(".ui-team2-scores span")
        .eq(2)
        .text()
        .trim();
      const result = matchElement
        .find(".cbz-ui-home.cbz-ui-home-blue.cbz-common-match")
        .text()
        .trim();
      const upcoming = matchElement
        .find(".cbz-ui-home.cbz-ui-home-yellow.cbz-common-match")
        .text()
        .trim();

      if (team1 !== "" && team2 !== "") {
        const matchData = {
          team1,
          score1,
          overs1,
          team2,
          score2,
          overs2,
          result,
          upcoming,
        };

        matches.push(matchData);
      }
    });

    return matches;
  } catch (error) {
    throw error;
  }
}

function replaceEmptyStringWithNull(data) {
  // Iterate through each object in the array
  for (const obj of data) {
    // Iterate through each key in the object
    for (const key in obj) {
      // Check if the value is an empty string, and replace it with null
      if (obj[key] === "") {
        obj[key] = null;
      }
    }
  }
  return data;
}

app.get("/results", async (req, res) => {
  try {
    const matches = await scrapeMatches(url);
    const finalData = replaceEmptyStringWithNull(matches);
    res.json(finalData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while scraping data." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

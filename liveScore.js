import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeLiveMatches(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const internationalMatches = [];

    $("#international-matches > div").each(async (index, container) => {
      const matchContainer = $(container);
      const tournamentName = matchContainer
        .find(".cb-list-item.ui-header.ui-branding-header")
        .text()
        .trim();

      const matchInfo = matchContainer.find(".ui-li-heading");
      const team1 = matchInfo
        .find(".ui-bat-team-scores .cb-ovr-flo:eq(0)")
        .text()
        .trim();
      const score1 = matchInfo
        .find(".ui-bat-team-scores .cb-ovr-flo:eq(1)")
        .text()
        .trim();
      const team2 = matchInfo
        .find(".ui-bowl-team-scores .cb-ovr-flo:eq(0)")
        .text()
        .trim();
      const score2 = matchInfo
        .find(".ui-bowl-team-scores .cb-ovr-flo:eq(1)")
        .text()
        .trim();
      const result = matchInfo.find(".cbz-ui-status").text().trim();
      const scorecardLink = matchContainer
        .find('a[href^="/live-cricket-scorecard/"]')
        .attr("href");

      const matchData = {
        tournamentName,
        team1,
        score1,
        team2,
        score2,
        result,
        scorecardLink,
      };

      internationalMatches.push(matchData);
    });
    return internationalMatches;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

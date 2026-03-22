import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchWebsiteData(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 10000,
  });
  const html = response.data;
  const page = cheerio.load(html);

  page("script").remove();
  page("style").remove();
  page("noscript").remove();

  const text = page("body").text().replace(/\s+/g, " ").trim(); /*
  \s+ means Find one or more whitespace characters in a row.
  g means: “global” This tells JavaScript: Do this for the whole
   string, not just the first match. Without g, only the first extra space group would be replaced. With g, all extra spaces everywhere are cleaned.”
  */
  const shortText = text.split(" ").slice(0, 15000).join(" ");

  return {
    text: shortText,
  };
}

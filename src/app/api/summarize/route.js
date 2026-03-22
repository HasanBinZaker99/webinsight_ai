import OpenAI from "openai";
import { fetchWebsiteData } from "@/lib/scraper";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const url = body.url?.trim();
    const userPrompt = body.userPrompt?.trim();

    if (!url) {
      return Response.json(
        { error: "Please enter a website URL" },
        { status: 400 },
      );
    }

    if (!userPrompt) {
      return Response.json(
        {
          error: "Please enter your prompt",
        },
        { status: 400 },
      );
    }

    const websiteData = await fetchWebsiteData(url);
    const systemPrompt =
      "You are a helpful assistant. Read the website content and answer the user's request in simple and clear English.";
    const userMessage = `
        User prompt:
        ${userPrompt}
        Website URL:
        ${url}
        Website content:
        ${websiteData.text || "No content found"}
        `;

    const response = await client.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return Response.json({
      result: response.choices[0].message.content,
    });
  } catch (erro) {
    return Response.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}

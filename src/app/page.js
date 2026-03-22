"use client";
import { useState } from "react";

export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitRequest() {
    if (!websiteUrl.trim()) {
      setErrorMessage("Please enter a website URL.");
      return;
    }

    if (!userPrompt.trim()) {
      setErrorMessage("Please enter your prompt.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setAnswer("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: websiteUrl,
          userPrompt: userPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Something went wrong.");
      } else {
        setAnswer(data.result || "No answer found.");
      }
    } catch (error) {
      setErrorMessage("Could not connect to the server.");
    }

    setIsLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-3xl font-bold">
          Website Analyzer
        </h1>

        <p className="mb-4 text-center text-gray-600">
          Enter a website URL, write your prompt, and see the answer.
        </p>

        <input
          type="text"
          placeholder="https://example.com"
          value={websiteUrl}
          onChange={(event) => setWebsiteUrl(event.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3"
        />

        <textarea
          placeholder="Example: Summarize this website / What services does this company offer?"
          value={userPrompt}
          onChange={(event) => setUserPrompt(event.target.value)}
          className="mb-4 min-h-[140px] w-full rounded-lg border border-gray-300 px-4 py-3"
        />

        <button
          onClick={submitRequest}
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Working..." : "Submit"}
        </button>

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">
            {errorMessage}
          </p>
        )}

        {answer && (
          <div className="mt-6 rounded-lg border bg-gray-50 p-4">
            <h2 className="mb-2 text-xl font-semibold">Answer</h2>
            <div className="whitespace-pre-wrap text-gray-800">{answer}</div>
          </div>
        )}
      </div>
    </main>
  );
}

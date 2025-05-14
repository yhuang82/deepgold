import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userMessage, goldData, isAnalysis } = await req.json();

    let systemPrompt = `You are an expert financial advisor specializing in gold trading. 
    You have access to the latest 10 minutes of gold price data. 
    Provide clear, concise, and actionable investment advice based on this data.
    Always consider market trends and potential risks in your analysis.
    Format your response in a professional and easy-to-understand manner.
    Always respond in English.`;

    let userPrompt = userMessage;

    if (isAnalysis && goldData) {
      systemPrompt = `You are an expert cryptocurrency trading advisor specializing in PAXG/USDT trading.
      Analyze the provided 10-minute K-line data and provide clear investment advice.
      Your response should include:
      1. A clear recommendation (BUY, SELL, or HOLD)
      2. Brief explanation of the market trend
      3. Key support/resistance levels
      4. Risk assessment
      Always respond in English.`;

      const formattedData = goldData
        .map(
          (data) => `
        Timestamp: ${new Date(data.timestamp).toLocaleString()}
        Open: ${data.open}
        High: ${data.high}
        Low: ${data.low}
        Close: ${data.close}
        Volume: ${data.volume}
      `
        )
        .join("\n");

      userPrompt = `Please analyze the PAXG/USDT trading data from the past 10 minutes and provide investment advice.
      Latest K-line data:
      ${formattedData}
      As a smart trading advisor, please determine whether to BUY, SELL, or HOLD, and briefly explain the reasoning.`;
    } else if (goldData) {
      userPrompt = `Here is the latest gold price data for the past 10 minutes: ${JSON.stringify(
        goldData
      )}\n\nUser question: ${userMessage}`;
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error in agent API:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

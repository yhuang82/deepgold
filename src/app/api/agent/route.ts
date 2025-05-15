import { NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface GoldData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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
          (data: GoldData) => `
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

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      response: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error in agent API:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

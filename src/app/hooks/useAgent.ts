import { useState } from "react";

interface Message {
  text: string;
  sender: "user" | "agent";
  timestamp: number;
}

interface AgentRequest {
  userMessage: string;
  goldData?: any[];
  isAnalysis?: boolean;
}

interface AgentResponse {
  response?: string;
  error?: string;
}

async function messageAgent(
  userMessage: string,
  goldData?: any[],
  isAnalysis: boolean = false
): Promise<string | null> {
  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        goldData,
        isAnalysis,
      } as AgentRequest),
    });

    const data = (await response.json()) as AgentResponse;
    return data.response ?? data.error ?? null;
  } catch (error) {
    console.error("Error communicating with agent:", error);
    return null;
  }
}

export function useAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async (
    input: string,
    goldData?: any[],
    isAnalysis: boolean = false
  ) => {
    if (!input.trim() && !isAnalysis) return;

    const newMessage: Message = {
      text: input,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsThinking(true);

    const responseMessage = await messageAgent(input, goldData, isAnalysis);

    if (responseMessage) {
      const agentMessage: Message = {
        text: responseMessage,
        sender: "agent",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }

    setIsThinking(false);
  };

  const analyzeGoldData = async (goldData: any[]) => {
    if (!goldData || goldData.length === 0) return;

    const analysisPrompt =
      "Please analyze the PAXG/USDT trading data from the past 10 minutes and provide investment advice.";
    await sendMessage(analysisPrompt, goldData, true);
  };

  return { messages, sendMessage, isThinking, analyzeGoldData };
}

"use client";
import { FC, useEffect, useState, useRef } from "react";
import Image from "next/image";
// import { ConnectWallet } from "@coinbase/onchainkit";
import { Wallet } from "@coinbase/onchainkit/wallet";
import KLineChart from "./KLineChart";
import { useGoldData } from "./hooks/useGoldData";
import { useAgent } from "./hooks/useAgent";
import MorphoLending from "./MorphoLending";

// 顶部栏组件
const TopBar: FC<{
  goldBalance: number;
  isWalletConnected: boolean;
  setIsWalletConnected: React.Dispatch<React.SetStateAction<boolean>>;
  handleConnectWallet: () => void;
}> = ({
  goldBalance,
  isWalletConnected,
  setIsWalletConnected,
  handleConnectWallet,
}) => {
  const goldData = useGoldData();
  const [deepGoldPrice, setDeepGoldPrice] = useState<number | null>(null);

  useEffect(() => {
    if (goldData.length > 0) {
      const last = goldData[goldData.length - 1];
      setDeepGoldPrice(last.close);
    }
  }, [goldData]);

  return (
    <header className="w-full h-20 flex items-center justify-between px-8 bg-gray-900/80 border-b border-gray-800 shadow-sm sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {/* LOGO占位 */}
          <span className="text-2xl font-bold text-[#FFD700]">G</span>
        </div>
        <div className="flex flex-col justify-center ml-4">
          <span className="text-xs text-gray-400">DeepGold Price</span>
          <span className="text-2xl font-bold text-[#FFD700]">
            {deepGoldPrice !== null
              ? `$${deepGoldPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "--"}
          </span>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-4">
        {!isWalletConnected ? (
          <button
            className="bg-gradient-to-r from-[#FFD700] to-[#00FFC2] text-gray-900 font-bold px-6 py-2 rounded-xl shadow-md transition-all hover:brightness-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00FFC2]"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <Wallet />
            <div className="bg-gray-800 rounded-lg px-3 py-1 text-sm font-semibold text-[#FFD700] flex items-center">
              {goldBalance.toFixed(4)} PAXG
            </div>
          </>
        )}
      </div>
    </header>
  );
};

// 左侧面板组件
const LeftPanel: FC<{
  goldBalance: number;
  setGoldBalance: React.Dispatch<React.SetStateAction<number>>;
  isWalletConnected: boolean;
}> = ({ goldBalance, setGoldBalance, isWalletConnected }) => {
  // Buy Gold Section 状态
  const [buyInput, setBuyInput] = useState("");
  const [buySuccess, setBuySuccess] = useState(false);
  const buyInputNum = parseFloat(buyInput) || 0;
  const isBuyValid = buyInputNum > 0;

  const handleBuyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*(\.\d{0,6})?$/.test(val)) setBuyInput(val);
    setBuySuccess(false);
  };
  const handleBuy = () => {
    if (!isBuyValid) return;
    setGoldBalance((prev) => Number((prev + buyInputNum).toFixed(6)));
    setBuyInput("");
    setBuySuccess(true);
  };

  return (
    <aside className="flex flex-col space-y-6 h-full flex-[1.1] min-w-[160px] max-w-[220px] px-2 md:px-4">
      <div className="card h-full flex flex-col justify-between p-3 md:p-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🪙</span>
            <h2 className="h2 text-[#FFD700]">Buy Gold</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Buy digital gold for a secure and convenient investment experience.
          </p>
        </div>
        {/* Buy Gold 控件 */}
        {isWalletConnected ? (
          <div className="flex flex-col gap-2 bg-[#181A20] rounded-xl p-3 mt-2">
            <input
              type="text"
              inputMode="decimal"
              pattern="^\d*(\.\d{0,6})?$"
              className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white text-base outline-none border border-gray-800 focus:ring-2 focus:ring-[#FFD700]"
              placeholder="Enter amount to buy"
              value={buyInput}
              onChange={handleBuyInput}
            />
            <button
              className={`w-full py-2 rounded-lg font-bold text-base transition-all ${
                isBuyValid
                  ? "bg-gradient-to-r from-[#FFD700] to-[#00FFC2] text-gray-900 hover:brightness-110"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isBuyValid}
              onClick={handleBuy}
            >
              Buy
            </button>
            {buySuccess && (
              <div className="text-xs text-green-400 text-center">
                Successfully bought gold!
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-gray-500">
            Connect your wallet to buy gold
          </div>
        )}
      </div>
      <div className="card h-full flex flex-col justify-between p-3 md:p-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🏦</span>
            <h2 className="h2 text-[#00FFC2]">Morpho Lending</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Lend your gold tokens and earn yield instantly.
          </p>
        </div>
        {isWalletConnected ? (
          <MorphoLending
            goldBalance={goldBalance}
            setGoldBalance={setGoldBalance}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-gray-500">
            Connect your wallet to lend gold
          </div>
        )}
      </div>
    </aside>
  );
};

// 中间面板组件
const CenterPanel: FC = () => {
  return (
    <section className="flex flex-col items-center flex-[2.5] min-w-[0] h-full">
      <div className="card w-full h-full flex flex-col items-center justify-center p-1 md:p-2">
        <div className="flex items-center mb-2 w-full">
          <span className="text-2xl mr-2">📈</span>
          <h2 className="h2 text-[#FFD700]">K-Line Chart</h2>
        </div>
        <div className="w-full flex-1 bg-gray-700/60 rounded-lg flex items-center justify-center text-gray-500">
          <KLineChart />
        </div>
      </div>
    </section>
  );
};

// 右侧面板组件
const RightPanel: FC = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isThinking, analyzeGoldData } = useAgent();
  const goldData = useGoldData();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const onAnalyze = async () => {
    if (isThinking || !goldData || goldData.length === 0) return;
    await analyzeGoldData(goldData);
  };

  return (
    <aside className="flex flex-col h-full flex-[1.5] min-w-[220px] max-w-[340px] px-2 md:px-4">
      <div className="card h-full flex flex-col justify-between p-3 md:p-4">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#00FFC2] flex items-center justify-center mr-3">
              <span className="text-xl font-bold text-gray-900">AI</span>
            </div>
            <h2 className="h2 text-[#00FFC2]">AI Investment Chat</h2>
          </div>

          {/* Quick Analysis Button */}
          <button
            onClick={onAnalyze}
            disabled={isThinking || !goldData || goldData.length === 0}
            className={`w-full mb-4 px-4 py-2 rounded-lg font-semibold transition-all ${
              isThinking || !goldData || goldData.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#FFD700] to-[#00FFC2] text-gray-900 hover:brightness-110"
            }`}
          >
            {isThinking ? "Analyzing..." : "Quick Analysis (10min)"}
          </button>

          {/* Chat Messages */}
          <div className="flex-1 w-full bg-gray-800/60 rounded-lg p-4 mb-4 overflow-y-auto max-h-[calc(100vh-300px)]">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-lg mb-2">Welcome to DeepGold AI Assistant</p>
                <p className="text-sm">
                  Ask me anything about gold trading or click "Quick Analysis"
                  for instant insights
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[#FFD700] to-[#00FFC2] text-gray-900"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-xs opacity-50 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 rounded-2xl px-4 py-2">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form
          className="flex items-center gap-2 mt-auto"
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
        >
          <input
            type="text"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00FFC2]"
            placeholder="Ask about gold trading..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isThinking
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#FFD700] to-[#00FFC2] text-gray-900 hover:brightness-110"
            }`}
            disabled={isThinking}
          >
            {isThinking ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </aside>
  );
};

export default function Home() {
  // 钱包连接状态（mock，后续可接入真实钱包）
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  // 黄金币余额状态提升到Home
  const [goldBalance, setGoldBalance] = useState(0); // 初始为0

  // 连接钱包时初始化余额
  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setGoldBalance(12.3456); // 这里可以替换为真实钱包余额
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar
        goldBalance={goldBalance}
        isWalletConnected={isWalletConnected}
        setIsWalletConnected={setIsWalletConnected}
        handleConnectWallet={handleConnectWallet}
      />
      <div className="flex-1 flex flex-col items-center justify-center py-3 md:py-6">
        <div className="w-full h-[calc(100vh-120px)] flex flex-row justify-between items-stretch gap-1 md:gap-5 px-2 md:px-4 xl:px-8">
          <LeftPanel
            goldBalance={goldBalance}
            setGoldBalance={setGoldBalance}
            isWalletConnected={isWalletConnected}
          />
          <CenterPanel />
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

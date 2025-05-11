import { FC } from "react";
import Image from "next/image";
// import { ConnectWallet } from "@coinbase/onchainkit";
import { Wallet } from "@coinbase/onchainkit/wallet";


// 顶部栏组件
const TopBar: FC = () => {
  return (
    <header className="w-full h-20 flex items-center justify-between px-8 bg-gray-900/80 border-b border-gray-800 shadow-sm sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {/* LOGO占位 */}
          <span className="text-2xl font-bold text-[#FFD700]">G</span>
        </div>
        <div className="flex space-x-2">
          <div className="card flex flex-col items-center px-4 py-2 min-w-[110px]">
            <span className="text-xs text-gray-400">XAU/USD</span>
            <span className="text-[#FFD700] font-bold">$2,345.67</span>
          </div>
          <div className="card flex flex-col items-center px-4 py-2 min-w-[110px]">
            <span className="text-xs text-gray-400">XAU/EUR</span>
            <span className="text-[#FFD700] font-bold">€2,123.45</span>
          </div>
          <div className="card flex flex-col items-center px-4 py-2 min-w-[110px]">
            <span className="text-xs text-gray-400">XAU/CNY</span>
            <span className="text-[#FFD700] font-bold">¥16,789.01</span>
          </div>
        </div>
      </div>
      <div className="ml-4">
        <Wallet />
      </div>
    </header>
  );
};

// 左侧面板组件
const LeftPanel: FC = () => {
  return (
    <aside className="flex flex-col space-y-6 h-full flex-[1] min-w-[200px] max-w-[240px]">
      <div className="card h-full flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🪙</span>
            <h2 className="h2 text-[#FFD700]">Gold Purchase</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            购买数字黄金，享受安全便捷的投资体验。
          </p>
        </div>
        <div className="h-24 bg-gray-700/60 rounded-lg flex items-center justify-center text-gray-500">
          功能开发中…
        </div>
      </div>
      <div className="card h-full flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🏦</span>
            <h2 className="h2 text-[#00FFC2]">Morpho Lending</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            黄金抵押借贷，释放资产流动性。
          </p>
        </div>
        <div className="h-24 bg-gray-700/60 rounded-lg flex items-center justify-center text-gray-500">
          功能开发中…
        </div>
      </div>
    </aside>
  );
};

// 中间面板组件
const CenterPanel: FC = () => {
  return (
    <section className="flex flex-col items-center flex-[2.5] min-w-[400px] h-full">
      <div className="card w-full h-full flex flex-col items-center justify-center p-2">
        <div className="flex items-center mb-2 w-full">
          <span className="text-2xl mr-2">📈</span>
          <h2 className="h2 text-[#FFD700]">K-Line Chart</h2>
        </div>
        <div className="w-full flex-1 bg-gray-700/60 rounded-lg flex items-center justify-center text-gray-500">
          K线图组件占位
        </div>
      </div>
    </section>
  );
};

// 右侧面板组件
const RightPanel: FC = () => {
  return (
    <aside className="flex flex-col h-full flex-[1] min-w-[200px] max-w-[240px]">
      <div className="card h-full flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#00FFC2] flex items-center justify-center mr-3">
              <span className="text-xl font-bold text-gray-900">AI</span>
            </div>
            <h2 className="h2 text-[#00FFC2]">AI Investment Chat</h2>
          </div>
          <div className="flex-1 w-full bg-gray-700/60 rounded-lg flex items-center justify-center text-gray-500 mb-4">
            聊天内容占位
          </div>
        </div>
        <div className="flex items-center mt-auto">
          <input
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00FFC2]"
            placeholder="输入你的投资问题..."
            disabled
          />
          <button className="ml-2 btn-primary opacity-60 cursor-not-allowed">
            发送
          </button>
        </div>
      </div>
    </aside>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="w-full max-w-7xl h-[calc(100vh-120px)] flex flex-row justify-between items-stretch px-8 gap-5">
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

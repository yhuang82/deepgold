import { useState } from "react";

const MOCK_APY = 5.35; // 年化收益率
const TOKEN_SYMBOL = "PAXG";

export default function MorphoLending({
  goldBalance,
  setGoldBalance,
}: {
  goldBalance: number;
  setGoldBalance: (n: number) => void;
}) {
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState(false);

  const apy = MOCK_APY;
  const inputNum = parseFloat(input) || 0;
  const isValid = inputNum > 0 && inputNum <= goldBalance;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*(\.\d{0,6})?$/.test(val)) setInput(val);
    setSuccess(false);
  };

  const handleLend = () => {
    if (!isValid) return;
    setGoldBalance(Number((goldBalance - inputNum).toFixed(6)));
    setInput("");
    setSuccess(true);
  };

  return (
    <div className="bg-[#181A20] rounded-2xl shadow-lg p-4 w-full max-w-[220px] mx-auto flex flex-col items-stretch">
      <div className="mb-2 flex flex-col items-start">
        <span className="text-lg font-bold text-[#00FFC2] mb-1">
          Gold Lending
        </span>
        <span className="text-xs text-gray-400">
          Lend your gold tokens and earn yield.
        </span>
      </div>
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="text-gray-300">Balance:</span>
        <span className="font-semibold text-white">
          {goldBalance} {TOKEN_SYMBOL}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs mb-4">
        <span className="text-gray-300">APY:</span>
        <span className="font-semibold text-[#FFD700]">{apy}%</span>
      </div>
      <input
        type="text"
        inputMode="decimal"
        pattern="^\d*(\.\d{0,6})?$"
        className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-900 text-white text-base outline-none border border-gray-800 focus:ring-2 focus:ring-[#00FFC2]"
        placeholder="Enter amount to lend"
        value={input}
        onChange={handleInput}
      />
      <button
        className={`w-full py-2 rounded-lg font-bold text-base transition-all mb-2 ${
          isValid
            ? "bg-gradient-to-r from-[#FFD700] to-[#00FFC2] text-gray-900 hover:brightness-110"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!isValid}
        onClick={handleLend}
      >
        Lend
      </button>
      {success && (
        <div className="text-xs text-green-400 text-center">
          Successfully lent your gold!
        </div>
      )}
    </div>
  );
}

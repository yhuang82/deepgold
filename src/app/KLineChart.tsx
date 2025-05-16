"use client";
import React, { useEffect, useRef, useState } from "react";

// K线数据类型
type KLineData = {
  timestamp: number;
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
};

// API返回的数据类型
type KlineMessage = {
  topic: string;
  symbol: string;
  data: KLineData[];
};

const PADDING_LEFT = 72; // 再加大左侧padding
const PADDING_RIGHT = 40;
const PADDING_TOP = 40;
const PADDING_BOTTOM = 40;
const BAR_GAP = 8;
const MIN_BAR_WIDTH = 12;
const MAX_BAR_WIDTH = 40;

const mockData: KLineData[] = [
  {
    timestamp: 1,
    open: 18461.9,
    close: 18700,
    low: 18400,
    high: 18800,
    volume: 67,
  },
  {
    timestamp: 2,
    open: 18700,
    close: 19000,
    low: 18650,
    high: 19100,
    volume: 80,
  },
  {
    timestamp: 3,
    open: 19000,
    close: 19777,
    low: 18900,
    high: 19800,
    volume: 120,
  },
  {
    timestamp: 4,
    open: 19777,
    close: 19600,
    low: 19500,
    high: 19800,
    volume: 110,
  },
  {
    timestamp: 5,
    open: 19600,
    close: 19400,
    low: 19300,
    high: 19700,
    volume: 90,
  },
  {
    timestamp: 6,
    open: 19400,
    close: 19500,
    low: 19300,
    high: 19600,
    volume: 100,
  },
  {
    timestamp: 7,
    open: 19500,
    close: 19300,
    low: 19200,
    high: 19600,
    volume: 95,
  },
  {
    timestamp: 8,
    open: 19300,
    close: 19200,
    low: 19100,
    high: 19400,
    volume: 80,
  },
  {
    timestamp: 9,
    open: 19200,
    close: 19350,
    low: 19100,
    high: 19400,
    volume: 85,
  },
  {
    timestamp: 10,
    open: 19350,
    close: 19250,
    low: 19200,
    high: 19400,
    volume: 70,
  },
];

interface KLineChartProps {
  data?: KLineData[];
}

const KLineChart: React.FC<KLineChartProps> = ({ data }) => {
  const [cache, setCache] = useState<KLineData[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 700, height: 320 });
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/latest");
        const klineMessage: KlineMessage = await response.json();
        console.log("获取到的新数据:", klineMessage);

        if (klineMessage.data && klineMessage.data.length > 0) {
          // 更新缓存，保留所有历史数据
          setCache((prev) => {
            const newCache = [...prev, ...klineMessage.data];
            // 按时间戳排序
            return newCache.sort((a, b) => a.timestamp - b.timestamp);
          });
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    };

    // 立即获取一次数据
    fetchData();

    // 设置定时器，每60秒获取一次数据
    const intervalId = setInterval(fetchData, 60000);

    // 清理定时器
    return () => clearInterval(intervalId);
  }, []);

  // 响应式canvas尺寸
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = Math.max(220, Math.floor(w * 0.45));
        setCanvasSize({ width: w, height: h });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 绘制K线图
  useEffect(() => {
    const { width, height } = canvasSize;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (!cache.length) return;
    // 计算最大最小
    const max = Math.max(...cache.map((d) => d.high));
    const min = Math.min(...cache.map((d) => d.low));
    const priceRange = max - min;
    // 动态bar宽度
    const barCount = cache.length;
    const barWidth = Math.max(
      MIN_BAR_WIDTH,
      Math.min(
        MAX_BAR_WIDTH,
        (width - PADDING_LEFT - PADDING_RIGHT - (barCount + 1) * BAR_GAP) /
          barCount
      )
    );
    // 画坐标轴
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING_LEFT, PADDING_TOP);
    ctx.lineTo(PADDING_LEFT, height - PADDING_BOTTOM);
    ctx.lineTo(width - PADDING_RIGHT, height - PADDING_BOTTOM);
    ctx.stroke();
    // 画纵轴刻度和label
    ctx.fillStyle = "#aaa";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 5; i++) {
      const price = min + (priceRange * i) / 5;
      const y =
        PADDING_TOP + ((5 - i) / 5) * (height - PADDING_TOP - PADDING_BOTTOM);
      ctx.fillText(price.toFixed(2), PADDING_LEFT - 18, y);
      ctx.strokeStyle = "#eee";
      ctx.beginPath();
      ctx.moveTo(PADDING_LEFT, y);
      ctx.lineTo(width - PADDING_RIGHT, y);
      ctx.stroke();
    }
    // 画横轴刻度和label
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i < barCount; i++) {
      const d = cache[i];
      const x =
        PADDING_LEFT + BAR_GAP + i * (barWidth + BAR_GAP) + barWidth / 2;
      ctx.fillStyle = "#aaa";
      // 格式化时间戳
      const date = new Date(d.timestamp);
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      ctx.fillText(timeStr, x, height - PADDING_BOTTOM + 6);
    }
    // 画K线
    cache.forEach((d, i) => {
      const x = PADDING_LEFT + BAR_GAP + i * (barWidth + BAR_GAP);
      const yOpen =
        PADDING_TOP +
        ((max - d.open) / priceRange) * (height - PADDING_TOP - PADDING_BOTTOM);
      const yClose =
        PADDING_TOP +
        ((max - d.close) / priceRange) *
          (height - PADDING_TOP - PADDING_BOTTOM);
      const yHigh =
        PADDING_TOP +
        ((max - d.high) / priceRange) * (height - PADDING_TOP - PADDING_BOTTOM);
      const yLow =
        PADDING_TOP +
        ((max - d.low) / priceRange) * (height - PADDING_TOP - PADDING_BOTTOM);
      const isUp = d.close >= d.open;
      ctx.strokeStyle = isUp ? "#22c55e" : "#ef4444";
      ctx.fillStyle = isUp ? "#22c55e" : "#ef4444";
      // 影线
      ctx.beginPath();
      ctx.moveTo(x + barWidth / 2, yHigh);
      ctx.lineTo(x + barWidth / 2, yLow);
      ctx.stroke();
      // 实体
      const rectY = Math.min(yOpen, yClose);
      const rectH = Math.abs(yOpen - yClose) || 2;
      ctx.fillRect(x, rectY, barWidth, rectH);
      // 悬浮高亮
      if (hoverIndex === i) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#000";
        ctx.fillRect(
          x - 2,
          PADDING_TOP,
          barWidth + 4,
          height - PADDING_TOP - PADDING_BOTTOM
        );
        ctx.restore();
      }
    });
    // 轴单位
    ctx.save();
    ctx.fillStyle = "#888";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Price", PADDING_LEFT + 4, PADDING_TOP - 18);
    ctx.textAlign = "right";
    ctx.fillText(
      "Timestamp",
      width - PADDING_RIGHT,
      height - PADDING_BOTTOM + 24
    );
    ctx.restore();
  }, [cache, hoverIndex, canvasSize]);

  // 鼠标悬浮事件
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { width } = canvasSize;
    const barCount = cache.length;
    const barWidth = Math.max(
      MIN_BAR_WIDTH,
      Math.min(
        MAX_BAR_WIDTH,
        (width - PADDING_LEFT - PADDING_RIGHT - (barCount + 1) * BAR_GAP) /
          barCount
      )
    );
    for (let i = 0; i < barCount; i++) {
      const bx = PADDING_LEFT + BAR_GAP + i * (barWidth + BAR_GAP);
      if (x >= bx && x <= bx + barWidth) {
        setHoverIndex(i);
        setTooltip({ x, y });
        return;
      }
    }
    setHoverIndex(null);
    setTooltip(null);
  };
  const handleMouseLeave = () => {
    setHoverIndex(null);
    setTooltip(null);
  };

  // 用于后续动态推送数据
  const addKLineData = (newData: KLineData) => {
    setCache((prev) => {
      const arr = [...prev, newData];
      return arr.length > 10 ? arr.slice(arr.length - 10) : arr;
    });
  };

  // 响应式容器
  return (
    <div ref={containerRef} className="w-full h-full min-h-[220px] relative">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          cursor: "pointer",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoverIndex !== null && tooltip && (
        <div
          className="absolute z-10 px-3 py-2 rounded-lg shadow-lg text-xs bg-white/90 text-gray-900 border border-gray-200 pointer-events-none"
          style={{
            left: Math.max(tooltip.x - 60, 8),
            top: Math.max(tooltip.y - 10, 8),
            minWidth: 110,
          }}
        >
          <div>
            Time:{" "}
            <b>
              {new Date(cache[hoverIndex].timestamp).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }
              )}
            </b>
          </div>
          <div>
            Open: <b>{cache[hoverIndex].open}</b>
          </div>
          <div>
            Close: <b>{cache[hoverIndex].close}</b>
          </div>
          <div>
            High: <b>{cache[hoverIndex].high}</b>
          </div>
          <div>
            Low: <b>{cache[hoverIndex].low}</b>
          </div>
          <div>
            Volume: <b>{cache[hoverIndex].volume}</b>
          </div>
        </div>
      )}
    </div>
  );
};

export default KLineChart;

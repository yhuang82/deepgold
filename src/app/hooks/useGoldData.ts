import { useState, useEffect } from "react";

interface GoldData {
  timestamp: number;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export const useGoldData = () => {
  const [goldData, setGoldData] = useState<GoldData[]>([]);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
        const response = await fetch(`${API_BASE}/latest`);
        const klineMessage = await response.json();

        if (klineMessage.data && klineMessage.data.length > 0) {
          const newData = klineMessage.data.map((item: any) => ({
            timestamp: item.timestamp,
            close: item.close,
            open: item.open,
            high: item.high,
            low: item.low,
            volume: item.volume,
          }));

          setGoldData((prevData) => {
            // 合并新数据，保持最近10分钟的数据
            const combinedData = [...prevData, ...newData];
            const tenMinutesAgo = Date.now() - 10 * 60 * 1000;

            // 过滤掉10分钟前的数据
            const recentData = combinedData.filter(
              (data) => data.timestamp >= tenMinutesAgo
            );

            // 按时间戳排序
            return recentData.sort((a, b) => a.timestamp - b.timestamp);
          });

          // 打印最新的数据状态
          console.log("Latest 10 minutes gold data:", goldData);
        }
      } catch (error) {
        console.error("Error fetching gold data:", error);
      }
    };

    // 立即获取一次数据
    fetchLatestData();

    // 每60秒获取一次新数据
    const interval = setInterval(fetchLatestData, 60000);

    return () => clearInterval(interval);
  }, []);

  return goldData;
};

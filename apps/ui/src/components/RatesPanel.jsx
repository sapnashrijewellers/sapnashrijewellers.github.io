import { useData } from "../context/DataContext";
import IndianRupeeRate from "./IndianRupeeRate";

export default function RatesPanel() {
  const { rates } = useData();
  if (!rates) return null;

  const rateItems = [
    { label: "सोना (24K)", value: rates.gold24K * 10 },
    { label: "सोना (22K)", value: rates.gold22K * 10 },
    { label: "चाँदी (99.9)", value: rates.silver * 1000 },
    { label: "चाँदी (जेवर)", value: (rates.silver * 1000) * 0.92 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 w-full bg-gray-900 rounded-2xl">
      <div>
        <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block p-1"></span>&nbsp;
        लाइव रेट * {new Date(rates.asOn).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata"
        })}
      </div>
      {rateItems
        .filter((item) => item.value > 0)
        .map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-3xl border-b border-yellow-700 pb-2"
          >
            <span className="flex items-center gap-2">              
              {item.label}:
            </span>
            <IndianRupeeRate rate={item.value} className="text-green-500" />
          </div>
        ))}

    </div>
  );
}
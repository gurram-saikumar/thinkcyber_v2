import { styles } from "@/app/styles/style";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";

const analyticsData = [
  {
    name: "Page A",
    Count: 4000,
  },
  {
    name: "Page B",
    Count: 3000,
  },
  {
    name: "Page C",
    Count: 5000,
  },
  {
    name: "Page D",
    Count: 1000,
  },
  {
    name: "Page E",
    Count: 4000,
  },
  {
    name: "Page F",
    Count: 800,
  },
  {
    name: "Page G",
    Count: 200,
  },
];

type Props = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({ isDashboard }: Props) {
  const {data, isLoading } = useGetOrdersAnalyticsQuery({});

  const analyticsData: any = [];

  if (data && data.orders && data.orders.last12Months) {
    data.orders.last12Months.forEach((item: any) => {
      // Use month property if available, fallback to name
      const monthName = item.month || item.name || 'Unknown';
      analyticsData.push({ name: monthName, Count: item.count });
    });
  
    // If we have no valid data after processing, add placeholder data
    if (analyticsData.length === 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach(month => {
        analyticsData.push({ name: month, Count: 0 });
      });
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "h-[30vh]" : "h-screen"}>           <div
            className={`w-full ${
              !isDashboard ? "h-[90%]" : "h-full"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={isDashboard ? "100%" : "50%"}
            >
              <LineChart
                width={500}
                height={300}
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}

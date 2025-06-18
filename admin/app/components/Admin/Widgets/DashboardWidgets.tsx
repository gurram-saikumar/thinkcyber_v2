import React, { FC, useEffect, useState } from "react";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiBarChart2, FiUsers } from "react-icons/fi";
import { AiOutlineAreaChart } from "react-icons/ai";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import StatCard from "../Cards/StatCard";
import HighchartsComponent from "../Charts/HighchartsComponent";

type Props = {
  open?: boolean;
  value?: number;
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [userComparePercentage, setuserComparePercentage] = useState<any>();

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading || ordersLoading) {
      return;
    }
    
    try {
      if (data?.users?.last12Months && ordersData?.orders?.last12Months) {
        const usersLastTwoMonths = data.users.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange = usersPreviousMonth !== 0 ?
            ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) *
            100 : 100;

          const ordersPercentChange = ordersPreviousMonth !== 0 ?
            ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) *
            100 : 100;

          setuserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    } catch (error) {
      console.error("Error processing analytics data:", error);
      // Set default values if data processing fails
      setuserComparePercentage({ currentMonth: 0, previousMonth: 0, percentChange: 0 });
      setOrdersComparePercentage({ currentMonth: 0, previousMonth: 0, percentChange: 0 });
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  // Format analytic data for Highcharts
  const userAnalyticsData: { name: string; count: number }[] = [];
  const orderAnalyticsData: { name: string; count: number }[] = [];

  if (data && data.users && data.users.last12Months) {
    data.users.last12Months.forEach((item: { month: string; count: number }) => {
      userAnalyticsData.push({ name: item.month, count: item.count });
    });
  }

  if (ordersData && ordersData.orders && ordersData.orders.last12Months) {
    ordersData.orders.last12Months.forEach((item: { name: string; count: number }) => {
      orderAnalyticsData.push({ name: item.name, count: item.count });
    });
  }

  return (
    <div className="mt-[40px] min-h-screen px-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<HiOutlineShoppingBag />}
          title="Sales Obtained"
          value={ordersComparePercentage?.currentMonth || 0}
          percentChange={ordersComparePercentage?.percentChange || 0}
          color="#3ccba0"
          loading={ordersLoading}
        />
        
        <StatCard 
          icon={<FiUsers />}
          title="New Users"
          value={userComparePercentage?.currentMonth || 0}
          percentChange={userComparePercentage?.percentChange || 0}
          color="#4d62d9"
          loading={isLoading}
        />
        
        <StatCard 
          icon={<FiBarChart2 />}
          title="Total Revenue"
          value={`$${(ordersComparePercentage?.currentMonth || 0) * 29}`}
          percentChange={ordersComparePercentage?.percentChange || 0}
          color="#ff9800"
          loading={ordersLoading}
        />
        
        <StatCard 
          icon={<AiOutlineAreaChart />}
          title="Active Courses"
          value={(userComparePercentage?.currentMonth || 0) / 10 + 5}
          percentChange={10.5}
          color="#e91e63"
          loading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md p-4">
          <HighchartsComponent 
            chartType="area"
            title="User Analytics"
            data={userAnalyticsData.length > 0 ? userAnalyticsData : [
              { name: 'No Data', count: 0 }
            ]}
            yAxisTitle="Number of Users"
            color="#4d62d9"
            height="350px"
          />
        </div>
        
        <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md p-4">
          <HighchartsComponent 
            chartType="column"
            title="Orders Analytics"
            data={orderAnalyticsData.length > 0 ? orderAnalyticsData : [
              { name: 'No Data', count: 0 }
            ]}
            yAxisTitle="Number of Orders"
            color="#3ccba0"
            height="350px"
          />
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="grid grid-cols-1 mb-8">
        <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white text-gray-800">
            Recent Transactions
          </h3>
          <div className="overflow-hidden">
            <AllInvoices isDashboard={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;

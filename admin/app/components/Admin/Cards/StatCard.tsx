"use client";
import React from "react";
import { CircularProgress, CircularProgressProps, Box, Typography } from "@mui/material";
import { useTheme } from "next-themes";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  percentChange?: number;
  color?: string;
  bgColor?: string;
  loading?: boolean;
}

const CircularProgressWithLabel = (
  props: CircularProgressProps & { value: number; color: string }
) => {
  const { theme } = useTheme();
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        size={50}
        thickness={4}
        {...props}
        sx={{ 
          color: props.color || "#4d62d9",
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ 
            fontSize: "0.8rem", 
            fontWeight: "medium", 
            color: theme === "dark" ? "#fff" : "#111"
          }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  percentChange = 0,
  color = "#4d62d9",
  bgColor,
  loading = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
    // Calculate progress value - cap at 100% for positive and 0% for negative
  // Also cap the actual display value to be reasonable (max +/- 100%)
  const progressValue = percentChange > 0 ? 
    Math.min(percentChange, 100) : 
    Math.max(0, 100 + percentChange);
  
  // Limit the displayed percentage change to a reasonable range (-100% to +100%)
  const displayPercentChange = Math.max(-100, Math.min(100, percentChange));

  return (
    <div 
      className={`p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
        bgColor ? bgColor : isDark ? "bg-[#111C43]" : "bg-white"
      }`}
    >      <div className="flex items-center justify-between">
        <div>
          <div className={`text-[30px] ${isDark ? "text-[#45CBA0]" : ""}`} style={{ color }}>
            {icon}
          </div>
          <h3 className={`text-2xl font-semibold mt-4 ${isDark ? "text-white" : "text-gray-800"}`}>
            {loading ? (
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </h3>
          <p className={`mt-2 ${isDark ? "text-[#45CBA0]" : "text-gray-600"}`} style={{ color }}>
            {title}
          </p>
        </div>
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          ) : (
            <CircularProgressWithLabel 
              value={progressValue} 
              color={percentChange >= 0 ? "success" : "error"} 
            />
          )}          {loading ? (
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          ) : (
            <p 
              className={`text-sm mt-2 ${
                percentChange >= 0 ? "text-[#3ccba0]" : "text-[#ff5252]"
              }`}
            >
              {`${displayPercentChange >= 0 ? "+" : ""}${displayPercentChange.toFixed(1)}%`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

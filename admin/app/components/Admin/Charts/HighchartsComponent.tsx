"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "next-themes";

// We'll handle Highcharts modules in a client-side only way
interface HighchartsComponentProps {
  chartType: "line" | "spline" | "area" | "areaspline" | "column" | "bar" | "pie";
  title: string;
  data: any[] | undefined;
  categories?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  seriesName?: string;
  color?: string;
  height?: string;
}

const HighchartsComponent: React.FC<HighchartsComponentProps> = ({
  chartType,
  title,
  data,
  categories,
  xAxisTitle,
  yAxisTitle,
  seriesName = "Count",
  color = "#4d62d9",
  height = "400px",
}) => {
  const { theme } = useTheme();
  const [chartReady, setChartReady] = useState(false);
  
  // Initialize Highcharts modules only in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically load Highcharts modules
      const loadModules = async () => {
        try {
          // Using a more reliable method to load modules
          await import('highcharts/modules/exporting').then(module => {
            if (module && typeof module.default === 'function') {
              module.default(Highcharts);
            }
          });
          
          await import('highcharts/modules/export-data').then(module => {
            if (module && typeof module.default === 'function') {
              module.default(Highcharts);
            }
          });
          
          setChartReady(true);
        } catch (error) {
          console.error("Failed to load Highcharts modules:", error);
          // Still set ready to true so component renders without modules
          setChartReady(true);
        }
      };
      
      loadModules();
    }
  }, []);  const isDark = theme === "dark";
  // Safety check to ensure data has required properties
  const isValidData = (data || []).every(item => 
    (typeof item === 'object' && item !== null && 
     (('name' in item && ('count' in item || 'Count' in item)) || 
      ('month' in item && 'count' in item)))
  );
    // Format data for Highcharts based on chart type
  const formattedData = !data || data.length === 0 || !isValidData ? [0] : 
    chartType === "pie" 
      ? data.map(item => ({ 
          name: typeof item.name === 'string' ? item.name : 'Unknown', 
          y: typeof item.count === 'number' ? item.count : 0 
        }))
      : data.map(item => {
          if (typeof item.count === 'number') return item.count;
          if (typeof item.Count === 'number') return item.Count;
          return 0;
        });

  // Create chart options only if we have valid data
  const chartOptions: Highcharts.Options = {
    chart: {
      type: chartType,
      backgroundColor: isDark ? "#111C43" : "#ffffff",
      height: height,
      style: {
        fontFamily: "Poppins, sans-serif",
      },
    },
    title: {
      text: title,
      style: {
        color: isDark ? "#ffffff" : "#000000",
        fontWeight: "500",
      },
    },
    credits: {
      enabled: false,
    },    xAxis: {
      categories: categories || (!data || data.length === 0 || !isValidData 
        ? ['No Data'] 
        : data.map(item => item.name || item.month || 'Unknown')),
      title: {
        text: xAxisTitle,
        style: {
          color: isDark ? "#ffffffc1" : "#000000",
        },
      },
      labels: {
        style: {
          color: isDark ? "#ffffffc1" : "#000000",
        },
      },
      lineColor: isDark ? "#2d3a4e" : "#e6e6e6",
      tickColor: isDark ? "#2d3a4e" : "#e6e6e6",
    },
    yAxis: {
      title: {
        text: yAxisTitle,
        style: {
          color: isDark ? "#ffffffc1" : "#000000",
        },
      },
      labels: {
        style: {
          color: isDark ? "#ffffffc1" : "#000000",
        },
      },
      gridLineColor: isDark ? "#2d3a4e" : "#e6e6e6",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 4,
        },
      },
      area: {
        fillOpacity: 0.2,
      },
      areaspline: {
        fillOpacity: 0.2,
      },
    },    legend: {
      itemStyle: {
        color: isDark ? "#ffffffc1" : "#000000",
      },
      itemHoverStyle: {
        color: isDark ? "#ffffff" : "#333333",
      },
    },
    series: [
      {
        name: seriesName,
        data: formattedData.length > 0 ? formattedData : [0], // Fallback to prevent errors
        type: chartType,
        color: color,
      },
    ],
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"],
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },  };
    // Check if we have valid data to display
  const hasValidData = chartReady && data && data.length > 0 && isValidData;
    return (
    <div className="highcharts-container rounded-md overflow-hidden">
      {hasValidData ? (
        <div className="relative">
          {(() => {
            try {
              return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
            } catch (error) {
              console.error("Error rendering Highcharts:", error);
              return (
                <div className="flex justify-center items-center h-[350px] text-red-500">
                  Chart rendering error. Please try again later.
                </div>
              );
            }
          })()}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[350px] text-gray-500">
          {chartReady ? "No data available" : "Loading chart..."}
        </div>
      )}
    </div>
  );
};

export default HighchartsComponent;

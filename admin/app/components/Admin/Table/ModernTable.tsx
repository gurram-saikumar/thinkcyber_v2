"use client";
import React from "react";
import { 
  Box, 
  useTheme as useMuiTheme, 
  Theme,
  alpha,
  darken,
  lighten
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, gridClasses } from "@mui/x-data-grid";
import { useTheme } from "next-themes";

interface ModernTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  isDashboard?: boolean;
  enableSelection?: boolean;
  enableToolbar?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  height?: string;
}

const ModernTable: React.FC<ModernTableProps> = ({
  rows,
  columns,
  loading = false,
  isDashboard = false,
  enableSelection = false,
  enableToolbar = true,
  enablePagination = true,
  pageSize = 10,
  height = "70vh"
}) => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isDark = theme === "dark";

  // Function to get better contrast colors for the table
  const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

  const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

  // Custom styles for the data grid
  const tableStyles = {
    "& .MuiDataGrid-root": {
      border: "none",
      borderRadius: "8px",
      boxShadow: isDark 
        ? "0 4px 12px 0 rgba(0,0,0,0.25)" 
        : "0 4px 12px 0 rgba(0,0,0,0.05)",
    },
    "& .MuiDataGrid-iconSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-columnHeader": {
      padding: "12px",
      fontWeight: "600",
      fontSize: "14px",
    },
    "& .MuiDataGrid-cell": {
      padding: "12px",
      fontSize: "14px",
      borderBottom: isDark 
        ? "1px solid rgba(255,255,255,0.1)" 
        : "1px solid rgba(0,0,0,0.05)",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: isDark 
        ? alpha(muiTheme.palette.primary.main, 0.15) 
        : alpha(muiTheme.palette.primary.main, 0.05),
      borderRadius: "8px 8px 0 0",
      color: isDark ? "#fff" : muiTheme.palette.primary.main,
      borderBottom: "none",
      "& .MuiDataGrid-columnSeparator": {
        color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      },
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: isDark ? "#111C43" : "#fff",
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: isDark 
        ? alpha(muiTheme.palette.primary.main, 0.15) 
        : alpha(muiTheme.palette.primary.main, 0.05),
      borderRadius: "0 0 8px 8px",
      color: isDark ? "#fff" : muiTheme.palette.primary.main,
      borderTop: "none",
    },
    "& .MuiDataGrid-toolbarContainer": {
      padding: "12px",
      backgroundColor: isDark ? "#111C43" : "#fff",
      borderRadius: "8px 8px 0 0",
      "& .MuiButton-root": {
        color: isDark ? "#fff" : muiTheme.palette.primary.main,
      },
    },
    "& .MuiDataGrid-row": {
      color: isDark ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: isDark 
          ? "rgba(255,255,255,0.05)" 
          : "rgba(0,0,0,0.02)",
      },
      "&.Mui-selected": {
        backgroundColor: isDark 
          ? alpha(muiTheme.palette.primary.main, 0.2) 
          : alpha(muiTheme.palette.primary.main, 0.1),
        "&:hover": {
          backgroundColor: isDark 
            ? alpha(muiTheme.palette.primary.main, 0.25) 
            : alpha(muiTheme.palette.primary.main, 0.15),
        },
      },
    },
    // Zebra striping for better readability
    [`& .${gridClasses.row}.odd`]: {
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      "&:hover": {
        backgroundColor: isDark 
          ? "rgba(255,255,255,0.07)" 
          : "rgba(0,0,0,0.04)",
      },
    },
    // Better pagination controls
    "& .MuiTablePagination-root": {
      color: isDark ? "#fff" : "#000",
      "& .MuiIconButton-root": {
        color: isDark ? "#fff" : muiTheme.palette.primary.main,
      },
      "& .MuiTablePagination-selectIcon": {
        color: isDark ? "#fff" : muiTheme.palette.primary.main,
      },
    },
    // Better checkbox styling
    "& .MuiCheckbox-root": {
      color: isDark 
        ? alpha(muiTheme.palette.primary.main, 0.7) 
        : muiTheme.palette.primary.main,
    },
  };

  return (
    <Box
      height={isDashboard ? "35vh" : height}
      width="100%"
      sx={tableStyles}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        getRowClassName={(params) => 
          params.indexRelativeToCurrentPage % 2 === 0 ? "" : "odd"
        }
        initialState={{
          pagination: { 
            paginationModel: { pageSize: pageSize } 
          },
        }}
        pageSizeOptions={enablePagination ? [5, 10, 25, 50] : [pageSize]}
        paginationMode={enablePagination ? "client" : "server"}
        disableColumnFilter={isDashboard}
        disableColumnSelector={isDashboard}
        disableDensitySelector={isDashboard}
        slots={{
          toolbar: enableToolbar && !isDashboard ? GridToolbar : undefined,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        checkboxSelection={enableSelection && !isDashboard}
        density="standard"
      />
    </Box>
  );
};

export default ModernTable;

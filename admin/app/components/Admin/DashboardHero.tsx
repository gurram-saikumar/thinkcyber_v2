import React, { useState } from "react";
import DashboardWidgets from "../../components/Admin/Widgets/DashboardWidgets";

type Props = {
  isDashboard?: boolean;
};

const DashboardHero = ({isDashboard}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {isDashboard && (
        <DashboardWidgets open={open} />
      )}
    </div>
  );
};

export default DashboardHero;

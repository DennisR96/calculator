import React from "react";
import Switch from "@/components/ui/switch";

export const Test = ({ row, updateRow }) => {
  const formatHandle = (str) => {
    if (!str) return "";
    return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const title = formatHandle(row.handle_name) || row.name;

  return (
    <div className="w-full space-y-2 pt-4 nodrag nopan">
      <div className="space-y-1">
        {title && <h3 className="text-sm font-bold text-gray-900">{title}</h3>}
        {row.description && <p className="text-sm text-gray-500">{row.description}</p>}
      </div>
      <div className="flex items-center">
        <Switch
          checked={row.value || false}
          setChecked={(checked) => {
            const newRow = { ...row, value: checked };
            updateRow(newRow);
          }}
          title=""
        />
      </div>
    </div>
  );
};


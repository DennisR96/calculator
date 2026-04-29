import Input from "@/components/ui/input";

const ExampleInput = ({ row, updateRow }) => {
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
      <Input
        value={row.value || ""}
        type="number"
        onChange={(e) => {
          const newRow = { ...row };
          newRow.value = parseFloat(e.target.value);
          updateRow(newRow);
        }}
      />
    </div>
  );
};

export default ExampleInput;

export const ExampleNumber = ({ row, updateNodeData }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-xl shadow-sm min-w-[12rem]">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {row.handle_name}
      </span>
      <div className="text-6xl font-extrabold tracking-tighter text-slate-900">
        {row.value}
      </div>
      <div className="mt-4 h-1 w-12 bg-primary rounded-full" />
    </div>
  );
};


export const StatBox = ({ value, label, color }) => {
  return (
    <div
      className={`flex flex-col items-center p-2 rounded-lg 
                        bg-${color} bg-opacity-10 
                        text-${color}`}
    >
      <span className="text-lg font-semibold">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
};

export default function MapLegend() {
    const items = [
      { color: "bg-[#BA6D58]", label: "High Health Risk Areas" },
      { color: "bg-[#386c80ff]", label: "Little or No Health Risk Areas" },
      { color: "bg-[#5A5A5A]", label: "Not covered yet" },
    ];
    return (
      <div className="absolute z-[1150] bottom-6 left-6  p-4 rounded-2xl backdrop-blur-md shadow-lg w-70 ">
        <h3 className="font-semibold mb-3">Key</h3>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-md ${item.color}`}></span>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
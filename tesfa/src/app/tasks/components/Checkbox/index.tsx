import React from "react";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange}: CheckboxProps) {
  return (
    <label className={`inline-flex items-center cursor-pointer`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onCheckedChange(e.target.checked)}
        className="hidden"
      />
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 100,
          backgroundColor: checked ? "#D3AC45" : "#D1D5DB", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </label>
  );
}

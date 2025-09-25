"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
export default function CalendarPicker({ onDateChange }: { onDateChange: (date: Date) => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  return (
    <div className="top-4 flex items-center gap-2">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => {
          if (date) {
            setSelectedDate(date);
            onDateChange(date);
          }
        }}
        dateFormat="dd/MM/yyyy"
            customInput={
        <button className="p-2 rounded-md hover:bg-gray-100">
          <FaRegCalendarAlt className="text-2xl text-gray-700" />
        </button>
      }
      />
    </div>
  );
}

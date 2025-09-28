"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

type DateRange = [Date | null, Date | null];

export default function CalendarPicker({
  onDateChange,
}: {
  onDateChange: (range: DateRange) => void;
}) {
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="absolute top-5 right-8 bg-yellow-400  rounded-b-full">
      <DatePicker
        selected={startDate}
        onChange={(dates: DateRange) => {
          setDateRange(dates);
          onDateChange(dates); // Pass [start, end] to parent
        }}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        dateFormat="dd/MM/yyyy"
        popperPlacement="bottom-end" 
        customInput={
          <button className="p-2 rounded-b-full hover:bg-yellow-500 cursor-pointer">
            <FaRegCalendarAlt className="text-2xl text-gray-700" />
          </button>
        }
        placeholderText="Select date range"
      />
    </div>
  );
}
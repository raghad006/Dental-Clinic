import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const CalendarDropdown = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const parsedDate =
    selectedDate instanceof Date
      ? selectedDate
      : selectedDate
      ? (() => {
          const [y, m, d] = selectedDate.split("-").map(Number);
          return new Date(y, m - 1, d); 
        })()
      : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelect = (date) => {
    if (!date) return;
    // format as YYYY-MM-DD string
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
    onDateChange(localDate);
    setOpen(false);
  };

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const isSelected = (date) => {
    if (!parsedDate || !date) return false;
    return (
      date.getFullYear() === parsedDate.getFullYear() &&
      date.getMonth() === parsedDate.getMonth() &&
      date.getDate() === parsedDate.getDate()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="relative w-72" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full bg-white rounded-2xl shadow-sm px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-all"
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="text-blue-500" size={18} />
          <span className="text-sm font-medium">
            {parsedDate
              ? parsedDate.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Select a date"}
          </span>
        </div>
        <ChevronRight
          className={`text-gray-500 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
          size={18}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-semibold text-gray-800">
              {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {generateDays().map((date, idx) => {
              const selected = isSelected(date);
              const today = isToday(date);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(date)}
                  disabled={!date}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-200
                    ${
                      !date
                        ? "bg-transparent cursor-default"
                        : selected
                        ? "bg-blue-500 text-white shadow-sm"
                        : today
                        ? "border border-blue-400 text-blue-600 font-semibold"
                        : "hover:bg-gray-100 active:bg-gray-200 text-gray-700"
                    }`}
                >
                  {date?.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDropdown;

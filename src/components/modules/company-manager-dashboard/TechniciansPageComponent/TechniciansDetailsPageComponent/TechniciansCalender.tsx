'use client'
import { useState } from 'react';

function TechniciansCalender() {
   const now = new Date();
     const [currentMonth, setCurrentMonth] = useState(now.getMonth());
     const [currentYear, setCurrentYear] = useState(now.getFullYear());
   
     // সিলেক্টেড তারিখের স্টেট
     const [selectedDate, setSelectedDate] = useState<Date>(now);
   
     const monthNames = [
       "January",
       "February",
       "March",
       "April",
       "May",
       "June",
       "July",
       "August",
       "September",
       "October",
       "November",
       "December",
     ];
   
     const goToPreviousMonth = () => {
       setCurrentMonth((prev) => {
         if (prev === 0) {
           setCurrentYear((y) => y - 1);
           return 11;
         }
         return prev - 1;
       });
     };
   
     const goToNextMonth = () => {
       setCurrentMonth((prev) => {
         if (prev === 11) {
           setCurrentYear((y) => y + 1);
           return 0;
         }
         return prev + 1;
       });
     };
   
     const getDaysInMonth = (year: number, month: number): number => {
       return new Date(year, month + 1, 0).getDate();
     };
   
     const getStartDayOfMonth = (year: number, month: number): number => {
       return new Date(year, month, 1).getDay();
     };
   
     const getCalendarGrid = (year: number, month: number) => {
       const daysInCurrentMonth = getDaysInMonth(year, month);
       const startDay = getStartDayOfMonth(year, month);
   
       const prevMonth = month === 0 ? 11 : month - 1;
       const prevYear = month === 0 ? year - 1 : year;
       const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
   
       const prevMonthDays = Array.from({ length: startDay }, (_, i) => ({
         day: daysInPrevMonth - startDay + 1 + i,
         current: false,
         year: prevYear,
         month: prevMonth,
       }));
   
       const currentMonthDays = Array.from(
         { length: daysInCurrentMonth },
         (_, i) => ({
           day: i + 1,
           current: true,
           year,
           month,
         })
       );
   
       const totalCells =
         Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7;
       const nextMonthDays = Array.from(
         { length: totalCells - prevMonthDays.length - currentMonthDays.length },
         (_, i) => ({
           day: i + 1,
           current: false,
           year: month === 11 ? year + 1 : year,
           month: month === 11 ? 0 : month + 1,
         })
       );
   
       return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
     };
   
     const calendarDays = getCalendarGrid(currentYear, currentMonth);
   
     // Header-এ দেখানোর জন্য সিলেক্টেড তারিখ ফরম্যাট
     const selectedDateString = selectedDate.toLocaleDateString(undefined, {
       weekday: "long",
       year: "numeric",
       month: "long",
       day: "numeric",
     });
    //  console.log(calendarDays)
     const selectedTimeString = selectedDate.toLocaleTimeString();
     return (
       <div className="p-5 space-y-5">
         <h1 className="font-bold">Technician Calendar</h1>
   
         <div className="p-5 bg-gray-100 rounded">
           {/* Header */}
           <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
             <div className="flex items-center gap-5">
               <button
                 className="py-1 px-5 border rounded-lg bg-white shadow"
                 onClick={() => {
                   const now = new Date();
                   setCurrentMonth(now.getMonth());
                   setCurrentYear(now.getFullYear());
                   setSelectedDate(now);
                 }}
               >
                 Today
               </button>
               <h1 className="font-semibold">
                 {monthNames[currentMonth]?.slice(0, 3)} {currentYear}
               </h1>
               <div className="flex gap-2">
                 <button
                   className="px-3 py-1 border rounded"
                   onClick={goToPreviousMonth}
                 >
                   {"<"}
                 </button>
                 <button
                   className="px-3 py-1 border rounded"
                   onClick={goToNextMonth}
                 >
                   {">"}
                 </button>
               </div>
             </div>
             <div>
               <p className="text-sm text-gray-600 whitespace-nowrap">
                 {selectedDateString}
               </p>
             </div>
           </div>
   
           {/* Calendar Grid */}
           <div className="grid grid-cols-7 gap-2 text-center">
             {calendarDays.map((item, index) => {
               const isSelected =
                 item.day === selectedDate.getDate() &&
                 item.month === selectedDate.getMonth() &&
                 item.year === selectedDate.getFullYear();
   
               return (
                 <div
                   key={index}
                   onClick={() => {
                     setSelectedDate(new Date(item.year, item.month, item.day));
                     setCurrentMonth(item.month);
                     setCurrentYear(item.year);
                   }}
                   className={`py-3 rounded border w-full h-24 flex justify-center items-center cursor-pointer ${
                     item.current
                       ? isSelected
                         ? "bg-green-500 text-white font-bold"
                         : "bg-white hover:bg-blue-100 font-semibold"
                       : "bg-gray-100 text-gray-400"
                   }`}
                 >
                   <div
                     className={`h-10 w-10 rounded-full flex items-center justify-center ${
                       isSelected
                         ? "bg-white text-green-600 border-2 border-green-600 font-bold"
                         : "border border-green-400"
                     }`}
                   >
                     {item.day}
                   </div>
                 </div>
               );
             })}
           </div>
         </div>
       </div>
     );
   }
   
export default TechniciansCalender;
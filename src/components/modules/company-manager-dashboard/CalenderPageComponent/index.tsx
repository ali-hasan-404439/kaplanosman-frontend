"use client";

import { Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AddJobNoteMeeting from "./AddJobNoteMeeting";
import TimeCalendar from "./TimeCalendar";
import { Input, Select } from "antd";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetCalenderAllJobsQuery,
  useGetCalenderAllMeetingQuery,
  useGetCalenderAllNotesQuery,
  useGetCalenderAllTechniciansQuery,
} from "@/redux/features/calendar/calendarApi";

import dayjs from "dayjs";
import "dayjs/locale/en";
import moment from "moment";

interface Technician {
  id: string;
  name: string;
  color: string;
}
export interface Note {
  id: string;
  title: string;
  notes: string;
  date: string; // ISO date string
  status: string; // example: "COMPLETED"
  timeFrame: string; // formatted date range as string
  createdAt: string; // ISO date string
  technician: {
    id: string;
    name: string;
  };
}
export type Meeting = {
  id: string;
  title: string;
  timeFrame: string; // যেমন: "1 Pm-2 Pm"
  status: string; // যেমন: "UPCOMING"
  date: string; // ISO date string
  createdAt: string; // ISO date string
  technician: {
    name: string;
  };
};
export interface Jobs {
  id: string;
  date: string; // ISO date string (e.g., "2025-06-28T18:00:00.000Z")
  orderStatus: string; // e.g., "WARRANTY_CLAIM"
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  createdAt: string; // ISO date string
  technician: {
    name: string;
  };
}

function CalenderPageComponent() {
  const user = useAppSelector(selectCurrentUser);

  const [allTechnician, setAllTechnician] = useState<Technician[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);
  const [allJobs, setAllJobs] = useState<Jobs[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [filterValue, setFilterValue] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [activeCheckbox, setActiveCheckbox] = useState<string | number>(
    "All Notes & Meetings"
  );
  const handleChange = (value: "daily" | "weekly" | "monthly") =>
    setFilterValue(value);

  const handleCheckboxChange = (label: string | number) => {
    if (
      label !== "All Notes & Meetings" &&
      label !== "All Jobs" &&
      label !== "All Technicians"
    ) {
      setSelectedTechnician(label as string);
      setActiveCheckbox(label);
    } else {
      setActiveCheckbox(label);
    }
  };
  const navigateDate = (direction: "prev" | "next") => {
    const amount = filterValue === "weekly" ? 7 : 1;
    const unit = filterValue === "monthly" ? "month" : "day";
    setCurrentDate(
      currentDate.add(direction === "prev" ? -amount : amount, unit)
    );
  };
  const rightSiteMenubar = [
    { id: 1, label: "All Notes & Meetings" },
    { id: 2, label: "All Jobs" },
    {
      id: 3,
      label: "All Technicians",
      techniciansList: allTechnician,
    },
  ];

  // ✅ Check if selected item is a technician
  const isTechnicianSelected = rightSiteMenubar
    ?.find((item) => item.label === "All Technicians")
    ?.techniciansList?.some((tech) => tech?.id === activeCheckbox);

  const { data: technicians, } = useGetCalenderAllTechniciansQuery(
    {
      companyId: user?.companyId || "",
      page: 1,
      limit: 3000,
    },
    {
      skip: !user?.companyId,
    }
  );
const filter = useMemo(() => {
  return [
    { name: "technicianId", value: selectedTechnician },
    { name: "page", value: 1 },
    { name: "limit", value: 1000 },
    { name: "dateFilter", value: filterValue === "daily" ? "" : filterValue },
    { name: "month", value: currentDate.format('MM') },
    { name: "year", value: currentDate.format('YYYY') },
    { name: "timestamp", value: currentDate.valueOf() }, // ✅ extra force update
  ];
}, [selectedTechnician, filterValue, currentDate]);


// Now call hooks
const { data: notes } = useGetCalenderAllNotesQuery(filter);
const { data: meeting } = useGetCalenderAllMeetingQuery(filter);
const { data: jobs } = useGetCalenderAllJobsQuery(filter);

  const normalizeTime = (time: string) => {
    return time
      ?.toUpperCase()
      ?.replace(/\s+/g, "")
      ?.replace(/^(\d{1,2})(AM|PM)$/, "$1 $2");
  };

  useEffect(() => {
    if (technicians?.success) {
      setAllTechnician(technicians?.data?.data);
    }

    if (notes?.success) {
      const formeNotes = notes?.data?.data?.map((item: Note) => {
        const rawTime = item?.timeFrame.split("-")[0].trim();
        const normalizedTime = normalizeTime(rawTime);
        const formattedTime = moment(normalizedTime, "h A").format("h A"); // ✅ 12-hour

        return {
          id: item?.id,
          title: item?.title,
          date: dayjs(item?.createdAt).format("YYYY-MM-DD"),
          time: formattedTime,
          description: item?.notes,
          type: "notes",
          status: item?.status,
          technicians: {
            id: item?.technician?.id,
            name: item?.technician?.name,
          },
        };
      });
      setAllNotes(formeNotes);
    }
    if (meeting?.success) {
      const formattedMeetings = meeting?.data?.data?.map((item: Meeting) => {
        const rawTime = item?.timeFrame?.split("-")[0].trim();
        const normalizedTime = normalizeTime(rawTime);
        const formattedTime = moment(normalizedTime, "h A").format("h A");
        return {
          id: item?.id,
          title: item?.title,
          date: dayjs(item?.createdAt).format("YYYY-MM-DD"),
          time: formattedTime,
          description: "",
          type: "meeting",
          status: item.status,
          technicians: {
            name: item.technician.name,
          },
          startData: item?.timeFrame,
        };
      });
      setAllMeetings(formattedMeetings);
    }
    if (jobs?.success) {
      const formattedMeetings = jobs?.data?.data?.map((item: Jobs) => {
        const rawTime = item?.startTime?.split("-")[0].trim();
        const normalizedTime = normalizeTime(rawTime);
        const formattedTime = moment(normalizedTime, "h A").format("h A");
        return {
          id: item?.id,
          title: "",
          date: dayjs(item?.createdAt).format("YYYY-MM-DD"),
          time: formattedTime,
          description: "",
          type: "job",
          status: item.orderStatus,
          technicians: {
            name: item.technician.name,
          },
        };
      });
      setAllJobs(formattedMeetings);
    }
  }, [technicians, notes, meeting, jobs]);

  console.log(currentDate)
  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="border rounded-full w-[118px] h-[40px] flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-gray-100 transition">
            Today
          </h3>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <Select
          value={filterValue}
          style={{ width: 100 }}
          className="h-[42px]"
          onChange={handleChange}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />
      </div>

      {/* Main Section */}
      <div className="p-4 rounded bg-gray-50 flex gap-5">
        {/* Left Sidebar */}
        <div className="w-[300px] space-y-5">
          <AddJobNoteMeeting />

          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-[20px] font-semibold mb-3">
              All Employ Calendar
            </h3>

            {/* Sidebar Items */}
            <div className="space-y-2">
              {rightSiteMenubar.map((item) => {
                const isActive =
                  activeCheckbox === item.label ||
                  (item.label === "All Technicians" && isTechnicianSelected);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded cursor-pointer"
                    onClick={() => handleCheckboxChange(item.label)}
                  >
                    <input
                      type="checkbox"
                      className="accent-black w-6 h-6 rounded-lg"
                      checked={isActive}
                      onChange={() => handleCheckboxChange(item.label)}
                    />
                    <label
                      className={`text-sm font-medium px-2 py-2 w-full rounded-md ${
                        isActive ? "bg-black text-white" : ""
                      }`}
                    >
                      {item.label}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Technicians */}
            <div className="mt-4 mb-5 space-y-1">
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-2">Technicians</h4>
                {/* <Input
                  placeholder="Search technicians name"
                  className="h-10"
                  onChange={(e) => setSearchTechnician(e.target.value)}
                /> */}
              </div>
              {rightSiteMenubar
                .find((item) => item.label === "All Technicians")
                ?.techniciansList?.map((tech) => {
                  const isActive = activeCheckbox === tech?.id;

                  return (
                    <div
                      key={tech?.id}
                      className="flex items-center gap-2 rounded cursor-pointer"
                      onClick={() => handleCheckboxChange(tech?.id)}
                    >
                      <input
                        type="checkbox"
                        className="w-6 h-6 rounded-lg"
                        style={{ accentColor: tech?.color }}
                        checked={true}
                        onChange={() => handleCheckboxChange(tech?.id)}
                      />
                      <label
                        className={`text-sm font-medium px-2 py-2 w-full rounded-md ${
                          isActive ? "text-white" : ""
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? tech?.color
                            : "transparent",
                        }}
                      >
                        {tech?.name}
                      </label>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <TimeCalendar
          filterValue={filterValue}
          activeCheckbox={activeCheckbox}
          currentDate={currentDate}
          navigateDate={navigateDate}
          allNotes={allNotes}
          allJobs={allJobs}
          allMeetings={allMeetings}
        />
      </div>
    </section>
  );
}

export default CalenderPageComponent;

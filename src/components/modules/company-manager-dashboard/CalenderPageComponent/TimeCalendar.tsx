import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import { AlignRight } from "lucide-react";
import { Jobs, Meeting, Note } from ".";
import {
  useDeleteCalenderNotesMutation,
  useUpdatedCalenderMeetingStatusMutation,
  useUpdatedCalenderNotesStatusMutation,
} from "@/redux/features/calendar/calendarApi";
import { toast } from "sonner";

interface TimeCalendarProps {
  filterValue: "daily" | "weekly" | "monthly";
  activeCheckbox: string | number;
  currentDate: dayjs.Dayjs;
  navigateDate: (direction: "prev" | "next") => void;
  allNotes: Note[];
  allJobs: Jobs[];
  allMeetings: Meeting[];
}

const TimeCalendar: React.FC<TimeCalendarProps> = ({
  filterValue,
  activeCheckbox,
  allNotes,
  allJobs,
  allMeetings,
  currentDate,
  navigateDate,
}) => {
  const [meetings, setMeetings] = useState<any[]>([]);

  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [showNotesData, setShowNotesData] = useState<any>("");

  const [showMeetings, setShowMeetings] = useState<boolean>(false);
  const [selectMeetings, setSelectMeetings] = useState<any[]>([]);

  const [meetingStatus, setMeetingStatus] = useState<{
    id: string;
    type: string;
    status: string;
  } | null>(null);
  const [showMeetingsStatus, setShowMeetingsStatus] = useState<boolean>(false);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const period = i < 12 ? "AM" : "PM";
    return `${hour} ${period}`;
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentDate.startOf("week").add(i, "day")
  );
  const startOfMonth = currentDate.startOf("month");

  useEffect(() => {
    const safeNotes = allNotes || [];
    const safeMeetings = allMeetings || [];
    const safeJobs = allJobs || [];

    if (
      activeCheckbox !== "All Notes & Meetings" &&
      activeCheckbox !== "All Jobs" &&
      activeCheckbox !== "All Technicians"
    ) {
      const allData = [...safeNotes, ...safeMeetings, ...safeJobs];
      setMeetings(allData);
    } else if (activeCheckbox === "All Jobs") {
      setMeetings(safeJobs);
    } else {
      const notesAndMeetings = [...safeNotes, ...safeMeetings];
      setMeetings(notesAndMeetings);
    }
  }, [activeCheckbox, allNotes, allJobs, allMeetings]);
  const getEventColor = (type: string) => {
    switch (type) {
      case "notes":
        return "bg-yellow-400";
      case "meeting":
        return "bg-green-500";
      case "job":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getEventDisplayText = (event: any) => {
    if (event.type === "notes")
      return (
        <div className="flex items-center justify-center flex-col gap-2">
          <h1>Notes</h1>
          <p className="border rounded-lg bg-white text-green-500 px-2 py-0.5 text-[10px]">
            {event.status?.split("_").join(" ")}
          </p>
        </div>
      );
    if (event.type === "meeting")
      return (
        <div className="flex items-center justify-center flex-col gap-2">
          <h1>Meeting</h1>
          <p className="border rounded-lg bg-white text-green-500 px-2 py-0.5 text-[10px]">
            {event.status?.split("_").join(" ")}
          </p>
        </div>
      );
    if (event.type === "job")
      return (
        <div className="flex items-center justify-center flex-col gap-2">
          <h1>Job</h1>
          <p className="border rounded-lg bg-white text-green-500 px-2 py-0.5 text-[10px]">
            {event.status?.split("_").join(" ")}
          </p>
        </div>
      );
    return "Event";
  };

  const [updatedCalenderMeetingStatus] =
    useUpdatedCalenderMeetingStatusMutation();
  const [updatedCalenderNotesStatus] = useUpdatedCalenderNotesStatusMutation();
  const [deleteCalenderNotes] = useDeleteCalenderNotesMutation();

  const handleMeetingChangeStatus = async ({
    id,
    type,
    status,
  }: {
    id: string;
    type: string;
    status: string;
  }) => {
    try {
      const data = {
        id: id,
        formData: {
          status: type,
        },
      };

      const response =
        status === "notes"
          ? type === "delete"
            ? await deleteCalenderNotes(id)
            : await updatedCalenderNotesStatus(data).unwrap()
          : await updatedCalenderMeetingStatus(data).unwrap();
      if (type === "delete") {
        if (response?.data?.success) {
          setShowMeetingsStatus(false);
          setMeetingStatus(null);
          setShowNotes(false);
          setShowNotesData("");
          toast.success(response?.data?.message || `Notes delete successful.`);
        }
      } else {
        if (response.success) {
          setShowMeetingsStatus(false);
          setMeetingStatus(null);
          setShowNotes(false);
          setShowNotesData("");
          toast.success(
            response.message ||
              response?.data?.message ||
              `Meeting ${id} status changed to ${type}`
          );
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change meeting status");
    }
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button icon={<LeftOutlined />} onClick={() => navigateDate("prev")} />
        <div className="text-lg font-semibold">
          {filterValue === "monthly"
            ? currentDate.format("MMMM YYYY")
            : currentDate.format("dddd, MMMM D")}
        </div>
        <Button icon={<RightOutlined />} onClick={() => navigateDate("next")} />
      </div>

      {/* DAILY VIEW */}
      {filterValue === "daily" && (
        <div className="daily-view flex">
          <div className="time-column w-16">
            {timeSlots.map((time, index) => (
              <div
                key={index}
                className="h-16 flex items-center justify-end pr-2 text-sm"
              >
                {time}
              </div>
            ))}
          </div>
          <div className="content-column flex-1 border-l">
            {timeSlots.map((time, index) => {
              const today = currentDate.format("YYYY-MM-DD");
              const slotMeetings = meetings.filter(
                (m) => m.date === today && m.time === time
              );
              return (
                <div
                  key={index}
                  className="h-16 border-b relative group flex items-center flex-wrap overflow-y-auto gap-2"
                >
                  {slotMeetings?.map((slot, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (
                          activeCheckbox !== "All Jobs" &&
                          slot?.type !== "job"
                        ) {
                          setShowNotes(true);
                          setShowNotesData(slot);
                        }
                      }}
                      className={`h-full min-w-[150px] flex items-center justify-center text-white cursor-pointer px-2 rounded ${getEventColor(
                        slot.type
                      )}`}
                    >
                      {getEventDisplayText(slot)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY VIEW */}
      {filterValue === "weekly" && (
        <div className="weekly-view overflow-auto">
          <div className="grid [grid-template-columns:50px_repeat(7,1fr)] gap-1 min-w-[700px]">
            <div></div>
            {weekDays.map((day, idx) => (
              <div key={idx} className="text-center py-2 text-sm font-medium">
                <div>{day.format("ddd")}</div>
                <div>{day.format("D")}</div>
              </div>
            ))}

            {timeSlots.map((time, tIdx) => (
              <React.Fragment key={tIdx}>
                <div className="flex items-center justify-end pr-2 text-sm h-16">
                  {time}
                </div>
                {weekDays.map((day, dIdx) => {
                  const date = day.format("YYYY-MM-DD");
                  const slotMeetings = meetings?.filter(
                    (m) => m.date === date && m.time === time
                  );

                  return (
                    <div
                      key={`${tIdx}-${dIdx}`}
                      className={`border h-16 relative group cursor-pointer ${
                        slotMeetings.length > 0 ? "p-1" : ""
                      }`}
                    >
                      {slotMeetings.length > 0 && (
                        <>
                          <div
                            onClick={() => {
                              if (
                                activeCheckbox !== "All Jobs" &&
                                slotMeetings[0]?.type !== "job"
                              ) {
                                setShowNotes(true);
                                setShowNotesData(slotMeetings[0]);
                              }
                            }}
                            className={`h-full w-full flex items-center justify-center text-white rounded ${getEventColor(
                              slotMeetings[0].type
                            )}`}
                          >
                            {getEventDisplayText(slotMeetings[0])}
                            {/* <h1>{slotMeetings[0].status}</h1> */}
                          </div>
                          {slotMeetings.length > 1 && (
                            <div
                              onClick={() => {
                                setShowMeetings(true);
                                setSelectMeetings(slotMeetings);
                              }}
                              className="w-6 h-6 absolute right-1 top-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center"
                            >
                              <AlignRight className="w-4 h-4" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* MONTHLY VIEW */}
      {filterValue === "monthly" && (
        <div className="monthly-view">
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
            {(() => {
              const start = startOfMonth.startOf("week");
              const end = startOfMonth.endOf("month").endOf("week");
              const fullCalendarDays = [];
              let day = start.clone();
              while (day.isBefore(end) || day.isSame(end, "day")) {
                fullCalendarDays.push(day);
                day = day.add(1, "day");
              }
              return fullCalendarDays.map((day, index) => {
                const date = day.format("YYYY-MM-DD");
                const dayMeetings = meetings.filter((m) => m.date === date);
                const isCurrentMonth = day.isSame(currentDate, "month");
                return (
                  <div
                    key={index}
                    className={`border h-24 cursor-pointer rounded-md ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (dayMeetings.length > 0) {
                          setShowMeetings(true);
                          setSelectMeetings(dayMeetings);
                        }
                      }}
                      className={`h-full flex flex-col ${
                        dayMeetings.length > 0 ? "p-1" : ""
                      }`}
                    >
                      <div
                        className={`font-medium w-8 h-8 rounded-full flex items-center justify-center ${
                          dayMeetings.length > 0
                            ? "bg-blue-500 text-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {day.format("D")}
                      </div>
                      {dayMeetings.length > 0 && (
                        <div className="flex-1 overflow-hidden mt-1">
                          {dayMeetings.slice(0, 2).map((meeting, idx) => (
                            <div
                              key={idx}
                              className={`text-xs text-white p-1 mb-1 rounded truncate ${getEventColor(
                                meeting.type
                              )}`}
                            >
                              {getEventDisplayText(meeting)}
                            </div>
                          ))}
                          {dayMeetings.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayMeetings.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* MODALS meeting and nots details*/}
      <Modal
        title={
          showNotesData?.type === "notes"
            ? "Notes Details"
            : showNotesData?.type === "meeting"
            ? "Meeting Details"
            : "Job Details"
        }
        open={showNotes}
        onCancel={() => {
          setShowNotes(false);
          setShowNotesData("");
        }}
        footer={null}
        width={600}
        centered
      >
        {showNotesData?.type === "notes" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Title</h3>
                <p className="text-gray-800">
                  {showNotesData?.title || "No title"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <p className="text-green-600">{showNotesData?.status}</p>
              </div>
              <div>
                <h3 className="font-semibold">Note</h3>
                <p className="text-gray-800">{showNotesData?.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">Assigned Technician</h3>
                <p className="text-gray-800">
                  {showNotesData?.technicians?.name}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowMeetingsStatus(true);
                  setMeetingStatus({
                    id: showNotesData?.id,
                    type: "COMPLETED",
                    status: "notes",
                  });
                  setShowNotes(false);
                  setShowNotesData("");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Mark as done
              </button>
              <button
                onClick={() => {
                  setShowMeetingsStatus(true);
                  setMeetingStatus({
                    id: showNotesData?.id,
                    type: "delete",
                    status: "notes",
                  });
                  setShowNotes(false);
                  setShowNotesData("");
                }}
                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Title</h3>
                <p className="text-gray-800">
                  {showNotesData?.title || "No title"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Assigned Technician</h3>
                <p className="text-gray-800">
                  {showNotesData?.technicians?.name}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Date</h3>
                <p className="text-green-600">{showNotesData?.date}</p>
              </div>
              <div>
                <h3 className="font-semibold">Time</h3>
                <p className="text-gray-800">{showNotesData?.startData}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowMeetingsStatus(true);
                  setMeetingStatus({
                    id: showNotesData?.id,
                    type: "COMPLETED",
                    status: "meeting",
                  });
                  setShowNotes(false);
                  setShowNotesData("");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
              >
                Mark as done
              </button>
              <button
                onClick={() => {
                  setShowMeetingsStatus(true);
                  setMeetingStatus({
                    id: showNotesData?.id,
                    type: "CANCELED",
                    status: "meeting",
                  });
                  setShowNotes(false);
                  setShowNotesData("");
                }}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition"
              >
                PostPone
              </button>
            </div>
          </div>
        )}
        {/* Modal content remains same */}
      </Modal>

      <Modal
        open={showMeetings}
        onCancel={() => {
          setShowMeetings(false);
        }}
        footer={null}
        width={400}
        centered
      >
        <div className="max-h-[400px] overflow-y-auto">
          {selectMeetings?.map((meeting, idx) => (
            <div
              key={idx}
              className={`p-3 mb-2 rounded text-white ${getEventColor(
                meeting.type
              )}`}
              onClick={() => {
                setShowNotes(true);
                setShowNotesData(meeting);
                setShowMeetings(false);
                setSelectMeetings([]);
              }}
            >
              <div className="font-bold">{getEventDisplayText(meeting)}</div>
              <div className="text-sm">Time: {meeting.time}</div>
              {meeting.description && (
                <div className="text-sm">Note: {meeting.description}</div>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* change customer status  */}
      <Modal
        title={meetingStatus?.type === "delete" ? "" : "Confirm Status Change"}
        open={showMeetingsStatus}
        onOk={() => meetingStatus && handleMeetingChangeStatus(meetingStatus)}
        onCancel={() => {
          setShowMeetingsStatus(false);
          setMeetingStatus(null);
        }}
        okText={`Yes, ${
          meetingStatus?.type === "COMPLETED"
            ? "Completed"
            : meetingStatus?.type === "delete"
            ? "Delete"
            : "Canceled"
        }`}
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          style: { height: "36px" },
        }}
        cancelButtonProps={{
          style: { height: "36px" },
        }}
        centered
      >
        <p>
          Are you sure you want to{" "}
          {meetingStatus?.status === "notes"
            ? meetingStatus?.type === "COMPLETED"
              ? "mark this note as completed"
              : meetingStatus?.type === "delete"
              ? "delete this note"
              : "cancel this note"
            : meetingStatus?.type === "COMPLETED"
            ? "mark this meeting as completed"
            : meetingStatus?.type === "delete"
            ? "delete this meeting"
            : "cancel this meeting"}
          ? You can revert this action later if needed.
        </p>
      </Modal>
    </div>
  );
};

export default TimeCalendar;

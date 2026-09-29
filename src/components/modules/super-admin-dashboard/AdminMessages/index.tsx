"use client";

import Loading from "@/components/shared/Loading/Loading";
import {
  useGetAllMessageQuery,
  useSendReplyMutation,
  useUpdateMessageStatusMutation,
} from "@/redux/features/super_admin/superAdmin.api";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Empty } from "antd";
import type React from "react";

import { useEffect, useState } from "react";

type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "RESOLVED"; // Adjust based on possible status values
  createdAt: string; // Date string in ISO format
  updatedAt: string; // Date string in ISO format
};

export default function AdminMessages() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [objectQuery, setObjectQuery] = useState<
    {
      name: string;
      value: string | number;
    }[]
  >([
    { name: "page", value: page },
    { name: "limit", value: pageSize },
  ]);

  useEffect(() => {
    setObjectQuery([
      { name: "page", value: page },
      { name: "limit", value: pageSize },
    ]);
  }, [page, pageSize]);

  useEffect(() => {
    const newQueries: { name: string; value: string | number }[] = [
      { name: "page", value: page },
      { name: "limit", value: pageSize },
    ];

    if (searchQuery) {
      newQueries.push({ name: "searchTerm", value: searchQuery });
    }

    if (statusFilter?.trim()) {
      newQueries.push({ name: "status", value: statusFilter });
    }

    setObjectQuery(newQueries);
  }, [page, pageSize, searchQuery, statusFilter]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllMessageQuery(objectQuery);

  const messages: ContactMessage[] = response?.data || [];

  const unreadCount = messages?.filter(
    (msg) => msg.status === "UNREAD"
  )?.length;
  const totalCount = messages?.length;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Unread":
        return "bg-red-500 text-white";
      case "Seen":
        return "bg-orange-500 text-white";
      case "Resolved":
        return "bg-gray-800 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  };

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const [send] = useSendReplyMutation();

  const handleSendReply = async () => {
    const payload = {
      id: selectedMessage?.id,
      data: { reply: replyText },
    };
    const res = await handleAsyncWithToast(async () => {
      return send(payload);
    }, "Sending reply");
    if (res?.data?.success) {
      setReplyText("");
    }
  };

  const [updateMessageStatus] = useUpdateMessageStatusMutation();

  const handleMarkAsReadOrUnread = async (
    messageId: string,
    action: string
  ) => {
    console.log(messageId, action);
    await handleAsyncWithToast(async () => {
      return updateMessageStatus({
        id: messageId,
        data: { status: action },
      });
    }, "Message status updating");
  };

  const handleDeleteMessage = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Deleting message:", messageId);
    // Handle delete message logic
  };

  if (isLoading) return <Loading />;

  return (
    <section className="flex flex-col gap-5">
      {/* Header */}
      <div className="border-b pb-4 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-xl font-bold text-primary">
            User Messages From &quot;Get In Touch&quot;
          </h1>
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            {unreadCount} unread
          </span>
          <span className="text-sm text-gray-500">
            {totalCount} total messages
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search Here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span className="text-gray-700">
                {statusFilter === "" ? "All Status" : statusFilter}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {["All Status", "Unread", "Read", "Resolved"]?.map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusFilterChange(
                            status === "All Status" ? "" : status?.toUpperCase()
                          )
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-270px)] bg-gray-50">
        {/* Left Panel - Messages List */}
        <div className="md:w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {!isFetching && messages?.length > 0
              ? messages?.map((message) => (
                  <div
                    key={message?.id}
                    onClick={() => handleMessageClick(message)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      selectedMessage?.id === message.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-primary">
                            Sender Name:{" "}
                            {message.fullName.charAt(0).toUpperCase() +
                              message.fullName.slice(1)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                              message.status
                            )}`}
                          >
                            {message.status}
                          </span>
                          {message.status === "UNREAD" && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>

                        <h3 className="font-medium text-primary mb-2">
                          Subject: {message.subject}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          <span className="font-medium text-primary">
                            Message
                          </span>{" "}
                          : {message.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-xs text-gray-500">
                              {new Date(message?.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteMessage(message.id, e)}
                          className="group p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                          title="Delete Message"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        {/* Mark as Read/Unread Button */}
                        <button
                          onClick={() =>
                            handleMarkAsReadOrUnread(
                              message?.id,
                              message.status === "UNREAD" ? "READ" : "UNREAD"
                            )
                          }
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border
                            ${message?.status === "RESOLVED" ? "hidden" : ""}
                            ${
                              message.status === "UNREAD"
                                ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                            }`}
                          title={`Mark as ${
                            message.status === "UNREAD" ? "Read" : "Unread"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {message.status === "UNREAD"
                            ? "Mark as Read"
                            : "Mark as Unread"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : ""}
            {isFetching && messages?.length === 0 ? (
              <div className="flex items-center justify-center h-60vh">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
              </div>
            ) : (
              ""
            )}
            {!isFetching && messages?.length === 0 ? <Empty /> : ""}
          </div>
        </div>

        {/* Right Panel - Message Details */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedMessage ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-primary">
                    Message Details
                  </h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium text-primary">
                      {selectedMessage.fullName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {selectedMessage.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {selectedMessage.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {new Date(selectedMessage.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="font-medium text-primary mb-2">Subject</h3>
                  <p className="text-gray-700">{selectedMessage.subject}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-primary mb-2">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="mb-6">
                  <h3 className="font-medium text-primary mb-2">Reply</h3>
                  <textarea
                    value={replyText}
                    onChange={handleReplyChange}
                    placeholder={`Reply to ${selectedMessage.fullName}`}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent resize-none"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText}
                    className="mt-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Reply to E-mail
                  </button>
                </div>

                {/* Actions */}
                {/* <div>
                  <h3 className="font-medium text-primary mb-3">Actions</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Status:</span>
                      <select
                        // value={selectedMessage.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Unread">Unread</option>
                        <option value="Seen">Seen</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                    <button
                      onClick={() =>
                        handleMarkAsReadOrUnread(
                          selectedMessage?.id,
                          selectedMessage.status === "UNREAD"
                            ? "READ"
                            : "UNREAD"
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Mark as{" "}
                      {selectedMessage.status === "UNREAD" ? "Read" : "Unread"}
                    </button>
                  </div>
                </div> */}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">
                  Select a message to view details
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close dropdowns */}
        {(showStatusDropdown || showFilterDropdown) && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => {
              setShowStatusDropdown(false);
              setShowFilterDropdown(false);
            }}
          />
        )}
      </div>
    </section>
  );
}

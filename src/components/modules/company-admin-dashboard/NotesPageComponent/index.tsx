"use client";

import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import {
  useCreateNotesMutation,
  useDeleteNotesMutation,
  useGetAllNotesQuery,
  useGetTechniciansDropdownQuery,
  useUpdateNotesMutation,
} from "@/redux/features/note/noteApi";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  TimePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import dayjs from "dayjs";
import moment from "moment";

interface Note {
  id?: string;
  title: string;
  notes: string;
  status: string;
  technician?: { id: string; name: string };
  createdAt?: string;
  date?: string;
  timeFrame?: string;
  technicianId?: string;
}

interface Technicians {
  id: string;
  name: string;
}

export default function NotesPageComponent() {
  const headers: string[] = [
    "Title",
    "Notes",
    "Assigned Technician",
    "Created On",
    "Status",
    "Action",
  ];
  const user = useAppSelector(selectCurrentUser);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [vehiclesToDelete, setVehiclesToDelete] = useState<string>("");

  // Sample notes data
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [technicians, setTechnicians] = useState<Technicians[]>([]);

  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });

  // Sample technicians data

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Backend search logic would go here
  };
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleAction = (action: string, id: number | string) => {
    const note = notesData.find((n) => n.id === id);
    if (action === "View Details") {
      if (note) {
        setSelectedNote(note);
        setIsViewModalOpen(true);
      }
    }
    if (action === "Delete") {
      if (note) {
        setDeleteModalVisible(true);
        setVehiclesToDelete(note?.id ?? "");
      }
    }
    if (action === "Edit") {
      if (note) {
        setSelectedNote(note);
        setIsEditModalOpen(true);
        console.log(note);
        form.setFieldsValue({
          title: note.title,
          note: note.notes,
          assignedTechnician: note?.technician?.id, // fallback if not found
          date: dayjs(note.date), // ensure Dayjs object if needed
          status: note.status,
          start_time: dayjs(note.timeFrame?.split(" - ")[0]),
          end_time: dayjs(note.timeFrame?.split(" - ")[1]),
        });
      }
    }
    setOpenDropdown(null);
  };

  const showCreateModal = () => {
    setIsViewModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const [createNotes, { isLoading: createLoading }] = useCreateNotesMutation();

  const handleCreateSubmit = async () => {
    try {
      const {
        title,
        note,
        assignedTechnician,
        date,
        status,
        start_time,
        end_time,
      } = await form.validateFields();

      // Create new note
      const newNote: Note = {
        title: title,
        date: moment(date.$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        notes: note,
        timeFrame: `${start_time} - ${end_time}`,
        technicianId: assignedTechnician,
        status: status,
      };
      const response = await createNotes(newNote).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Note created successfully!");
        setIsCreateModalOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create note. Please check the form or try again.";
      toast.error(message);
    }
  };

  const [updateNotes, { isLoading: updateLoading }] = useUpdateNotesMutation();
  const handleEditSubmit = async () => {
    try {
      const {
        title,
        note,
        assignedTechnician,
        date,
        status,
        start_time,
        end_time,
      } = await form.validateFields();

      // Create new note
      const newNote: Note = {
        title: title,
        date: moment(date.$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        notes: note,
        timeFrame: `${start_time} - ${end_time}`,
        technicianId: assignedTechnician,
        status: status,
      };

      if (!selectedNote) return;

      const response = await updateNotes({
        id: selectedNote?.id,
        formData: newNote,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Note update successfully!");
        setIsEditModalOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to updated note. Please check the form or try again.";
      toast.error(message);
    }
  };
  const handleMarkAsCompleted = async () => {
    try {
      if (!selectedNote) return;

      const response = await updateNotes({
        id: selectedNote?.id,
        formData: {
          status: selectedNote?.status === "ONGOING" ? "COMPLETED" : "ONGOING",
        },
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Note status update successfully!");

        setIsViewModalOpen(false);
        setSelectedNote(null);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to status updated note. Please check the form or try again.";
      toast.error(message);
    }
  };

  const [deleteNote, { isLoading: deleteLoading }] = useDeleteNotesMutation();
  const handleNotesDelete = async (id: string) => {
    try {
      const response = await deleteNote(id).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "Fail to note delete. Please try again"
        );
        setVehiclesToDelete("");
        setDeleteModalVisible(false);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to delete note. Please check the form or try again.";
      toast.error(message);
    }
  };
  const { data, error, isLoading } = useGetAllNotesQuery([
    {
      name: "page",
      value: page,
    },
    {
      name: "limit",
      value: pageSize,
    },
    {
      name: "searchTerm",
      value: searchQuery,
    },
  ]);
  const { data: technicianDropdown } = useGetTechniciansDropdownQuery({
    id: user?.companyId,
    page: 1,
    limit: 2000,
  });
  useEffect(() => {
    if (data?.success) {
      const notes = data?.data?.data;
      const pagination = data?.data?.meta;
      setNotesData(notes);
      setTotal({
        total: pagination?.total,
        totalPages: pagination?.totalPages,
        limit: pagination?.limit,
      });
    }
    if (technicianDropdown?.success) {
      setTechnicians(technicianDropdown?.data?.data);
    }
  }, [data, error, technicianDropdown]);
  return (
    <div className="min-h-fit">
      <div className="max-w-[1592px] mx-auto">
        {/* Header */}
        <div className="py-5 flex items-center justify-between gap-5 flex-wrap">
          <h1 className="text-2xl font-bold text-primary">All Notes</h1>

          <div className="flex flex-wrap items-center justify-between gap-5">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search title or notes"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Create Note Button */}
            <button
              onClick={showCreateModal}
              className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Note</span>
            </button>
          </div>
        </div>

        <TableComponent headers={headers}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <CustomerRowSkeleton key={idx} headers={headers?.length} />
              ))
            : notesData.map((note, index) => (
                <tr
                  key={note.id}
                  className={`border-b border-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-6 text-gray-700">{note.title}</td>
                  <td className="py-4 px-6 text-gray-700 max-w-[400px]">
                    {note.notes?.length > 100
                      ? note?.notes?.slice(0, 100) + "..."
                      : note?.notes}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {note.technician?.name}
                  </td>
                  <td className="py-4 px-6 text-gray-700">{note.createdAt}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        note.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {note.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 relative w-[70px]">
                    <button
                      onClick={() => handleDropdownToggle(note.id ?? "")}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === note.id && (
                      <div
                        className={`absolute right-16 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 ${
                          index >= notesData.length - 3 ? "bottom-12" : "top-12"
                        }`}
                      >
                        <div className="py-2">
                          <button
                            onClick={() => handleAction("Edit", note.id ?? "")}
                            className="w-full text-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleAction("View Details", note.id ?? "")
                            }
                            className="w-full text-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() =>
                              handleAction("Delete", note.id ?? "")
                            }
                            className="w-full text-center px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
        </TableComponent>

        {/* Pagination */}
        <div className="p-4 w-full flex justify-center items-center mt-6">
          <Pagination
            current={page}
            pageSize={total?.limit}
            total={total?.total}
            onChange={handlePaginationChange}
            className="custom-pagination"
          />
        </div>

        {/* Create Note Modal */}
        <Modal
          title="Create Note"
          open={isCreateModalOpen}
          onCancel={() => {
            setIsCreateModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateSubmit}
            className="mt-4"
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please enter a title!" },
                { min: 3, message: "Title must be at least 3 characters!" },
              ]}
            >
              <Input placeholder="Enter note title" className="h-12" />
            </Form.Item>

            <Form.Item
              label="Note"
              name="note"
              rules={[
                { required: true, message: "Please enter note content!" },
                { min: 10, message: "Note must be at least 10 characters!" },
              ]}
            >
              <TextArea rows={4} placeholder="Enter note content" />
            </Form.Item>

            <Form.Item
              label="Assigned Technician"
              name="assignedTechnician"
              rules={[
                { required: true, message: "Please select a technician!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select technician"
                className="h-12"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {technicians.map(({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select a status!" }]}
            >
              <Select placeholder="Select status" className="h-12">
                <Select.Option value="ONGOING">Ongoing</Select.Option>
                <Select.Option value="COMPLETED">Completed</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please enter the date" }]}
            >
              <DatePicker className="w-full h-12" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="start_time"
              label="Start Time"
              rules={[
                { required: true, message: "Please enter the start time" },
              ]}
            >
              <TimePicker className="w-full h-12" format="HH:mm" />
            </Form.Item>

            <Form.Item
              name="end_time"
              label="End Time"
              rules={[{ required: true, message: "Please enter the end time" }]}
            >
              <TimePicker className="w-full h-12" format="HH:mm" />
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className={`w-full h-12 bg-primary hover:bg-gray-800 border-primary ${
                  createLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                size="large"
                disabled={createLoading}
                loading={createLoading}
              >
                Create Note
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Note Modal */}
        <Modal
          title="Edit Note"
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditSubmit}
            className="mt-4"
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please enter a title!" },
                { min: 3, message: "Title must be at least 3 characters!" },
              ]}
            >
              <Input placeholder="Enter note title" className="h-12" />
            </Form.Item>

            <Form.Item
              label="Note"
              name="note"
              rules={[
                { required: true, message: "Please enter note content!" },
                { min: 10, message: "Note must be at least 10 characters!" },
              ]}
            >
              <TextArea rows={4} placeholder="Enter note content" />
            </Form.Item>

            <Form.Item
              label="Assigned Technician"
              name="assignedTechnician"
              rules={[
                { required: true, message: "Please select a technician!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select technician"
                className="h-12"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {technicians.map(({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select a status!" }]}
            >
              <Select placeholder="Select status" className="h-12">
                <Select.Option value="ONGOING">Ongoing</Select.Option>
                <Select.Option value="COMPLETED">Completed</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please enter the date" }]}
            >
              <DatePicker className="w-full h-12" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="start_time"
              label="Start Time"
              rules={[
                { required: true, message: "Please enter the start time" },
              ]}
            >
              <TimePicker className="w-full h-12" format="HH:mm" />
            </Form.Item>

            <Form.Item
              name="end_time"
              label="End Time"
              rules={[{ required: true, message: "Please enter the end time" }]}
            >
              <TimePicker className="w-full h-12" format="HH:mm" />
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className={`w-full h-12 bg-primary hover:bg-gray-800 border-primary ${
                  updateLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                size="large"
                disabled={updateLoading}
                loading={updateLoading}
              >
                Update Note
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Details Modal */}
        <Modal
          open={isViewModalOpen}
          onCancel={() => {
            setIsViewModalOpen(false);
            setSelectedNote(null);
          }}
          footer={null}
          width={800}
          centered
          closable={false}
          title={
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">Note details</span>
              <button
                onClick={showCreateModal}
                className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Note</span>
              </button>
            </div>
          }
        >
          {selectedNote && (
            <div className="mt-6">
              {/* Note Information Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm font-medium text-primary mb-1">
                    Title
                  </div>
                  <div className="text-gray-600">{selectedNote?.title}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary mb-1">
                    Date
                  </div>
                  <div className="text-gray-600">
                    {moment(selectedNote?.date).format("DD MMMM yyyy")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary mb-1">
                    Assigned Technician
                  </div>
                  <div className="text-gray-600">
                    {selectedNote?.technician?.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary mb-1">
                    Status
                  </div>
                  <div className="text-gray-600">
                    {selectedNote?.status === "ONGOING"
                      ? "Open"
                      : selectedNote?.status}
                  </div>
                </div>
              </div>

              {/* Separator */}
              <hr className="border-gray-200 mb-6" />

              {/* Full Note Content */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNote.notes}
                </p>
              </div>

              {/* Mark as Completed Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleMarkAsCompleted}
                  className={`bg-primary hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors ${
                    updateLoading ? "cursor-not-allowed" : "cursor-pointer"
                  } `}
                  disabled={updateLoading}
                >
                  Mark as{" "}
                  {selectedNote?.status === "ONGOING" ? "Completed" : "Ongoing"}
                </button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title="Confirm Delete"
          open={deleteModalVisible}
          onOk={() => vehiclesToDelete && handleNotesDelete(vehiclesToDelete)}
          onCancel={() => {
            setVehiclesToDelete("");
            setDeleteModalVisible(false);
          }}
          okText="Yes, Delete"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
            loading: deleteLoading,
            style: { height: "36px" },
          }}
          cancelButtonProps={{
            style: { height: "36px" },
          }}
          centered
        >
          <p>
            Are you sure you want to delete this notes? This action cannot be
            undone.
          </p>
        </Modal>
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}

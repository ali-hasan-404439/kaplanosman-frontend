import {
  useCreateMeetingCalenderMutation,
  useCreateNotesCalenderMutation,
  useGetTechniciansDropdownCalenderQuery,
} from "@/redux/features/calendar/calendarApi";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from "antd";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";

const brandOptions = ["Osman", "Kaplan", "John", "Alex"]; // Dummy technician names

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
function AddNoteMeeting() {
  const user = useAppSelector(selectCurrentUser);
  const [technicians, setTechnicians] = useState<Technicians[]>([]);
  const [form] = Form.useForm();
  const [showTypeSelectModal, setShowTypeSelectModal] = useState(false);
  const [activeType, setActiveType] = useState<
    "Add Job" | "Add Note" | "Add Meeting" | ""
  >("");

  const router = useRouter();

  const handleTypeClick = (type: "Add Job" | "Add Note" | "Add Meeting") => {
    if (type === "Add Job") {
      router.push(
        user?.role === "COMPANY_ADMIN"
          ? "/company/orders/new_order"
          : "/manager/orders/new_order"
      );
    } else {
      setActiveType(type);
      form.resetFields();
    }
    setShowTypeSelectModal(false);
  };

  const handleCloseModal = () => {
    setActiveType("");
    form.resetFields();
  };

  const [createMeetingCalender,{isLoading: createLoadingMeeting}] = useCreateMeetingCalenderMutation();
  const handleSubmitMeeting = async (values: any) => {
    const { title, date, time, assignedTechnician } = values;
    const newMeeting = {
      title: title,
      date: moment(date.$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      timeFrame: moment(time.$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      technicianId: assignedTechnician,
    };
    try {
      const response = await createMeetingCalender(newMeeting).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Note created successfully!");
        setActiveType("");
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

  const [createNotes, { isLoading: createLoading }] =
    useCreateNotesCalenderMutation();
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
        setActiveType("");
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
  const { data: technicianDropdown } = useGetTechniciansDropdownCalenderQuery({
    id: user?.companyId,
    page: 1,
    limit: 2000,
  });
  useEffect(() => {
    if (technicianDropdown?.success) {
      setTechnicians(technicianDropdown?.data?.data);
    }
  }, [technicianDropdown]);
  return (
    <div>
      {/* Primary Add Button */}
      <button
        onClick={() => setShowTypeSelectModal(true)}
        className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add</span>
      </button>

      {/* First Modal: Select between Note or Meeting */}
      <Modal
        title="Select Type"
        open={showTypeSelectModal}
        onCancel={() => setShowTypeSelectModal(false)}
        footer={null}
        width={300}
        centered
      >
        <div className="flex flex-col divide-y text-left">
          {["Add Job", "Add Note", "Add Meeting"].map((type) => (
            <button
              key={type}
              onClick={() =>
                handleTypeClick(type as "Add Job" | "Add Note" | "Add Meeting")
              }
              className="w-full px-4 py-2 hover:bg-gray-50 transition text-gray-800"
            >
              {type}
            </button>
          ))}
        </div>
      </Modal>

      {/* Second Modal: Form for Note or Meeting */}

      <Modal
        title={activeType}
        open={!!activeType}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        centered
      >
        {/* Toggle Buttons */}
        <div>
          <div className="flex items-center w-full gap-5 mb-4">
            {["Add Note", "Add Meeting"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setActiveType(type as "Add Note" | "Add Meeting")
                }
                className={`${
                  activeType === type
                    ? "bg-primary text-white hover:bg-gray-800"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                } px-4 py-2 rounded-lg flex-1 text-center transition-colors`}
              >
                {type === "Add Note" ? "Notes" : "Meeting Schedule"}
              </button>
            ))}
          </div>
          {activeType === "Add Note" ? (
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
                rules={[
                  { required: true, message: "Please enter the end time" },
                ]}
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
          ) : (
            <Form form={form} layout="vertical" onFinish={handleSubmitMeeting}>
              <Form.Item
                label="Add Title"
                name="title"
                rules={[{ required: true, message: "Please enter title!" }]}
              >
                <Input placeholder="Enter title" className="h-12" />
              </Form.Item>

              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Select a date!" }]}
              >
                <DatePicker className="w-full h-12" />
              </Form.Item>

              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true, message: "Enter time!" }]}
              >
                <TimePicker className="w-full h-12" format="HH:mm" />
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
              <Form.Item className="mt-6 mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 bg-primary hover:bg-gray-800"
                  size="large"
                  disabled={createLoadingMeeting}
                  loading={createLoadingMeeting}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AddNoteMeeting;

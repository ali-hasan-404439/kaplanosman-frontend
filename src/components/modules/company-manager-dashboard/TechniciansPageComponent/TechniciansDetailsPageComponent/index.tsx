"use client";
import { Link } from "next-view-transitions";
import TechniciansCalender from "./TechniciansCalender";
import { Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetSingleUserQuery } from "@/redux/features/technicians/techniciansApi";
import { toast } from "sonner";
import moment from "moment";
interface User {
  id: string;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
  user: {
    email: string;
  };
}

function TechniciansDetailsPageComponent() {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const params = useParams();
  const rawId = params?.id;
  const singleUserId = Array.isArray(rawId) ? rawId[0] : rawId ?? "";

  const { data, error, isLoading, isSuccess } = useGetSingleUserQuery(
    { id: singleUserId },
    {
      skip: !singleUserId,
    }
  );
  useEffect(() => {
    if (isSuccess && data?.success) {
      setUserDetails(data?.data);
    }

    if (error) {
      const errMessage =
        (error as any)?.data?.message ||
        "Something went wrong while fetching the user.";
      toast.error(errMessage);
    }
  }, [data, error, isSuccess]);
  return (
    <div className="bg-gray-50 rounded">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6  p-5">
        <div className="grid grid-cols-2 gap-y-2">
          <p>Technician Name:</p>
          <p>{userDetails?.name}</p>
          <p>Current Status:</p>
          <p className="text-red-500">{userDetails?.status?.split("_")}</p>
        </div>
        <div className="grid grid-cols-2 gap-y-2">
          <p>Email:</p>
          <p>{userDetails?.user?.email}</p>
          <p>Phone:</p>
          <p>{userDetails?.phone}</p>
          <p>Date:</p>
          <p>{moment(userDetails?.createdAt).format("dd mm yyyy")}</p>
        </div>
      </div>

      {/* Optional Separator */}
      <div className="my-10 border-b border-gray-200" />

      <TechniciansCalender />
      {/* <div className="p-5 space-y-5">
        <div className="flex items-center justify-between gap-5">
          <h1 className="font-bold">Technician Calendar</h1>
          <h1>Create Date: 16-01-2025</h1>
        </div>
        <div className=" p-5 bg-gray-100 space-y-10">
          <div className="grid grid-cols-5 gap-2">
            <div className="flex items-center gap-5">
              <p>Title:</p>
              <p>Leave Application</p>
            </div>
            <div className="flex items-center gap-5">
              <p>Author:</p>
              <p>Admin</p>
            </div>
            <div className="flex items-center gap-5">
              <p>Status:</p>
              <p>Sick Leave</p>
            </div>
            <div className="flex items-center gap-5">
              <p>Start Date:</p>
              <p>16-01-2025</p>
            </div>
            <div className="flex items-center gap-5">
              <p>End Date:</p>
              <p>25-01-2025</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex items-center whitespace-nowrap gap-5">
              <p>Days: </p>
              <p>5 days</p>
            </div>
            <div>
              <p>Description: </p>
              <p>
                A detailed explanation of the status or any additional notes
                Doctor&apos;s note attached, Vacation approved
              </p>
            </div>
            <div>
              <p>File: </p>
              <div className="flex items-center gap-10">
                <Link
                  href="#"
                  className="whitespace-nowrap text-blue-500 underline"
                >
                  uploaded a supporting document
                </Link>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer">
                  <Pencil />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TechniciansDetailsPageComponent;

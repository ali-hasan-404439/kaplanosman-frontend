import { RcFile } from "antd/es/upload";
import { toast } from "sonner";

export const beforeUpload = (file: RcFile) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    toast.error("You can only upload image files!");
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error("Image must be smaller than 2MB!");
    return false;
  }

  return true;
};

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

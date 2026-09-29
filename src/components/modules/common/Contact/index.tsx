"use client";
import MyButton from "@/components/ui/MyButton/MyButton";
import { useSendMessageMutation } from "@/redux/features/super_admin/superAdmin.api";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Form, Input } from "antd";
import { toast } from "sonner";
import Swal from "sweetalert2";

const { TextArea } = Input;

const ContactComponent = () => {
  const [form] = Form.useForm();

  const [sendMessage] = useSendMessageMutation();

  const onFinish = async (values: any) => {
    // Combine first and last name into fullName as expected by backend
    const payload = {
      fullName: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email,
      phone: values.phone,
      subject: values.subject,
      message: values.message,
    };

    const res = await handleAsyncWithToast(async () => {
      return sendMessage(payload);
    }, "Sending message...");
    if (res?.data?.success) {
      form.resetFields();
      Swal.fire({
        title: "Done!",
        text: "Your message has been sent successfully!",
        icon: "success",
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    toast.error("Please fill in all required fields correctly.");
  };

  const faqs = [
    {
      question: "What are your support hours?",
      answer:
        "Our support team is available Monday through Friday from 9 AM to 6 PM EST. For urgent issues, we offer 24/7 emergency support for our Professional and Enterprise customers.",
    },
    {
      question: "How quickly can I expect a response?",
      answer:
        "We aim to respond to all inquiries within 24 hours. For urgent matters, our response time is typically within 2-4 hours during business hours.",
    },
    {
      question: "Do you offer on-site support?",
      answer:
        "Yes, we offer on-site support for our Enterprise customers. This service is available in select locations and may incur additional fees.",
    },
    {
      question: "Can I schedule a demo before purchasing?",
      answer:
        "We encourage potential customers to schedule a demo to see how our platform can address their specific needs. You can request a demo through our contact form.",
    },
  ];

  return (
    <div className="min-h-screen mb-10 bg-background-secondary">
      {/* Contact Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Contact Information */}
            <div className="space-y-8">
              <div>
                <p className="text-sm text-secondary mb-4 font-medium">
                  Features
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight">
                  Get in <span className="text-primary">Touch</span>
                </h1>
                <p className="text-lg text-secondary leading-relaxed max-w-md">
                  Have questions or need assistance? Our team is here to help.
                  Reach out to us and we&apos;ll get back to you as soon as
                  possible.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-secondary"
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
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      Email Us
                    </h3>
                    <p className="text-secondary">info@prodexter.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-secondary"
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
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      Call Us
                    </h3>
                    <p className="text-secondary">+1 (555) 123-4567</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      Visit Us
                    </h3>
                    <p className="text-secondary">
                      123 Business Avenue, Tech City, CA 94107
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-primary mb-8">
                Send Us a Message
              </h2>

              <Form
                form={form}
                name="contact"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className=""
              >
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input placeholder="John" />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <Input placeholder="Doe" />
                  </Form.Item>
                </div>

                {/* Email */}
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input placeholder="john.doe@example.com" />
                </Form.Item>

                {/* Phone Number */}
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      pattern: /^[0-9+\- ]+$/,
                      message: "Please enter a valid phone number!",
                    },
                  ]}
                >
                  <Input placeholder="+1 (555) 123-4567" />
                </Form.Item>

                {/* Subject */}
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[
                    { required: true, message: "Please input a subject!" },
                  ]}
                >
                  <Input placeholder="How can we help you?" />
                </Form.Item>

                {/* Message */}
                <Form.Item
                  name="message"
                  label="Message"
                  rules={[
                    { required: true, message: "Please input your message!" },
                    {
                      min: 10,
                      message: "Message must be at least 10 characters!",
                    },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Please provide details about your inquiry..."
                  />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                  <MyButton
                    label="Send Message"
                    variant="filled"
                    type="submit"
                    fullWidth
                    className="!bg-primary hover:!bg-gray-800 mt-2 !py-3 !text-base"
                  />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight">
              Frequently Asked <span className="text-secondary">Questions</span>
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
              Find answers to common questions about our services and support.
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-bold text-primary mb-4">
                  {faq.question}
                </h3>
                <p className="text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactComponent;

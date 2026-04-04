"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import {
  uploadFile,
  uploadPublicResume,
  publicApplyJob,
  fetchJobQuestions,
  type JobApiItem,
  type JobDetailData,
  type JobQuestion
} from "@/lib/api";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobApiItem | JobDetailData | null;
  primaryColor: string;
}

export default function ApplyJobModal({ isOpen, onClose, job, primaryColor }: ApplyJobModalProps) {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobQuestions, setJobQuestions] = useState<JobQuestion[]>([]);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

  // Fetch questions when job changes and modal is open
  useEffect(() => {
    if (isOpen && job) {
      form.resetFields();
      setSelectedFile(null);
      setJobQuestions([]);

      const loadQuestions = async () => {
        setIsFetchingQuestions(true);
        try {
          const questions = await fetchJobQuestions(job.id);
          setJobQuestions(questions);
        } catch (error) {
          console.error("Failed to fetch questions:", error);
        } finally {
          setIsFetchingQuestions(false);
        }
      };

      loadQuestions();
    }
  }, [isOpen, job, form]);

  const handleApplySubmit = async (values: any) => {
    if (!job) return;
    if (!selectedFile) {
      message.error("Please upload your CV.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload File
      const fileData = await uploadFile(selectedFile);
      if (!fileData || !fileData.downloadUrl) {
        throw new Error("Failed to upload CV. Could not retrieve URL.");
      }

      // 2. Register Resume
      const resumeId = await uploadPublicResume({
        resumeName: selectedFile.name,
        fileName: fileData.originalFileName || selectedFile.name,
        resumeUrl: fileData.downloadUrl,
      });

      // 3. Apply
      const answersList = jobQuestions.map((q) => ({
        questionId: q.id,
        answerContent: values[`question_${q.id}`] || "",
      }));

      await publicApplyJob({
        jobId: job.id,
        resumeId,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        coverLetter: values.coverLetter || "",
        appliedAt: new Date().toISOString(),
        answers: answersList,
      });

      message.success("Application submitted successfully! Thank you for your interest.");
      onClose();
    } catch (err: any) {
      message.error(err.message || "An error occurred while applying. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isAllowed = file.type === "application/pdf" || file.name.endsWith(".doc") || file.name.endsWith(".docx");
      if (!isAllowed) {
        message.error("Only PDF or DOC/DOCX files are supported!");
        return Upload.LIST_IGNORE;
      }
      setSelectedFile(file);
      return false; // Prevent default upload
    },
    onRemove: () => setSelectedFile(null),
    maxCount: 1,
  };

  return (
    <Modal
      title={`Apply for: ${job?.name || ""}`}
      open={isOpen}
      onCancel={() => !isSubmitting && onClose()}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleApplySubmit} style={{ marginTop: 16 }}>
        <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter your full name" }]}>
          <Input placeholder="John Doe" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Invalid email address" }
        ]}>
          <Input placeholder="email@example.com" />
        </Form.Item>
        <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter your phone number" }]}>
          <Input placeholder="09xxxx..." />
        </Form.Item>
        <Form.Item name="coverLetter" label="Cover Letter">
          <Input.TextArea placeholder="Briefly introduce yourself or your career goals..." rows={4} />
        </Form.Item>

        {isFetchingQuestions ? (
          <div style={{ padding: "16px 0", textAlign: "center", color: "#6b7280", fontSize: 13 }}>Loading job questions...</div>
        ) : (
          jobQuestions.map((q) => (
            <Form.Item
              key={q.id}
              name={`question_${q.id}`}
              label={q.content}
              rules={[{ required: q.isRequired, message: "Please answer this question" }]}
            >
              <Input.TextArea placeholder="Answer question..." rows={3} />
            </Form.Item>
          ))
        )}

        <style>{`.custom-upload .ant-upload-select { width: 100% !important; display: block !important; }`}</style>
        <Form.Item label="Resume (CV)" required style={{ marginTop: 20 }}>
          <Upload {...uploadProps} showUploadList={false} className="custom-upload" style={{ width: "100%", display: "block" }}>
            {!selectedFile ? (
              <div style={{
                width: "100%", padding: "18px 24px", border: "1px dashed #cbd5e1",
                borderRadius: "10px", background: "#f8fafc", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10, color: "#334155", transition: "all 0.2s"
              }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
              >
                <span style={{ fontWeight: 600, fontSize: 14 }}>Upload CV (PDF, DOC)</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  width: "100%", padding: "14px 20px", border: "1px dashed #cbd5e1",
                  borderRadius: "10px", background: "#f8fafc", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, color: "#334155", transition: "all 0.2s"
                }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                >
                  <span style={{ fontSize: 16, color: "#64748b" }}>↑</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Upload another CV (PDF, DOC)</span>
                </div>
                <div style={{
                  width: "100%", padding: "14px 20px", border: "1px solid #f97316",
                  background: "#fff7ed", borderRadius: "10px", display: "flex",
                  alignItems: "center", justifyContent: "space-between", cursor: "default",
                  transition: "all 0.2s"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1f2937", marginBottom: 2, wordBreak: "break-all" }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {new Date().toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", border: "2px solid #f97316",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#f97316", fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>
                    ✓
                  </div>
                </div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ background: primaryColor }}>
            Submit Application
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

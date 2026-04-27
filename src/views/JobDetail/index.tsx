"use client";

import { useState } from "react";
import Link from "next/link";
import { buildPath } from "@/utils/navigation";
import { ConfigProvider } from "antd";
import type { FlatTheme } from "@/types/career-page";
import type { JobDetailData, JobApiItem } from "@/lib/api";

import ApplyJobModal from "@/components/career-sections/ApplyJobModal";
import JobDetailHeader from "./components/JobDetailHeader";
import JobDetailMetaChips from "./components/JobDetailMetaChips";
import JobDetailSkillTags from "./components/JobDetailSkillTags";
import JobDetailContent from "./components/JobDetailContent";

interface JobDetailViewProps {
  slug: string;
  jobDetail: JobDetailData | null;
  theme: FlatTheme;
}

export default function JobDetailView({ slug, jobDetail, theme }: JobDetailViewProps) {
  const { primaryColor, textColor, borderRadius } = theme;
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  if (!jobDetail) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center", color: "#9ca3af", fontSize: 16 }}>
        Could not load job details. The job might have been closed or removed.
        <div style={{ marginTop: 20 }}>
          <Link href={buildPath(slug)} style={{ color: primaryColor, textDecoration: "none", fontWeight: 600 }}>
            ← Return to Career Page
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyClick = () => {
    setApplyModalOpen(true);
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryColor, borderRadius } }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: `'${theme.fontFamily || "Inter"}', sans-serif`,
        color: textColor
      }}>
        {/* Main Card */}
        <div style={{
          background: "#fff",
          borderRadius: `${borderRadius}px`,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}>
          <JobDetailHeader jobDetail={jobDetail} textColor={textColor} />

          <JobDetailMetaChips jobDetail={jobDetail} primaryColor={primaryColor} />

          <JobDetailSkillTags jobDetail={jobDetail} primaryColor={primaryColor} />

          {/* Main Apply Button */}
          <div style={{ padding: "24px 32px 0" }}>
            <button
              onClick={handleApplyClick}
              style={{
                width: "100%", display: "block", textAlign: "center",
                padding: "14px 32px", borderRadius: `${borderRadius}px`,
                background: primaryColor, color: "#fff", fontSize: 16, fontWeight: 700,
                border: "none", cursor: "pointer", transition: "all 0.2s",
                boxShadow: `0 4px 12px ${primaryColor}30`,
              }}
            >
              Apply Now ↗
            </button>
          </div>

          <JobDetailContent
            jobDetail={jobDetail}
            textColor={textColor}
            primaryColor={primaryColor}
            borderRadius={borderRadius}
          />
        </div>
      </div>

      <ApplyJobModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={jobDetail as JobApiItem}
        primaryColor={primaryColor}
        borderRadius={borderRadius}
      />
    </ConfigProvider>
  );
}

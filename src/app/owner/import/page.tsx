"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/marketing/section-heading";
import { useAuth } from "@/lib/auth/auth-context";
import { useFeedback } from "@/lib/feedback/feedback-context";

type ImportResult = {
  message: string;
  imported: number;
  updated: number;
  pendingReview: number;
  skipped: number;
  errors: Array<{ row: number; sku?: string; reason: string }>;
};

type ImportLog = {
  id: string;
  filename: string;
  imported: number;
  updated: number;
  skipped: number;
  createdAt: string;
};

export default function OwnerImportPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== "OWNER") {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role === "OWNER") {
      fetch("/api/products/import")
        .then((r) => r.json())
        .then((data) => setLogs(data.logs ?? []))
        .catch(() => undefined);
    }
  }, [user, result]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/products/import", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    const data = await response.json();

    if (!response.ok) {
      showError(data.error ?? "Import failed");
      return;
    }

    setResult(data);
    showSuccess(data.message);
  }

  if (authLoading || user?.role !== "OWNER") {
    return <p className="font-mono-body text-sm text-muted">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        align="left"
        eyebrow="Owner"
        title="Import CSV catalog"
        italicWord="catalog"
        description="bulk import products from the challenge csv. valid rows go live immediately; rows with issues land in the owner approval queue."
      />

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <Button type="submit" variant="accent" disabled={!file || loading}>
              {loading ? "Importing..." : "Import CSV"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle>Import Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Imported: {result.imported}</Badge>
              <Badge variant="warning">Updated: {result.updated}</Badge>
              <Badge variant="warning">Pending review: {result.pendingReview}</Badge>
              <Badge variant="danger">Skipped: {result.skipped}</Badge>
            </div>
            {result.pendingReview > 0 ? (
              <p className="text-sm text-muted">
                {result.pendingReview} product(s) need fixes in{" "}
                <a href="/owner/approvals" className="underline">
                  owner approvals
                </a>
                .
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {logs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Imports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-black/5 p-3 text-sm">
                <p className="font-medium">{log.filename}</p>
                <p className="text-muted">
                  Imported {log.imported}, updated {log.updated}, skipped {log.skipped}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

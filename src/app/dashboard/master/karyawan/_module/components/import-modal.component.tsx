"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useKaryawanApi } from "@/lib/apis/employee/employee-hook";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Progress } from "./progress.component";

interface Props {
  close: () => void;
  onRefresh?: () => void;
}

export default function ImportEmployeeModalContent({ close, onRefresh }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { useImportEmployees, useImportProgress } = useKaryawanApi();
  const importMutation = useImportEmployees();
  const { data: progressData } = useImportProgress(jobId);

  useEffect(() => {
    if (!progressData) return;

    const payload: any = (progressData as any).data ?? progressData;

    const nextProgress = typeof payload.progress === "number" ? payload.progress : 0;
    const status: string | undefined = payload.status;

    setProgress(nextProgress);

    if (status === "completed") {
      queryClient.invalidateQueries({ queryKey: ["employee"] });

      onRefresh?.();

      toast({
        title: "Import selesai",
        description: "Data karyawan berhasil diimport.",
        variant: "success",
      });

      setIsUploading(false);
      close();
    }

    if (status === "failed") {
      toast({
        title: "Import gagal",
        description: payload.failedReason || "Terjadi kesalahan saat proses import.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  }, [progressData, close, onRefresh, queryClient]);

  const startUpload = async () => {
    if (!file) {
      toast({ title: "Pilih file terlebih dahulu", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const res: any = await importMutation.mutateAsync(file);
      const payload = res?.data ?? res;
      setJobId(payload.jobId);

      toast({
        title: "Upload berhasil",
        description: "Proses import sedang berjalan.",
      });
    } catch (err: any) {
      toast({
        title: "Gagal upload",
        description: err?.message || "Kesalahan saat mengupload file",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFile = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-5">
      {/* File picker */}
      <div className="space-y-2">
        <div
          className={`
          flex w-full items-center justify-between gap-3 rounded-md border border-dashed
          px-4 py-3 text-sm
          transition
          ${isUploading ? "opacity-60 cursor-not-allowed" : "hover:border-primary cursor-pointer"}
        `}
          onClick={handlePickFile}
        >
          <div className="flex flex-col">
            <span className="font-medium">
              {file ? file.name : "Pilih file CSV untuk diimport"}
            </span>
            <span className="text-xs text-muted-foreground">
              Hanya format <span className="font-medium">.csv</span>. Pastikan kolom sudah sesuai template.
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={isUploading}
            onClick={handlePickFile}
          >
            {file ? "Ganti File" : "Pilih File"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          disabled={isUploading}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Progress */}
      {(isUploading || progress > 0) && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress import</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          onClick={close}
          disabled={isUploading}
        >
          Batal
        </Button>
        <Button
          onClick={startUpload}
          disabled={isUploading || !file}
        >
          {isUploading ? "Memproses..." : "Mulai Import"}
        </Button>
      </div>
    </div>
  );
}

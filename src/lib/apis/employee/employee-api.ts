import { BaseApi } from "@/lib/apis/base";
import { CreateEmployee } from "./employee-schema";

export class KaryawanApi extends BaseApi {
  getKaryawans(params: PaginatedFilters) {
    return this.get<BasePaginatedApiResult<Karyawan[]>>({
      url: this.endpoints.employee,
      query: { ...this.getPaginatedQuery(params) } as Record<string, string>,
    });
  }

  createKaryawan(data: CreateEmployee) {
    return this.post<BaseApiResult<Karyawan>>({
      url: this.endpoints.employee,
      data,
    });
  }

  updateKaryawan(data: CreateEmployee & { id: string }) {
    return this.put<BaseApiResult<Karyawan>>({
      url: `${this.endpoints.employee}/${data?.id}`,
      data,
    });
  }

  deleteKaryawan(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.employee}/${id}`,
    });
  }

  importKaryawanCsv(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.post<{
      jobId: string;
      message: string;
    }>({
      url: `${this.endpoints.employee}/import`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  getImportProgress(jobId: string) {
    return this.get<{
      jobId: string;
      status:
      | "waiting"
      | "active"
      | "completed"
      | "failed"
      | "delayed"
      | "paused"
      | "not_found";
      progress: number;
      result?: unknown;
      failedReason?: string;
    }>({
      url: `${this.endpoints.employee}/import/${jobId}/progress`,
    });
  }

}

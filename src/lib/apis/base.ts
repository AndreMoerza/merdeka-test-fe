import { API_URL, ENDPOINTS } from "@/lib/apis/endpoints";
import { headerAuth } from "@/lib/apis/headerAuth";
import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";
import { stringify } from "qs";

export class BaseApi {
  protected axios: Axios;
  protected endpoints = ENDPOINTS;

  constructor(options: BaseApiOptions = {}) {
    const { baseURL = API_URL } = options;
    this.axios = axios.create({
      baseURL,
    });
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error instanceof AxiosError) {
          error.message =
            error?.response?.data?.error?.message ||
            "An error occured while intract with the server";
          if (typeof error.message === "object") {
            if ((error?.message as { message: string })?.message) {
              error.message = (error.message as { message: string }).message;
            } else {
              error.message = "An error occured while intract with the server";
            }
          }
        }
        return Promise.reject(error);
      },
    );
  }

  public serialize(params: Record<string, string>) {
    return stringify(params, { arrayFormat: "comma", skipNulls: true });
  }

  public getPaginatedQuery(filters: Partial<PaginatedFilters>) {
    return {
      limit: filters?.limit?.toString(),
      page: filters?.page?.toString(),
      search: filters?.search,
      populate: filters?.populate,
      sort: filters?.sort,
    };
  }

  async get<T>({
    url,
    headers,
    options,
    query,
    baseURL,
    useToken = true,
  }: {
    url: string;
    headers?: RawAxiosRequestHeaders;
    options?: AxiosRequestConfig;
    query?: Record<string, string>;
    baseURL?: string;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    if (query) {
      url = `${url}?${this.serialize(query)}`;
    }
    const response = await this.axios.get<T>(url, {
      headers,
      baseURL: baseURL || this.axios.defaults.baseURL,
      ...options,
    });
    return response.data;
  }

  async post<T, D = unknown>({
    url,
    data,
    headers,
    opts,
    useToken = true,
  }: {
    url: string;
    data?: D;
    headers?: RawAxiosRequestHeaders;
    opts?: AxiosRequestConfig;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.post<D, AxiosResponse<T>>(url, data, {
      headers,
      ...opts,
    });
    return response.data;
  }

  async put<T, D = unknown>({
    url,
    data,
    headers,
    useToken = true,
  }: {
    url: string;
    data: D;
    headers?: RawAxiosRequestHeaders;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.put<D, AxiosResponse<T>>(url, data, {
      headers,
    });
    return response.data;
  }

  async delete<T>({
    url,
    headers,
    useToken = true,
  }: {
    url: string;
    headers?: RawAxiosRequestHeaders;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.delete<T>(url, {
      headers,
    });
    return response.data;
  }

  async patch<T, D>({
    url,
    data,
    headers,
    useToken = true,
  }: {
    url: string;
    data: D;
    headers?: RawAxiosRequestHeaders;
    useToken?: boolean;
  }): Promise<T> {
    headers = await headerAuth(headers, useToken);
    const response = await this.axios.patch<T>(url, data, {
      headers,
    });
    return response.data;
  }
}

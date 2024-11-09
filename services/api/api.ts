import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_TIMEOUT, baseUrl } from "./constants";
import useStorage from "@/services/storage/useStorage";

export enum ResponseStatus {
  Success = "SUCCESS",
  Error = "ERROR",
}

const api: AxiosInstance = axios.create({
  baseURL: baseUrl, // Set your API base URL
  timeout: API_TIMEOUT, // Set a timeout for requests
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const { getLocalStorage } = useStorage("token");

    const authToken = getLocalStorage();

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = "application/json";
    config.headers["X-App"] = "field-app";

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can modify the response data here
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

// Success response interface

interface SuccessResponseRQ<T> {
  data: T;
}

interface ErrorResponseRQ {
  error: string;
}

interface detailsProps {
  field: string;
  message: string;
}

// Union type for both success and error responses
export type ApiResponse<T> = SuccessResponseRQ<T> | ErrorResponseRQ;
export type ApiResponseRQ<T> = SuccessResponseRQ<T> | ErrorResponseRQ;

const handleApiErrorThrowRequests = (error: any) => {
  switch (error.response.status) {
    case 400:
      throw new Error(error.response.data.error.message);
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("Something went wrong. Please try again later.");
  }
};

export const getApiRQ = async <T = any>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse = await api.get<T>(url);
    return response.data.data;
  } catch (error: any) {
    handleApiErrorThrowRequests(error);
    return undefined as T;
  }
};

export const postApiRQ = async <T = any, P = any>(
  url: string,
  data: P
): Promise<T> => {
  try {
    const response: AxiosResponse = await api.post<T>(url, data);
    return response.data.data;
  } catch (error: any) {
    if (error.response.status === 500) {
      throw new Error("Internal Server Error");
    }

    throw new Error(error.response.data.error);
  }
};

export const patchApiRQ = async <T = any, P = any>(
  url: string,
  data: P
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await api.patch<T>(url, data);
    return response.data.data;
  } catch (error: any) {
    if (error.response.status === 500) {
      throw new Error("Internal Server Error");
    }

    throw new Error(error.response.data.error);
  }
};

const getApi = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await api.get<T>(url);

    return {
      data: response.data.data,
    };
  } catch (error: any) {
    console.log({
      error,
    });

    return error.response.data;
  }
};

const postApi = async <T = any, P = any>(
  url: string,
  data: P
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await api.post<T>(url, data);

    return {
      data: response.data.data,
    };
  } catch (error: any) {
    // Handle error as needed

    return error.response.data;
  }
};

const patchApi = async <T = any, P = any>(
  url: string,
  data: P
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await api.patch<T>(url, data);

    return {
      data: response.data.data,
    };
  } catch (error: any) {
    console.log({ error });
    // Handle error as needed
    return error.response.data;
  }
};

const putApi = async <T = any, P = any>(
  url: string,
  data: P
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await api.put<T>(url, data);

    return {
      data: response.data.data,
    };
  } catch (error: any) {
    return error.response.data;
  }
};

export { getApi, postApi, patchApi, putApi, api };

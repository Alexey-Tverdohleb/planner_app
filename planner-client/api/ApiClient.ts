interface IApiClientOptions extends RequestInit {
  body?: BodyInit | null;
}

type RequestInterceptor = (
  options: IApiClientOptions,
) => IApiClientOptions | Promise<IApiClientOptions>;

type ResponseInterceptor<T> = (response: T) => T | Promise<T>;

type ErrorInterceptor = (error: Error) => void | Promise<void>;

class ApiClient {
  private readonly baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor<any>[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseApiUrl?: string) {
    this.baseUrl =
      baseApiUrl ||
      process.env.REACT_APP_BASE_API_URL ||
      "http://localhost:3001";

    if (!this.baseUrl) {
      throw new Error("Base API URL is not configured");
    }
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor<any>): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  private async applyRequestInterceptors(
    options: IApiClientOptions,
  ): Promise<IApiClientOptions> {
    let interceptedOptions = options;
    for (const interceptor of this.requestInterceptors) {
      interceptedOptions = await interceptor(interceptedOptions);
    }
    return interceptedOptions;
  }

  private async applyResponseInterceptors<T>(response: T): Promise<T> {
    let interceptedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      interceptedResponse = await interceptor(interceptedResponse);
    }
    return interceptedResponse;
  }

  private async applyErrorInterceptors(error: Error): Promise<void> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: IApiClientOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;

    // Apply request interceptors
    const interceptedOptions = await this.applyRequestInterceptors(options);

    const defaultOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...interceptedOptions,
        headers: {
          ...defaultOptions.headers,
          ...interceptedOptions.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();

      // Apply response interceptors
      return await this.applyResponseInterceptors(data);
    } catch (error) {
      // Apply error interceptors
      await this.applyErrorInterceptors(error as Error);
      throw error;
    }
  }

  get<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
    const url = queryParams
      ? this.appendQueryParams(endpoint, queryParams)
      : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  upload<T>(endpoint: string, files: File | File[]): Promise<T> {
    const formData = new FormData();
    const data = Array.isArray(files) ? files : [files];

    data.forEach((file, index) => formData.append(`file-${index + 1}`, file));

    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {},
    });
  }

  private appendQueryParams(
    url: string,
    params: Record<string, string>,
  ): string {
    const query = new URLSearchParams(params).toString();
    return query ? `${url}?${query}` : url;
  }
}

export default ApiClient;

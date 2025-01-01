interface IApiClientOptions extends RequestInit {
  body?: BodyInit | null;
}

const appendQueryParams = (
  url: string,
  params: Record<string, string>,
): string => {
  const query = new URLSearchParams(params).toString();
  return query ? `${url}?${query}` : url;
};

const baseClient = async <T>(
  endpoint: string,
  options: IApiClientOptions = {},
): Promise<T> => {
  const baseUrl = process.env.REACT_APP_BASE_API_URL || "http://localhost:3001";

  if (!baseUrl) {
    throw new Error("Base API URL is not configured");
  }

  const url = `${baseUrl}/${endpoint}`;

  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  return await response.json();
};

const getRequest = async <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
): Promise<T> => {
  const url = queryParams ? appendQueryParams(endpoint, queryParams) : endpoint;

  return await baseClient(url, {
    method: "GET",
  });
};

const postRequest = async <T>(
  endpoint: string,
  data: Record<string, unknown>,
): Promise<T> => {
  return await baseClient(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

const putRequest = async <T>(
  endpoint: string,
  data: Record<string, unknown>,
): Promise<T> => {
  return await baseClient(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

const patchRequest = async <T>(
  endpoint: string,
  data: Record<string, unknown>,
): Promise<T> => {
  return await baseClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

const uploadRequest = async <T>(
  endpoint: string,
  files: File | File[],
): Promise<T> => {
  const formData = new FormData();
  const data = Array.isArray(files) ? files : [files];

  data.forEach((file, index) => formData.append(`file-${index + 1}`, file));

  return await baseClient(endpoint, {
    method: "POST",
    body: formData,
    headers: {},
  });
};

export { getRequest, postRequest, putRequest, patchRequest, uploadRequest };

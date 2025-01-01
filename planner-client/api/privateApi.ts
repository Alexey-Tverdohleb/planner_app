import ApiClient from "@/api/ApiClient";
import { getAccessToken } from "@/helpers/authToken";

const privateApi: ApiClient = new ApiClient();

privateApi.addRequestInterceptor((options) => {
  const accessToken = getAccessToken();

  return accessToken
    ? {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
      }
    : options;
});

privateApi.addErrorInterceptor((error) => {
  console.error(error);

  throw error;
});

export default privateApi;

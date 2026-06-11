import { serverFetch, serverMutation } from "../Server";

export const addOrganization = async (data) => {
  const res = await serverMutation("/api/organizations", "POST", data);
  return res;
};

export const getMyOrganization = async (email) => {
  const res = await serverFetch(
    `/api/organizations?email=${encodeURIComponent(email)}`
  );

  return res;
};
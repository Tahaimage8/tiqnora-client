import { serverMutation } from "../Server";

export const addOrganization = async (data) => {
  const res = await serverMutation("/api/organizations", "POST", data);
  return res;
};
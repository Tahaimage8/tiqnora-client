import { serverFetch, serverMutation } from "../Server";



export const addEvent = async (data) => {
  const res = await serverMutation("/api/events", "POST", data);
  return res;
};

export const getMyEvent = async (email) => {
  const res = await serverFetch(
    `/api/organizations?email=${encodeURIComponent(email)}`
  );

  return res;
};

export const updateEvent = async (id, data) => {
  const res = await serverMutation(`/api/organizations/${id}`, "PATCH", data);
  return res;
};

export const deleteEvent = async (id, organizerEmail) => {
  const res = await serverMutation(`/api/organizations/${id}`, "DELETE", {
    organizerEmail,
  });

  return res;
};
import { BaseURL } from "./BaseUrl";

export const serverMutation = async (path, method, data) => {
  const res = await fetch(`${BaseURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Request failed.");
  }

  return result;
};

export const serverFetch = async (path) => {
  const res = await fetch(`${BaseURL}${path}`);

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Request failed.");
  }

  return result;
};
import { BaseURL } from "./BaseUrl";

export const serverMutation = async (path, method, data) => {
  const res = await fetch(`${BaseURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const serverFetch = async (path) => {
  const res = await fetch(`${BaseURL}${path}`);
  return res.json();
};
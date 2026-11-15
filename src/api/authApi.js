import { apiClient } from "./axiosConfig";

let csrfToken;

async function getCsrfToken() {
  const response = await apiClient.get("/auth/csrf");
  csrfToken = response.data.token;
  return csrfToken;
}

async function postWithCsrf(path, body) {
  const token = await getCsrfToken();
  const response = await apiClient.post(path, body, {
    headers: { "X-XSRF-TOKEN": token },
  });
  csrfToken = undefined;
  return response.data;
}

export async function registerAccount(account) {
  return postWithCsrf("/auth/register", account);
}

export async function login(username, password) {
  return postWithCsrf("/auth/login", { username, password });
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");
  return response.data;
}

export async function logout() {
  await postWithCsrf("/auth/logout");
}
import { apiClient } from "./axiosConfig";

export function formatShowDateTime(value, options = {}) {
  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T12:00:00`
    : value;
  const timestamp = Date.parse(normalizedValue);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  }).format(timestamp);
}

export function formatShowTime(value) {
  return formatShowDateTime(value, {
    day: undefined,
    month: undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShowDate(value) {
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T12:00:00`
    : value;
  const timestamp = Date.parse(dateValue);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

function requireArray(data, endpoint) {
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected response from ${endpoint}`);
  }

  return data;
}

function normalizeShow(show) {
  if (!show || !Number.isInteger(Number(show.showDetailId)) || !show.showName) {
    throw new Error("The show service returned an invalid show record.");
  }

  return {
    id: Number(show.showDetailId),
    showId: show.showId,
    title: show.showName,
    durationMinutes: Number(show.showDuration) || null,
    host: show.showHost || "Cinema",
    startsAt: show.showStartTime,
    endsAt: show.showEndTime,
    image: show.posterURL || null,
  };
}

export async function getListedShows() {
  const response = await apiClient.get("/findAllListedShows");

  return requireArray(response.data, "/findAllListedShows").map(normalizeShow);
}

export async function getFutureListedShows() {
  const response = await apiClient.get("/findAllFutureListedShows");

  return requireArray(response.data, "/findAllFutureListedShows").map(normalizeShow);
}
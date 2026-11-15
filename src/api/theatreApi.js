import { apiClient } from "./axiosConfig";

function requireArray(data, endpoint) {
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected response from ${endpoint}`);
  }

  return data;
}

export async function getTheatresByCity(city) {
  const response = await apiClient.get(
    `/theatres/city/${encodeURIComponent(city)}`
  );

  return requireArray(response.data, "/theatres/city/{city}");
}

export async function getHallsForTheatre(theatreId) {
  const response = await apiClient.get(
    `/theatre-hall-mapping/theatre/${theatreId}`
  );
  const mappings = requireArray(
    response.data,
    "/theatre-hall-mapping/theatre/{theatreId}"
  );

  return Promise.all(
    mappings
      .filter((mapping) => mapping.isActive)
      .map(async (mapping) => {
        const hallResponse = await apiClient.get(`/halls/${mapping.hallId}`);

        return hallResponse.data;
      })
  );
}

export async function getShowsForHall(hallId) {
  const response = await apiClient.get(`/hall-show-mapping/hall/${hallId}`);

  return requireArray(response.data, "/hall-show-mapping/hall/{hallId}");
}

export async function getTheatresForShow(showDetailId, city) {
  const theatres = await getTheatresByCity(city);
  const theatreResults = await Promise.all(
    theatres
      .filter((theatre) => theatre.isActive)
      .map(async (theatre) => {
        const halls = await getHallsForTheatre(theatre.theatreDetailId);
        const matchingHalls = await Promise.all(
          halls
            .filter((hall) => hall.isActive)
            .map(async (hall) => {
              const showMappings = await getShowsForHall(hall.hallDetailsId);
              const hasShow = showMappings.some(
                (mapping) =>
                  mapping.isActive &&
                  Number(mapping.showDetailId) === Number(showDetailId)
              );

              return hasShow ? { ...theatre, hall } : null;
            })
        );

        return matchingHalls.filter(Boolean);
      })
  );

  return theatreResults.flat();
}

export async function getSeatsForHall(hallId) {
  const response = await apiClient.get(`/hall-seats/hall/${hallId}`);

  return requireArray(response.data, "/hall-seats/hall/{hallId}").filter(
    (seat) => seat.isActive
  );
}
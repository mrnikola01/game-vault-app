import api from "./client";

export const getGames = async (search = "", ordering = "") => {
  let endpoint = "/games/";
  const params = new URLSearchParams();
  
  if (search) params.append("search", search);
  if (ordering) params.append("ordering", ordering);
  
  const queryString = params.toString();
  if (queryString) endpoint += `?${queryString}`;
  
  return api(endpoint);
};

export const getGameBySlug = async (slug) => {
  return api(`/games/${slug}/`);
};

export const addFavorite = async (gameId) => {
  return api("/favorites/", {
    body: { game: gameId },
  });
};

export const removeFavorite = async (favoriteId) => {
  return api(`/favorites/${favoriteId}/`, {
    method: 'DELETE',
  });
};

export const getFavorites = async () => {
  return api("/favorites/");
};

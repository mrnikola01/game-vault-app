import api from "./client";

export const getGames = async (search = "") => {
  const endpoint = search ? `/games/?search=${search}` : "/games/";
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

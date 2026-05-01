import api from './client';

export const getReviews = () => api('/reviews/');

export const addReview = (gameId, isLike, comment) => 
    api('/reviews/', {
        body: {
            game: gameId,
            is_like: isLike,
            comment: comment
        }
    });

export const deleteReview = (reviewId) => 
    api(`/reviews/${reviewId}/`, {
        method: 'DELETE'
    });

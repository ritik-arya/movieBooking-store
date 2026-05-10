import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinemax_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cinemax_token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const register       = (d) => api.post('/auth/register', d);
export const login          = (d) => api.post('/auth/login', d);
export const getMe          = ()  => api.get('/auth/me');
export const updateProfile  = (d) => api.put('/auth/profile', d);

export const getMovies      = (p) => api.get('/movies', { params: p });
export const getMovie       = (id) => api.get(`/movies/${id}`);

export const getShowtimes   = (p) => api.get('/showtimes', { params: p });
export const getShowtime    = (id) => api.get(`/showtimes/${id}`);

export const createBooking  = (d) => api.post('/bookings', d);
export const getMyBookings  = ()  => api.get('/bookings/my');
export const cancelBooking  = (id) => api.post(`/bookings/${id}/cancel`);

export default api;

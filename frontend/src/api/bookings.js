import axiosClient from "./axiosClient";

export const createBooking = (vehicleId, startDate, endDate) => {
  return axiosClient.post("/bookings/", {
    vehicle_id: vehicleId,
    start_date: startDate,
    end_date: endDate,
  });
};

export const getMyBookings = () => {
  return axiosClient.get("/bookings/my-bookings");
};

export const getBookingById = (id) => {
  return axiosClient.get(`/bookings/${id}`);
};

export const cancelBooking = (id) => {
  return axiosClient.post(`/bookings/${id}/cancel`);
};
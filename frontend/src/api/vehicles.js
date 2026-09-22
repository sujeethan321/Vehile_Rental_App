import axiosClient from "./axiosClient";

export const getVehicles = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  return axiosClient.get(`/vehicles/?${params.toString()}`);
};

export const getVehicleById = (id) => {
  return axiosClient.get(`/vehicles/${id}`);
};

export const getCategories = () => {
  return axiosClient.get("/categories/");
};
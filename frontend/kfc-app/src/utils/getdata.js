import api from "./api";

export const getdata = async (url) => {
  const response = await api.get(url);
  return response.data;
};

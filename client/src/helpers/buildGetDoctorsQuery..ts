import { getDoctorsQuery } from "../types/doctor/doctor.types";

export const buildGetDoctorsQuery = (query: getDoctorsQuery) => {
  const params = new URLSearchParams();

  if (query.specialization) params.append("spec", query.specialization);
  if (query.search) params.append("search", query.search);
  if (query.gender) params.append("gender", query.gender);
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.page) params.append("page", query.page.toString());

  return params.toString();
};

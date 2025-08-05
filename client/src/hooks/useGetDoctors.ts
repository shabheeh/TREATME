import { useEffect, useState } from "react";
import { getDoctorsQuery, IDoctor } from "../types/doctor/doctor.types";
import doctorService from "../services/doctor/doctorService";

export const useGetDoctors = (query: getDoctorsQuery) => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, [
    query.gender,
    query.specialization,
    query.search,
    query.page,
    query.limit,
  ]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      setLoading(true);
      const response = await doctorService.getDoctors(query);
      setDoctors(response.doctors);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return {
    doctors,
    loading,
    error,
  };
};

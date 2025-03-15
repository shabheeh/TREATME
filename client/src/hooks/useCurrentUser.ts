import { useSelector } from "react-redux";
import { RootState } from "../redux/app/store";

const useCurrentUser = () => {
  const doctor = useSelector((state: RootState) => state.user.admin);
  const admin = useSelector((state: RootState) => state.user.doctor);
  const patient = useSelector((state: RootState) => state.user.patient);

  return patient || admin || doctor;
};

export default useCurrentUser;

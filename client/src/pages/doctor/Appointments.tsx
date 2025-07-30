import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import {
  CustomTabs,
  TabPanel,
} from "../../components/basics/appointments/AppointmentTabs";
import Upcoming from "../../components/basics/appointments/Upcoming";
import { toast } from "sonner";
import appointmentService from "../../services/appointment/appointmentService";
import { IAppointmentPopulated } from "../../types/appointment/appointment.types";
import { RootState } from "../../redux/app/store";
import { useSelector } from "react-redux";
import Loading from "../../components/basics/ui/Loading";
import dayjs from "dayjs";

const Appointments = () => {
  const [value, setValue] = useState(0);
  const doctor = useSelector((state: RootState) => state.user.doctor);
  const [appointments, setAppointments] = useState<
    IAppointmentPopulated[] | []
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      if (!doctor) return;
      const appointments = await appointmentService.getAppointmentsForUser(
        doctor._id
      );
      setAppointments(appointments);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Someting went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctor]);

  const now = dayjs();

  const upcoming = appointments.filter((appointment) => {
    const appointmentTime = dayjs(appointment.date).add(
      appointment.duration,
      "minute"
    );
    return appointment.status === "confirmed" && appointmentTime.isAfter(now);
  });
  const completed = appointments
    .filter((appointment) => appointment.status === "completed")
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabContent = [
    {
      title: "Upcoming",
      component: (
        <Upcoming appointments={upcoming} onReschedule={fetchAppointments} />
      ),
    },
    {
      title: "Completed",
      component: (
        <Upcoming appointments={completed} onReschedule={fetchAppointments} />
      ),
    },
  ];

  return (
    <Card sx={{ px: 0, boxShadow: 0 }}>
      <CustomTabs
        value={value}
        onChange={handleChange}
        tabContent={tabContent}
      />
      {tabContent.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {loading ? <Loading /> : tab.component}
        </TabPanel>
      ))}
    </Card>
  );
};

export default Appointments;

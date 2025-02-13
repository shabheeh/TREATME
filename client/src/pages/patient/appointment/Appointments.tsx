import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import { CustomTabs, TabPanel } from '../../../components/basics/AppointmentTabs'; 
import Upcoming from '../../../components/patient/appointments/Upcoming';
import { toast } from 'sonner';
import appointmentService from '../../../services/appointment/appointmentService';
import { IAppointmentPopulated } from '../../../types/appointment/appointment.types';
import { RootState } from '../../../redux/app/store';
import { useSelector } from 'react-redux';



 



const Appointments = () => {
    const [value, setValue] = useState(0);
    const currnetPatient = useSelector((state: RootState) => state.user.currentUser)
    const [appointments, setAppointments] = useState<IAppointmentPopulated[] | []>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!currnetPatient) return
        const fetchAppointments = async () => {
            try {
                const appointments = await appointmentService.getAppointmentsForUser(currnetPatient._id)
                setAppointments(appointments)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Someting went wrong")
            }finally {
                setLoading(false)
            }
        }
        fetchAppointments()
    }, [currnetPatient])

    const upcoming = appointments.filter(appointment => appointment.status === 'confirmed')
    // const requested = appointments.filter(appointment => appointment.status === 'requested')
    // const completed = appointments.filter(appointment => appointment.status === 'completed')

    console.log(appointments)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabContent = [
    {
        title: 'Upcoming',
        component: <Upcoming appointments={upcoming} />,
    },
    {
        title: 'Requested',
        component: <div>tab 2</div>,
    },
    {
        title: 'Completed',
        component: <div>tab 3</div>,
    },
  ];


  return (
    <Card sx={{ boxShadow: 0 }}>
      <CustomTabs value={value} onChange={handleChange} tabContent={tabContent} />
      {tabContent.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Card>
  );
};

export default Appointments;
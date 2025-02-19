import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Link,
  Grid,
  styled,
  Divider,
  Button
} from '@mui/material';
import { formatMonthDay, formatTime, getDayName } from '../../utils/dateUtils';
import { IDaySchedule, IDoctor } from '../../types/doctor/doctor.types';
import { filterAvailability } from '../../helpers/filterAvailability';
import RequestModal from './appointments/RequestModal';





export const TimeChip = styled(Chip)(({ theme }) => ({
  borderRadius: '50px',
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'transparent',
  }
}));


interface ProviderCardProps {
  doctor: IDoctor;
  availability: IDaySchedule[];
  handleSlotClick: (doctor: IDoctor, dayId: string, slotId: string, date: Date ) => void
};


const DoctorCard: React.FC<ProviderCardProps> = ({ doctor, availability, handleSlotClick }) => {

  const [filteredAvailability, setFilteredAvailability] = useState<IDaySchedule[]>(availability);
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setFilteredAvailability(filterAvailability(availability));
  }, [availability]);

  return (
<>

<Card
  sx={{
    maxWidth: "100%",
    border: "1px solid",
    borderColor: "teal",
    boxShadow: "none",
    minHeight: 200,
    padding: { xs: 1, sm: 2 },
  }}
>
  <CardContent
    sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 0 }, p: 2 }}
  >
    <Box sx={{ display: "flex", gap: 2, flex: 1, }}>
      <Avatar
        src={doctor.profilePicture}
        sx={{
          width: { xs: 50, sm: 70 },
          height: { xs: 50, sm: 70 },
        }}
      />
      <Box>
        <Link
          href={`/doctors/${doctor._id}`}
          underline="hover"
          sx={{
            color: "primary.main",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            fontWeight: 500,
            display: "block",
            mb: 0.5,
          }}
        >
          Dr. {doctor.firstName} {doctor.lastName}
        </Link>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ fontSize: { xs: "12px", sm: "14px" }, color: "GrayText" }}>
            {doctor.specialties.join(" ")}
          </Typography>
          <Typography color="text.secondary">
            {doctor.experience}
          </Typography>
        </Box>
      </Box>
    </Box>

          <Divider sx={{ display: { xs: 'block', sm: 'none'}}} />

    <Box
      sx={{
        textAlign: "right",
        minWidth: { xs: "100%", sm: 330 },
        flexShrink: 0,
        mt: { xs: 2, sm: 0 }, 
      }}
    >
      <Grid container spacing={1}>
        {filteredAvailability &&
          filteredAvailability.slice(0, 2).map((day, index) => (
            <Grid
              item
              xs={12}
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 80,
              }}
            >
              <Grid
                container
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Grid item>
                  <Typography
                    component="span"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "10px", sm: "12px" },
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {getDayName(day.date)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    component="span"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "10px", sm: "12px" } }}
                  >
                    {formatMonthDay(day.date)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container direction="row" spacing={1}>
                {day.slots.slice(0, 3).map(
                  (slot, slotIndex) =>
                    !slot.isBooked && (
                      <Grid item key={slotIndex} xs={4} sm={3} >
                        <TimeChip
                          label={formatTime(slot.startTime)}
                          size="small"
                          onClick={() =>
                            handleSlotClick(
                              doctor,
                              day._id!,
                              slot._id!,
                              slot.startTime!
                            )
                          }
                          sx={{
                            ":hover": {
                              backgroundColor: "teal",
                              color: "white",
                            },
                          }}
                        />
                      </Grid>
                    )
                )}

                {day.slots.length > 3 && (
                  <Grid item xs={3}>
                    <Link
                      sx={{ color: "primary.main", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      onClick={() => setModalOpen(true)}
                    >
                      {`+${day.slots.length - 3} more`}
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          onClick={() => setModalOpen(true)}
          sx={{
            color: "primary.main",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            display: "inline-block",
            ":hover": { textDecoration: 'underline'}
          }}
        >
          View Full Availability
        </Button>
      </Box>
    </Box>
  </CardContent>
</Card>

<RequestModal
  open={isModalOpen}
  onClose={() => setModalOpen(false)}
  availability={filteredAvailability}
  doctor={doctor}
  handleSlotClick={handleSlotClick}
/>

</>
  );
};


export default DoctorCard;
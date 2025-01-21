import { Button, Box, Typography, Grid, Skeleton } from "@mui/material";
import SpecializationCard from "../../components/admin/SpecializationCard";
import { useEffect, useState } from "react";
import { ISpecialization } from "../../types/specialization/specialization.types";
import specializationService from "../../services/admin/specializationService";
import { toast } from "sonner";

const Specializations = () => {
  const [specializations, setSpecializations] = useState<ISpecialization[] | null>(null);
  const [loading, setLoading] = useState(false);


  console.log(specializations)

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const result = await specializationService.getSpecializations();
        setSpecializations(result);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Specializations
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component="a"
          href="/admin/add-specialization"
          sx={{
            textTransform: "none",
            textDecoration: "none",
          }}
        >
          Add Specialization
        </Button>
      </Box>
      <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => ( 
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box sx={{ height: 400, boxShadow: "initial" }}>
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={170}
                    animation="pulse"
                  />
 
                    <Skeleton sx={{ my: 1}}
                      variant="text"
                      width="60%"
                      height={30}
                      animation="pulse"
                    />
                    <Skeleton 
                      variant="text"
                      width="80%"
                      height={20}
                      animation="pulse"
                    />
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={20}
                      animation="pulse"
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={20}
                      animation="pulse"
                    />

                    <Skeleton sx={{my: 5}}
                      variant="text"
                      width="20%"
                      height={20}
                      animation="pulse"
                    />
                    <Skeleton sx={{mx: 'auto', alignSelf: "center", mt: 3}}
                      variant="rounded"
                      width="90%"
                      height={30}
                      animation="pulse"
                    />
                </Box>
                  

              </Grid>
            ))
          : specializations?.map((specialization) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={specialization._id}>
                <SpecializationCard
                  name={specialization.name}
                  description={specialization.description}
                  note={specialization.note}
                  fee={specialization.fee}
                  image={specialization.image}
                />
              </Grid>
            ))}
      </Grid>
    </Box>
    </>
  );
};

export default Specializations;

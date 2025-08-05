import { Button, Box, Typography, Grid, Skeleton } from "@mui/material";
import SpecializationCard from "../../components/basics/SpecializationCard";
import { useEffect, useState } from "react";
import { ISpecialization } from "../../types/specialization/specialization.types";
import specializationService from "../../services/specialization/specializationService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Specializations = () => {
  const [specializations, setSpecializations] = useState<
    ISpecialization[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

        {specializations?.length !== 0 && (
          <Button
            onClick={() => navigate("/admin/specializations/add")}
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              textDecoration: "none",
            }}
          >
            Add Specialization
          </Button>
        )}
      </Box>
      <Box sx={{ padding: 2, border: "1px solid", borderColor: "grey.300" }}>
        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box sx={{ height: 400, boxShadow: "initial" }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={170}
                    animation="pulse"
                  />
                  <Skeleton
                    sx={{ my: 1 }}
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
                  <Skeleton
                    sx={{ my: 5 }}
                    variant="text"
                    width="20%"
                    height={20}
                    animation="pulse"
                  />
                  <Skeleton
                    sx={{ mx: "auto", alignSelf: "center", mt: 3 }}
                    variant="rounded"
                    width="90%"
                    height={30}
                    animation="pulse"
                  />
                </Box>
              </Grid>
            ))
          ) : specializations?.length === 0 ? (
            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                py={10}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No specializations found.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Click the button below to add a new specialization.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component="a"
                  href="/admin/specializations/add"
                  sx={{ mt: 3, textTransform: "none" }}
                >
                  Add Specialization
                </Button>
              </Box>
            </Grid>
          ) : (
            specializations?.map((specialization) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={specialization._id}>
                <SpecializationCard
                  id={specialization._id}
                  name={specialization.name}
                  description={specialization.description}
                  note={specialization.note}
                  fee={specialization.fee}
                  image={specialization.image}
                  duration={specialization.durationInMinutes}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Specializations;

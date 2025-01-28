import React, { useState, useEffect} from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Divider,
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { IDependent } from '../../types/patient/patient.types';
import { calculateAge } from '../../helpers/ageCalculator';
import dependentService from '../../services/dependent/dependentService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/app/store';
import { toast } from 'sonner';
import DeleteDependentModal from './DeleteDependentModal';
import { setCurrentPatient } from '../../redux/features/user/userSlice';


interface FamilyMembersProps {
  changeCurrentState: () => void;
}

const FamilyMembers: React.FC<FamilyMembersProps> = ({ changeCurrentState }) => {

  const [dependents, setDependents] = useState<IDependent[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dependentId, setDependentId] = useState<string | null>(null); 

  const dispatch = useDispatch()

  const patient = useSelector((state: RootState) => state.user.patient);
  const currentPatient = useSelector((state: RootState) => state.user.currentUser)



  useEffect(() => {
    const fetchDependents = async () => {
      try {
        setLoading(true);
        if (!patient) {
          throw new Error("Something went wrong");
        }
        const result = await dependentService.getDependents(patient._id);
        setDependents(result);
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
    fetchDependents();
  }, [patient]);

  const handleDelete = async () => {
    try {
      if (!dependentId) return;

      await dependentService.deleteDependent(dependentId); 

      setDependents((prev) => prev.filter((dep) => dep._id !== dependentId)); 
      toast.success("Dependent deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setOpen(false);
      setDependentId(null); 
    }
  };

  const handleRemoveClick = (id: string) => {
    setDependentId(id); 
    setOpen(true); 
  };

  const handleSwitchUser = (dependentId?: string) => {
      if(dependentId) {
         const dependent = dependents.find(dependent => dependent._id === dependentId)
        dispatch(setCurrentPatient(dependent!))

      }else {
        if(!patient) return
        dispatch(setCurrentPatient(patient))
      }
      
      
  };

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%", position: "relative" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="30%" />
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 2,
                    }}
                  >
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="30%" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} key={patient?._id}>
              <Card sx={{ height: "100%", position: "relative" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar src={patient?.profilePicture || ""}>
                        {patient?.firstName[0]}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {patient?.firstName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Primary Account Holder
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Age: { patient?.dateOfBirth ? calculateAge(patient?.dateOfBirth) : ''}
                        </Typography>
                      </Box>
                    </Box>
                    { currentPatient?._id === patient?._id && <Typography
                      variant="body2"
                      sx={{
                        color: "green",
                        position: "absolute",
                        top: 16,
                        right: 16,
                      }}
                    >
                      Active
                    </Typography> }
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 2,
                    }}
                  >
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleSwitchUser()}
                    >
                      Switch User
                    </Button>
                    
                  </Box>
                </CardContent>
              </Card>
            </Grid>
        {dependents.length > 0 &&
          dependents.map((dependent) => (
            <Grid item xs={12} sm={6} md={4} key={dependent._id}>
              <Card sx={{ height: "100%", position: "relative" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar src={dependent.profilePicture || ""}>
                        {dependent.firstName[0]}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {dependent.firstName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dependent.relationship}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Age: {calculateAge(dependent.dateOfBirth)}
                        </Typography>
                      </Box>
                    </Box>
                    { currentPatient?._id === dependent._id && <Typography
                      variant="body2"
                      sx={{
                        color: "green",
                        position: "absolute",
                        top: 16,
                        right: 16,
                      }}
                    >
                      Active
                    </Typography> }
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 2,
                    }}
                  >
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleSwitchUser(dependent._id)}
                    >
                      Switch User
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => handleRemoveClick(dependent._id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <Button sx={{ width: "100%" }} onClick={changeCurrentState}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    my: 3,
                  }}
                >
                  <AddIcon fontSize="large" />
                  <Typography variant="body1" color="text.secondary">
                    Add Dependent
                  </Typography>
                </Box>
              </CardContent>
            </Button>
          </Card>
        </Grid>
      </Grid>
      <DeleteDependentModal
        open={open}
        handleClose={() => setOpen(false)}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default FamilyMembers;

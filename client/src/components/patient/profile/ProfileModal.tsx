import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  MdClose,
  MdManageAccounts,
  MdLogout,
  MdHelpOutline,
} from "react-icons/md";
import { RootState } from "../../../redux/app/store";
import authServicePatient from "../../../services/patient/authService";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IDependent, IPatient } from "../../../types/patient/patient.types";
import { setCurrentPatient } from "../../../redux/features/user/userSlice";
import dependentService from "../../../services/dependent/dependentService";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {
  const currentPatient = useSelector((state: RootState) => state.user.currentUser);
  const [dependents, setDependents] = useState<IDependent[]>([]);
  const patient = useSelector((state: RootState) => state.user.patient);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await authServicePatient.signOut();
      navigate('/signin');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const isDependent = (user: IDependent | IPatient): user is IDependent => {
    return 'relationship' in user;
  };

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

  const handleSwitchUser = (user: IDependent | IPatient) => {
    dispatch(setCurrentPatient(user));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "24px",
          width: "100%",
          maxWidth: "400px",
          margin: "16px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          px: 3,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Switch Profile
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            p: 1,
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "grey.100",
            },
          }}
        >
          <MdClose className="h-5 w-5 text-gray-600" />
        </IconButton>
      </Box>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: 0, py: 2 }}>
          {/* Primary User Profile */}
          <ListItemButton
            onClick={() => handleSwitchUser(patient)}
            sx={{
              px: 4,
              py: 2,
              "&:hover": {
                bgcolor: "grey.50",
              },
              transition: "background-color 0.2s",
              cursor: "pointer",
            }}
          >
            <Avatar
              src={currentPatient?.profilePicture ? currentPatient.profilePicture : "/api/placeholder/48/48"}
              alt={currentPatient?.firstName}
              sx={{
                width: 48,
                height: 48,
                mr: 2,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "grey.800",
                }}
              >
                {patient?.firstName} {patient?.lastName}
              </Typography>
              <Typography
                sx={{
                  color: "grey.500",
                  fontSize: "0.875rem",
                }}
              >
                Primary Account Holder
              </Typography>
            </Box>
          </ListItemButton>
          {/* Dependents Profile */}
          {loading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <ListItem key={index} sx={{ px: 4, py: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                  <Box>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </ListItem>
              ))}
            </>
          ) : (
            dependents
              .filter(dependent => dependent._id !== currentPatient?._id) // Filter out the current patient if they are a dependent
              .map(dependent => (
                <ListItemButton
                  key={dependent._id}
                  onClick={() => handleSwitchUser(dependent)}
                  sx={{
                    px: 4,
                    py: 2,
                    "&:hover": {
                      bgcolor: "grey.50",
                    },
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    src={dependent?.profilePicture ? dependent.profilePicture : "/api/placeholder/48/48"}
                    alt={dependent?.firstName}
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "grey.800",
                      }}
                    >
                      {dependent?.firstName} {dependent?.lastName}
                    </Typography>
                    <Typography
                      sx={{
                        color: "grey.500",
                        fontSize: "0.875rem",
                      }}
                    >
                      {dependent && isDependent(dependent) ? dependent.relationship : 'Primary Account Holder'}
                    </Typography>
                  </Box>
                </ListItemButton>
              ))
          )}
        </Box>
        <Divider />
        <List sx={{ py: 1 }}>
          <ListItemButton
            href="/account"
            sx={{
              px: 5,
              py: 1.5,
              "&:hover": {
                bgcolor: "grey.50",
              },
              transition: "background-color 0.2s",
            }}
          >
            <ListItemIcon sx={{ minWidth: "35px" }}>
              <MdManageAccounts className="h-6 w-6 text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    color: "grey.700",
                    fontWeight: 500,
                  }}
                >
                  Manage Account
                </Typography>
              }
            />
          </ListItemButton>
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              px: 5,
              py: 1.5,
              "&:hover": {
                bgcolor: "grey.50",
              },
              transition: "background-color 0.2s",
            }}
          >
            <ListItemIcon sx={{ minWidth: "35px" }}>
              <MdLogout className="h-6 w-6 text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    color: "grey.700",
                    fontWeight: 500,
                  }}
                >
                  Sign Out
                </Typography>
              }
            />
          </ListItemButton>
          <Divider variant="middle" />
          <ListItemButton
            sx={{
              px: 5,
              py: 1.5,
              "&:hover": {
                bgcolor: "grey.50",
              },
              transition: "background-color 0.2s",
            }}
          >
            <ListItemIcon sx={{ minWidth: "35px" }}>
              <MdHelpOutline className="h-6 w-6 text-gray-600" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    color: "grey.700",
                    fontWeight: 500,
                  }}
                >
                  Help & Support
                </Typography>
              }
            />
          </ListItemButton>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
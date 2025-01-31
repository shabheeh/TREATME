import React from "react";
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
} from "@mui/material";
import {
  MdClose,
  MdManageAccounts,
  MdLogout,
  MdHelpOutline,
} from "react-icons/md";
import { RootState } from "../../redux/app/store";
import authServicePatient from "../../services/patient/authService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IDependent, IPatient } from "../../types/patient/patient.types";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {


  const currentPatient = useSelector((state: RootState) => state.user.currentUser)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await authServicePatient.signOut()
      navigate('/signin')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }else {
        toast.error('Something went wrong')
      }
    }
  }

  const isDependent = (user: IDependent | IPatient): user is IDependent => {
    return 'relationship' in user;
  }


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
          <ListItem sx={{ px: 4, py: 2 }}>
            <Avatar
              src={ currentPatient?.profilePicture ? currentPatient.profilePicture : "/api/placeholder/48/48" }
              alt={ currentPatient?.firstName }
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
                { currentPatient?.firstName } { currentPatient?.lastName }
              </Typography>
              <Typography
                sx={{
                  color: "grey.500",
                  fontSize: "0.875rem",
                }}
              >
                { currentPatient && isDependent(currentPatient) ? currentPatient.relationship : 'Primary Account Holder'}
              </Typography>
            </Box>
          </ListItem>
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

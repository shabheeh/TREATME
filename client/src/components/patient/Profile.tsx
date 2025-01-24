import { Avatar, Box, Button, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/app/store"
import React from "react"

type ProfileProps ={
    handleEdit: () => void
}

const Profile: React.FC<ProfileProps> = ({ handleEdit }) => {
    const patient = useSelector((state: RootState) => state.user.patient);
 
    return (
        <Box sx={{ 
            maxWidth: 700, 
            mx: 'auto', 
            p: 3,
            
            backgroundColor: 'white'
        }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 4 
            }}>
                <Avatar
                    src={patient?.profilePicture || "/api/placeholder/48/48"}
                    alt={patient?.firstName}
                    sx={{
                        width: 100,
                        height: 100,
                        mb: 2,
                        border: '3px solid primary.main'
                    }}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {patient?.firstName} {patient?.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {patient?.email}
                </Typography>
            </Box>
 
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid', pb: 1 }}>
                        Personal Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography>
                            <strong>Date of Birth:</strong>  {new Date(patient?.dateOfBirth ?? new Date()).toLocaleDateString('en-GB') || 'Not Provided'}
                        </Typography>
                        <Typography>
                            <strong>Gender:</strong> {patient?.gender || 'Not specified'}
                        </Typography>
                        <Typography>
                            <strong>Phone:</strong> {patient?.phone || 'Not available'}
                        </Typography>
                    </Box>
                </Box>
 
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid', pb: 1 }}>
                        Address
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography>
                            <strong>Street:</strong> {patient?.address?.street || 'Not provided'}
                        </Typography>
                        <Typography>
                            <strong>City:</strong> {patient?.address?.city || 'Not specified'}
                        </Typography>
                        <Typography>
                            <strong>State:</strong> {patient?.address?.state || 'N/A'}
                        </Typography>
                        <Typography>
                            <strong>Postal Code:</strong> {patient?.address?.pincode || 'N/A'}
                        </Typography>
                    </Box>
                </Box>
                <Box 
                sx={{
                    display: 'flex', flexDirection: 'column'
                }}>
                    <Button variant="outlined"
                    onClick={handleEdit}
                    sx={{ alignSelf: 'center'}}
                    >
                        Edit
                    </Button>
                </Box>
            </Box>
        </Box>
    )
 }
 
 export default Profile;
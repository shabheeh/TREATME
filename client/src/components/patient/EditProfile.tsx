import React from "react";
import { 
    Avatar, 
    Box, 
    Button, 
    MenuItem, 
    TextField, 
    Typography 
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import { useForm, Controller } from "react-hook-form";
import { PhotoCamera } from "@mui/icons-material";
import { calculateAge } from "../../helpers/ageCalculator";
import { toast } from "sonner";
import accountService from "../../services/patient/accountService";



interface IFormInputs {
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female';
    dateOfBirth: string;
    profilePicture: File | null;
    street: string;
    city: string;
    landmark: string;
    state: string;
    pincode: string;
}

type EditProfileProps = {
    handleSave: () => void;
    handleCancel?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ 
    handleSave, 
    handleCancel 
}) => {
    const patient = useSelector((state: RootState) => state.user.patient);

    const { 
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm<IFormInputs>({
        defaultValues: {
            firstName: patient?.firstName || '',
            lastName: patient?.lastName || '',
            dateOfBirth: patient?.dateOfBirth 
                ? new Date(patient.dateOfBirth).toISOString().split('T')[0] 
                : '',
            gender: patient?.gender,
            phone: patient?.phone || '',
            street: patient?.address?.street || '',
            city: patient?.address?.city || '',
            landmark: patient?.address?.landmark || '',
            state: patient?.address?.state || '',
            pincode: patient?.address?.pincode || ''
            
        }
    });

    const profilePicture = watch('profilePicture');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setValue('profilePicture', file);
        }
    };

    const onSubmit = async (data: IFormInputs) => {

        if (data.profilePicture) {
            const { size, type } = data.profilePicture;

            if (size > 5 * 1024 * 1024) {
                toast.error("Profile picture must be smaller than 5 MB");
                return;
            }
            if (
                !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
                type
                )
            ) {
                toast.error("Only image files are allowed");
                return;
            }
        }

        try {

            const formData = new FormData() 
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('phone', data.phone);
            formData.append('gender', data.gender);
            formData.append('dateOfBirth', data.dateOfBirth);
            formData.append('lastName', data.street);
            formData.append('firstName', data.city);
            formData.append('lastName', data.landmark);
            formData.append('firstName', data.state);
            formData.append('lastName', data.pincode);

            if (data.profilePicture && data.profilePicture instanceof File) {
                formData.append("profilePicture", data.profilePicture);
            }

            await accountService.updateProfile(formData);
            toast.success('Profile updated Successfully')
            
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`);
            } else {
                toast.error("An unknown error occurred");
            }
            console.log("Error updating specialization", error);
        }

        handleSave();
        console.log(data);
    };

    

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
            sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                p: 3, 
                backgroundColor: 'white'
            }}
        >

            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 4 
            }}>
                <Avatar
                    src={ 
                        profilePicture 
                            ? URL.createObjectURL(profilePicture) 
                            : patient?.profilePicture || "/api/placeholder/48/48" 
                    }
                    alt={ patient?.firstName }
                    sx={{
                        width: 100,
                        height: 100,
                        mb: 2,
                        border: '3px solid primary.main'
                    }}
                />
                <Button 
                    component="label" 
                    variant="outlined" 
                    startIcon={<PhotoCamera />}
                >
                    {patient?.profilePicture ? 'Update Photo' : 'Upload Photo'}
                    <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                        {...register("firstName", {
                            required: "First Name is required",
                            pattern: {
                                value: /^[A-Z][a-zA-Z' -]*$/,
                                message: "Please enter a valid First Name",
                            },
                        })}
                        fullWidth
                        label="First Name"
                        variant="outlined"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />
                    <TextField
                        {...register("lastName", {
                            required: "Last Name is required",
                            pattern: {
                                value: /^[A-Z][a-zA-Z' -]*$/,
                                message: "Please enter a valid Last Name",
                            },
                        })}
                        fullWidth
                        label="Last Name"
                        variant="outlined"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />
                </Box>

                <TextField
                    {...register("phone", {
                        required: "Phone Number is required",
                        pattern: {
                            value: /^[2-9]\d{9}$/,
                            message: "Please enter a valid 10-digit Phone Number",
                        },
                    })}
                    fullWidth
                    type="tel"
                    label="Phone Number"
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                        {...register("dateOfBirth", {
                            required: "Date of Birth is required",
                            validate: (value) => {
                                const age = calculateAge(value);
                                return age >= 18 || "You must be at least 18 years old";
                            }
                        })}
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                    />

                

                    <Controller
                        name="gender"
                        control={control}
                        rules={{ required: "Gender is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                label="Gender"
                                variant="outlined"
                                error={!!errors.gender}
                                helperText={errors.gender?.message}
                            >
                                <MenuItem value='male'>Male</MenuItem>
                                <MenuItem value='female'>Female</MenuItem>
                            </TextField>
                        )}
                    />
                </Box>

                

                <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid', pb: 1 }}>
                    Address
                </Typography>

                <TextField
                    {...register("street", {
                        required: "Street address is required"
                    })}
                    fullWidth
                    label="Street"
                    variant="outlined"
                    error={!!errors.street}
                    helperText={errors.street?.message}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                        {...register("city", {
                            required: "City is required"
                        })}
                        fullWidth
                        label="City"
                        variant="outlined"
                        error={!!errors.city}
                        helperText={errors.city?.message}
                    />
                    <TextField
                        {...register("landmark", {
                            required: "Landmark is required"
                        })}
                        fullWidth
                        label="Landmark"
                        variant="outlined"
                        error={!!errors.landmark}
                        helperText={errors.landmark?.message}
                    />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                        {...register("state", {
                            required: "State is required"
                        })}
                        fullWidth
                        label="State"
                        variant="outlined"
                        error={!!errors.state}
                        helperText={errors.state?.message}
                    />
                <TextField
                    {...register("pincode", {
                        required: "Postal Code is required",
                        pattern: {
                            value: /^\d{6}$/,
                            message: "Please enter a valid 6-digit Postal Code"
                        }
                    })}
                    fullWidth
                    label="Pin Code"
                    variant="outlined"
                    error={!!errors.pincode}
                    helperText={errors.pincode?.message}
                />
                
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        type="submit"
                    >
                        Save Changes
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default EditProfile;
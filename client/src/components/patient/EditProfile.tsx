import React, { useState } from "react";
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
import dependentService from "../../services/dependent/dependentService";
import { IDependent, IPatient } from "../../types/patient/patient.types";


interface IFormInputs {
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female';
    dateOfBirth: string;
    profilePicture: File | null;
    relationship: string;
    street: string;
    city: string;
    landmark: string;
    state: string;
    pincode: string;
}

const relationships = [
    "Parent",
    "Child",
    "Sibling",
    "Grandparent",
    "Grandchild",
    "Wife",
    "Husband"
  ];

type EditProfileProps = {
    handleSave: () => void;
    handleCancel?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ 
    handleSave, 
}) => {
    const patient = useSelector((state: RootState) => state.user.patient);
    const currentPatient = useSelector((state: RootState) => state.user.currentUser)
    const [loading, setLoading] = useState(false);

    const isDependent = (user: IPatient | IDependent ): user is IDependent => {
            return 'relationship' in user;
        
      };

    const { 
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm<IFormInputs>({
        defaultValues: {
            firstName: currentPatient?.firstName || '',
            lastName: currentPatient?.lastName || '',
            dateOfBirth: currentPatient?.dateOfBirth 
                ? new Date(currentPatient.dateOfBirth).toISOString().split('T')[0] 
                : '',
            gender: currentPatient?.gender,
            phone: patient?.phone || '',
            relationship:  currentPatient && isDependent(currentPatient) ? currentPatient.relationship : '',
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
            setLoading(true)

            // primary user
            const formData = new FormData() 
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('phone', data.phone);
            formData.append('gender', data.gender);
            formData.append('dateOfBirth', data.dateOfBirth);
            formData.append('street', data.street);
            formData.append('city', data.city);
            formData.append('landmark', data.landmark);
            formData.append('state', data.state);
            formData.append('pincode', data.pincode);


            //dependent
            const formDataDependent = new FormData()
            formDataDependent.append('firstName', data.firstName);
            formDataDependent.append('lastName', data.lastName);
            formDataDependent.append('gender', data.gender);
            formDataDependent.append('dateOfBirth', data.dateOfBirth)
            formDataDependent.append('relationship', data.relationship)

            if (data.profilePicture && data.profilePicture instanceof File) {
                formData.append("profilePicture", data.profilePicture);
                formDataDependent.append("profilePicture", data.profilePicture);
            }


            if ( currentPatient && isDependent(currentPatient)) {
                if(!currentPatient?._id) return
                await dependentService.updateProfile(currentPatient?._id, formDataDependent)
            }else {
                await accountService.updateProfile(formData);
            }

            toast.success('Profile updated Successfully')
            setLoading(false)
            
        } catch (error) {
            setLoading(false)
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`);
            } else {
                toast.error("An unknown error occurred");
            }
            console.log("Error updating dependent", error);
        }

        handleSave();
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
                            : currentPatient?.profilePicture || "/api/placeholder/48/48" 
                    }
                    alt={ currentPatient?.firstName }
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
                    {currentPatient?.profilePicture ? 'Update Photo' : 'Upload Photo'}
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

                { currentPatient && !isDependent(currentPatient) && 
                    <TextField
                        {...register("phone", {
                            required: "Phone Number is required",
                            pattern: {
                                value: /^[2-9]\d{9}$/,
                                message: "Please enter a valid 10-digit Phone Number",
                            },
                        })}
                        disabled={isDependent(currentPatient)}
                        fullWidth
                        type="tel"
                        label="Phone Number"
                        variant="outlined"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                    />
                }

                { currentPatient && isDependent(currentPatient) && 
                    <Controller
                        name="relationship"
                        control={control}
                        rules={{ required: "Relationship is required" }}
                        render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            fullWidth
                            label="Relationship"
                            variant="outlined"
                            error={!!errors.relationship}
                            helperText={errors.relationship?.message}
                        >
                            {relationships.map((relationship, index) => (
                            <MenuItem key={index} value={relationship}>
                                {relationship}
                            </MenuItem>
                            ))}
                        </TextField>
                        )}
                    />
                }

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                        {...register("dateOfBirth", {
                            required: "Date of Birth is required",
                            validate: (value) => {
                                if (currentPatient && !isDependent(currentPatient)) {
                                  const age = calculateAge(value);
                                  return age >= 18 || "You must be at least 18 years old";
                                }
                                return true;
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

                { currentPatient && !isDependent(currentPatient) && 
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                    
                    </Box>
                }

                

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                        loading={loading}
                        disabled={loading}
                        variant="contained" 
                        type="submit"
                    >
                        Save Changes
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleSave}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default EditProfile;
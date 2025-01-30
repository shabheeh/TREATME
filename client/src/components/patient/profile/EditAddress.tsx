import React, { useState } from "react";
import {  
    Box, 
    Button,  
    TextField, 
    Typography 
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import accountService from "../../../services/patient/accountService";



interface IFormInputs {
    street: string;
    city: string;
    landmark: string;
    state: string;
    pincode: string;
}

type EditAddressProps = {
    handleSave: () => void;
    handleCancel?: () => void;
}

const EditAddress: React.FC<EditAddressProps> = ({ 
    handleSave, 
}) => {
    const patient = useSelector((state: RootState) => state.user.patient);

    const [loading, setLoading] = useState(false);

    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormInputs>({
        defaultValues: {
            street: patient?.address?.street || '',
            city: patient?.address?.city || '',
            landmark: patient?.address?.landmark || '',
            state: patient?.address?.state || '',
            pincode: patient?.address?.pincode || ''
            
        }
    });



    const onSubmit = async (data: IFormInputs) => {

        try {
            setLoading(true)

            const formData = new FormData() 
            formData.append('street', data.street);
            formData.append('city', data.city);
            formData.append('landmark', data.landmark);
            formData.append('state', data.state);
            formData.append('pincode', data.pincode);


            await accountService.updateProfile(formData);

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

export default EditAddress;
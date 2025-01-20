import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import log from "loglevel";
import { toast } from "sonner";
import { AxiosError } from "axios";
import specializationService from "../../services/admin/specializationService";
import { useNavigate } from "react-router-dom";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface FormInputs {
  name: string;
  description: string;
  note: string;
  fee: number | null;
  image: File | null;
}

const AddSpecialization = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      description: "",
      note: "",
      fee: null,
      image: null,
    },
  });

  const image = watch("image");
  const navigate = useNavigate();
  const cropperRef = useRef<HTMLImageElement>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropped, setIsCropped] = useState(false); 

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
    //   setValue("image", file); 
      setCroppedImage(URL.createObjectURL(file));
      setIsCropped(false);
    }
  };

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "cropped-image.png", {
              type: "image/png",
            });
            setValue("image", file); 
            setCroppedImage(croppedCanvas.toDataURL()); 
            setIsCropped(true); 
          }
        });
      }
    }
  };

  const onSubmit = async (data: FormInputs) => {
    data.fee = Number(data.fee);

    if (!data.image) {
      toast.error("Image is required");
      return;
    }

    const { size, type } = data.image;
    if (size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(type)) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("note", data.note);
      formData.append("fee", data.fee.toString());

      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else {
        console.log("image is not a file");
        return;
      }

      await specializationService.addSepcialization(formData);

      toast.success("Specialization added successfully!");

      navigate("/admin/specializations");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(`Server Error: ${error.response.data.error || error.message}`);
        } else if (error.request) {
          toast.error("No response from the server. Please try again.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error("An unknown error occurred");
      }
      log.error("Error adding specialization", error);
    }
  };

  return (
    <Box sx={{ py: 5 }}>
      <Container
        sx={{
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "90%", my: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Card sx={{ maxWidth: 600, maxHeight: 400, my: 5 }}>
              {croppedImage && !isCropped ? (
                <Cropper
                  src={croppedImage}
                  style={{ height: 300, width: "100%" }}
                  aspectRatio={1.5}
                  guides={true}
                  ref={cropperRef}
                />
              ) : (
                <CardMedia component="img" height="140" image={croppedImage || undefined} />
              )}
            </Card>
            {croppedImage && !isCropped && (
              <Button
                variant="contained"
                onClick={getCroppedImage}
                sx={{ my: 2 }}
              >
                Crop Image
              </Button>
            )}
            <Button component="label" variant="outlined" startIcon={<PhotoCamera />}>
              Upload Photo
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>
          <Box sx={{ width: "90%", my: 2 }}>
            <TextField
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Z][a-zA-Z' -]*$/,
                  message: "Please enter a valid Name",
                },
              })}
              fullWidth
              label="Name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>
          <Box sx={{ width: "90%", my: 2 }}>
            <TextField
              {...register("description", { required: "Description is required" })}
              fullWidth
              label="Description"
              variant="outlined"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Box>
          <Box sx={{ width: "90%", my: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("note", {
                    required: "Note is required",
                    minLength: {
                      value: 30,
                      message: "Note should be at least 30 characters",
                    },
                  })}
                  fullWidth
                  label="Note"
                  multiline
                  rows={4}
                  variant="outlined"
                  error={!!errors.note}
                  helperText={errors.note?.message}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ width: "90%", my: 2 }}>
            <TextField
              {...register("fee", {
                required: "Fee is required",
                min: {
                  value: 2,
                  message: "Fee must be a valid amount",
                },
              })}
              fullWidth
              type="number"
              label="Fee"
              variant="outlined"
              error={!!errors.fee}
              helperText={errors.fee?.message}
            />
          </Box>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ py: 2, my: 5, width: "90%", fontSize: "1rem" }}
          >
            Add Specialization
          </Button>
        </Container>
      </Container>
    </Box>
  );
};

export default AddSpecialization;

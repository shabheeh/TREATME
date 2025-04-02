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
import { useFieldArray, useForm } from "react-hook-form";
import log from "loglevel";
import { toast } from "sonner";
import specializationService from "../../services/specialization/specializationService";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import type { ReactCropperElement } from "react-cropper";

interface FormInputs {
  name: string;
  description: string;
  note: string;
  fee: number | null;
  durationInMinutes: number | null;
  image: File | null;
  concerns: { value: string }[];
}

const AddSpecialization = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      description: "",
      note: "",
      fee: null,
      durationInMinutes: null,
      image: null,
      concerns: [{ value: "" }],
    },
  });

  const navigate = useNavigate();
  const cropperRef = useRef<ReactCropperElement>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropped, setIsCropped] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fields, append, remove } = useFieldArray<FormInputs>({
    control,
    name: "concerns",
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
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
    data.durationInMinutes = Number(data.durationInMinutes);
    const concerns = data.concerns.map((item) => item.value);

    if (!data.image) {
      toast.error("Image is required");
      return;
    }

    const { size, type } = data.image;
    if (size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(type)
    ) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("note", data.note);
      formData.append("fee", data.fee.toString());
      formData.append("durationInMinutes", data.durationInMinutes.toString());
      formData.append("concerns", JSON.stringify(concerns));

      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else {
        console.log("image is not a file");
        return;
      }

      await specializationService.addSepcialization(formData);

      toast.success("Specialization added successfully!");

      navigate("/admin/specializations");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
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
          <Box
            sx={{
              width: "90%",
              my: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                <CardMedia
                  component="img"
                  height="140"
                  image={croppedImage || undefined}
                />
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
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCamera />}
            >
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
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
              {...register("description", {
                required: "Description is required",
              })}
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
          <Box sx={{ width: "90%", my: 2 }}>
            <TextField
              {...register("durationInMinutes", {
                required: "duration is required",
                min: {
                  value: 15,
                  message: "duration must be a valid number",
                },
              })}
              fullWidth
              type="number"
              label="Duration in Minutes"
              variant="outlined"
              error={!!errors.durationInMinutes}
              helperText={errors.durationInMinutes?.message}
            />
          </Box>
          <Box sx={{ width: "90%", my: 2 }}>
            {fields.map((field, index) => (
              <Box key={field.id}>
                <TextField
                  {...register(`concerns.${index}.value`, {
                    required: "Concern is required",
                  })}
                  fullWidth
                  label={`Concern ${index + 1}`}
                  variant="outlined"
                  error={!!errors.concerns?.[index]?.value}
                  helperText={errors.concerns?.[index]?.value?.message}
                />
                <Button
                  onClick={() => remove(index)}
                  color="error"
                  sx={{ mt: 1 }}
                  disabled={fields.length === 1}
                >
                  Remove
                </Button>
              </Box>
            ))}

            <Button onClick={() => append({ value: "" })}>
              Add Another Concern
            </Button>
          </Box>
          <Box
            sx={{
              width: "60%",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              onClick={() => navigate(-1)}
              loading={loading}
              disabled={loading}
              fullWidth
              variant="outlined"
              sx={{ py: 2, my: 5, width: "70%", fontSize: "1rem" }}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              disabled={loading}
              fullWidth
              type="submit"
              variant="contained"
              sx={{ py: 2, my: 5, width: "70%", fontSize: "1rem" }}
            >
              Add Specialization
            </Button>
          </Box>
        </Container>
      </Container>
    </Box>
  );
};

export default AddSpecialization;

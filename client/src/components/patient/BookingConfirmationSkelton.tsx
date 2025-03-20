import { Box, Grid, Paper, Divider, Skeleton } from "@mui/material";

const BookingConfirmedSkeleton = () => {
  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", p: 3, pt: 1 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Skeleton variant="circular" width={64} height={64} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={200} height={32} />
      </Box>

      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 3, mb: 1, border: "1px solid teal" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Skeleton
                variant="circular"
                width={60}
                height={60}
                sx={{ mr: 2 }}
              />
              <Box>
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton
                  variant="text"
                  width={100}
                  height={16}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Skeleton variant="text" width={100} height={24} />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Skeleton variant="text" width={150} height={24} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 3, mb: 1, border: "1px solid teal" }}
          >
            <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="text" width={50} height={16} />
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="text" width={100} height={16} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="text" width={50} height={16} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{ p: 3, mb: 3, border: "1px solid teal" }}
      >
        <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={400} height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={400} height={24} />
      </Paper>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Skeleton variant="rectangular" width={150} height={40} />
        <Skeleton variant="rectangular" width={150} height={40} />
      </Box>
    </Box>
  );
};

export default BookingConfirmedSkeleton;

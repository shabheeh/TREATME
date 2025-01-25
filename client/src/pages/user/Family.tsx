
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Mock data for family members
const familyMembers = [
  { id: 1, name: 'John Doe', relationship: 'Spouse', age: 35 },
  { id: 2, name: 'Jane Doe', relationship: 'Child', age: 10 },
  { id: 3, name: 'Alice Smith', relationship: 'Child', age: 8 },
];

const Family = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Family Members
      </Typography>

      <Grid container spacing={3}>
        {/* Display family members */}
        {familyMembers.length > 0 &&
          familyMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Avatar>{member.name[0]}</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.relationship}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Age: {member.age}
                      </Typography>
                    </Box>
                    <Switch color="primary" /> {/* Switch User button */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {/* Add Dependent Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <IconButton color="primary">
                  <AddIcon fontSize="large" />
                </IconButton>
                <Typography variant="body1" color="text.secondary">
                  Add Dependent
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* If no family members, show only the Add Dependent card */}
      {familyMembers.length === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <IconButton color="primary">
                    <AddIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="body1" color="text.secondary">
                    Add Dependent
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Family;
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Button,
    Divider,
  } from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';

  
  // Mock data for family members
  const familyMembers = [
    { id: 1, name: 'John Doe', relationship: 'Spouse', age: 35 },
    { id: 2, name: 'Jane Doe', relationship: 'Child', age: 10 },
    { id: 3, name: 'Alice Smith', relationship: 'Child', age: 8 },
  ];
  
  interface FamilyMembersProps {
    changeCurrentState: () => void
  }

  const FamilyMembers: React.FC<FamilyMembersProps> = ({ changeCurrentState }) => {
    const handleSwitchUser = (memberId: number) => {
        console.log(memberId)
    };
  
  
    return (
      
        <Grid container spacing={3}>
          {familyMembers.length > 0 &&
            familyMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card sx={{ height: '100%', position: 'relative' }}>
  <CardContent
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      padding: 2, 
    }}
  >

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb:2
      }}
    >
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
      </Box>
      <Typography
        variant="body2"
        sx={{ color: 'green', position: 'absolute', top: 16, right: 16 }}
      >
        Active
      </Typography>
    </Box>

        <Divider />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 2, 
      }}
    >
      <Button
        variant="text"
        color="primary"
        onClick={() => handleSwitchUser(member.id)}
      >
        Switch User
      </Button>
      <Button
        variant="text"
        color="error"
        // onClick={() => onRemove(member.id)}
      >
        Remove
      </Button>
    </Box>

   
  </CardContent>
</Card>
              </Grid>
            ))}
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
                <Button sx={{width: '100%'}} onClick={changeCurrentState}>
              <CardContent>
                
                <Box
                
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  my: 3
                }}
              >
                
                  <AddIcon fontSize="large" />
                  <Typography variant="body1" color="text.secondary">
                    Add Dependent
                  </Typography>
              </Box>

              </CardContent>
              </Button>

            </Card>
          </Grid>
        </Grid>
    );
  };
  
  export default FamilyMembers;
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type SpecializationCardProps = {
  name: string;
  description: string;
  note: string;
  fee: number;
  image: string;
};

const SpecializationCard: React.FC<SpecializationCardProps> = ({ name, description, note, fee, image }) => {
  return (
    <Card
      sx={{
        width: 280, 
        height: 480, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        "&:hover": {
          transform: 'scale(1.01)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={`${name} image`}
      />
      <CardContent
        sx={{
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
        }}
      >
        <Typography
          gutterBottom
          component="div"
          sx={{ fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {name}
        </Typography>
        <Typography
          gutterBottom
          component="div"
          sx={{ fontWeight: 500, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}
        >
          {description}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}
        >
          {note}
        </Typography>
        <Typography
          gutterBottom
          component="div"
          sx={{ fontWeight: 500, fontSize: '1rem', my: 2 }}
        >
          Fee: ₹{fee}
        </Typography>
      </CardContent>
      <CardActions sx={{ my: 2 }}>
        <Button
          fullWidth
          sx={{
            borderRadius: '50px',
            "&:hover": {
              transform: 'scale(1.0)',
              boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
            },
          }}
          variant="outlined"
          size="large"
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

export default SpecializationCard;

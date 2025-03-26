import { Box, Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description?: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  color,
}) => {
  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Icon style={{ color }} />
        </Box>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

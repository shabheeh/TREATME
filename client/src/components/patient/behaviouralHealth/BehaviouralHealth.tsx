import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Slider,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/app/store';
import { IBehaviouralHealth } from '../../../types/patient/health.types';
import { toast } from 'sonner';
import healthProfileService from '../../../services/healthProfile/healthProfileServices';
import Loading from '../../basics/Loading';



const MENTAL_HEALTH_CONDITIONS = [
  'Depression',
  'Anxiety',
  'Bipolar Disorder',
  'PTSD',
  'ADHD',
  'OCD',
  'Panic Disorder',
  'Social Anxiety',
  'Eating Disorder',
  'Schizophrenia',
  'Personality Disorder',
] as const;

const THERAPY_STATUS_OPTIONS = [
  'Currently in therapy',
  'Previously attended therapy',
  'Never attended therapy',
  'Seeking therapy',
  'Prefer not to say'
] as const;

const SUPPORT_SYSTEM_OPTIONS = [
  'Family',
  'Friends',
  'Therapist',
  'Support Group',
  'Religious/Spiritual Community',
  'Healthcare Provider',
  'Social Worker',
  'None'
] as const;

const COPING_MECHANISMS = [
  'Meditation',
  'Exercise',
  'Journaling',
  'Art/Creative Expression',
  'Music',
  'Breathing Exercises',
  'Professional Help',
  'Support Groups',
] as const;

const BehavioralHealth = () => {
  const currentPatient = useSelector((state: RootState) => state.user.currentUser)
  const [behaviouralHealth, setBehaviouralHealth] = useState<IBehaviouralHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<IBehaviouralHealth>>({});

  useEffect(() => {
    fetchMentalHealth();
  }, [currentPatient]);

  const fetchMentalHealth = async () => {
    if (!currentPatient) return 
    setLoading(true);
    try {
      const result = await healthProfileService.getBehaviouralHealth(currentPatient._id)
      setBehaviouralHealth(result);
      setEditedData(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Someting went wrong')
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentPatient) return
    try {
      const updatedData = {
        ...behaviouralHealth,
        ...editedData,
      };
      
      const result = await healthProfileService.updateBehavioualHealth(currentPatient?._id, updatedData);
      setBehaviouralHealth(result);
      setIsEditing(false);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    }
  };

  const handleArrayToggle = (array: keyof IBehaviouralHealth, item: string) => {
    const currentItems = editedData[array] as string[] || [];
    const updatedItems = currentItems.includes(item)
      ? currentItems.filter(i => i !== item)
      : [...currentItems, item];
    
    setEditedData(prev => ({
      ...prev,
      [array]: updatedItems
    }));
  };

  const today = new Date().toISOString().split('T')[0];


  if (loading) return <Loading />

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Mental Health Assessment
        </Typography>
        <Button
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
          variant={isEditing ? "contained" : "outlined"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? 'Save Changes' : 'Edit Information'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Diagnosed Conditions</Typography>
          <Grid container spacing={1}>
            {MENTAL_HEALTH_CONDITIONS.map((condition) => (
              <Grid item key={condition}>
                <Chip
                  label={condition}
                  onClick={() => isEditing && handleArrayToggle('conditions', condition)}
                  color={ editedData && editedData.conditions?.includes(condition) ? "primary" : "default"}
                  sx={{ opacity: !isEditing && !behaviouralHealth?.conditions?.includes(condition) ? 0.5 : 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Current Assessment</Typography>

          {['anxietyLevel', 'depressionLevel', 'stressLevel'].map((level) => (
            <FormControl key={level} fullWidth sx={{ mb: 2 }}>
              <FormLabel>{level.replace('Level', ' Level').replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
              <Slider
                value={ editedData && isEditing ? editedData[level] : behaviouralHealth?.[level]}
                min={0}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                onChange={(_, value) => setEditedData(prev => ({ ...prev, [level]: value }))}
                disabled={!isEditing}
              />
            </FormControl>
          ))}
          <Typography variant="subtitle1" sx={{ my: 1 }}>Coping Mechanisms</Typography>
          <Grid container spacing={1}>
            {COPING_MECHANISMS.map((mechanism) => (
              <Grid item key={mechanism}>
                <Chip
                  label={mechanism}
                  onClick={() => isEditing && handleArrayToggle('copingMechanisms', mechanism)}
                  color={ editedData && editedData.copingMechanisms?.includes(mechanism) ? "primary" : "default"}
                  sx={{ opacity: !isEditing && !behaviouralHealth?.copingMechanisms?.includes(mechanism) ? 0.5 : 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Treatment & Support</Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Therapy Status</FormLabel>
            <Select
              value={ editedData && isEditing ? editedData.therapyStatus : behaviouralHealth?.therapyStatus}
              onChange={(e) => setEditedData(prev => ({ ...prev, therapyStatus: e.target.value }))}
              disabled={!isEditing}
            >
              {THERAPY_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 4 }}>
          <TextField
            fullWidth
            label="Date of Last Episode/Crisis (if applicable)"
            type="date"
            value={ editedData && isEditing ? editedData.lastEpisodeDate : behaviouralHealth?.lastEpisodeDate}
            onChange={(e) => setEditedData(prev => ({ ...prev, lastEpisodeDate: e.target.value }))}
            disabled={!isEditing}
            inputProps={{ max: today }}
            InputLabelProps={{ shrink: true }}
          />
          </FormControl>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Support System</Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {SUPPORT_SYSTEM_OPTIONS.map((support) => (
              <Grid item key={support}>
                <Chip
                  label={support}
                  onClick={() => isEditing && handleArrayToggle('supportSystem', support)}
                  color={ editedData && editedData.supportSystem?.includes(support) ? "primary" : "default"}
                  sx={{ opacity: !isEditing && !behaviouralHealth?.supportSystem?.includes(support) ? 0.5 : 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BehavioralHealth;
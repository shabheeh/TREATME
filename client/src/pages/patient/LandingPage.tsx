import Navbar from "../../components/basics/Navbar";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import {
  CalendarMonth,
  Videocam,
  AccessTime,
  ExpandMore
} from "@mui/icons-material";

import CircleIcon from "@mui/icons-material/Circle";

import bgImage from "../../assets/Hero-banner.jpg";
import { TiPlus } from "react-icons/ti";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const services = [
    {
      title: "Dermatology",
      treatments: [
        "Acne",
        "Rashes",
        "Alopecia (Hair loss)",
        "Skin Infections",
        "Keratosis",
        "Rosacea",
        "Eczema",
        "Chronic Hives",
        "Psoriasis",
        "Skin Pigmentation Disorders",
        "Fungal Skin Infections"
      ]
    },
    {
      title: "Urgent Care",
      treatments: [
        "Cold & Flu",
        "Minor Injuries",
        "Infections",
        "Allergies",
        "UTI",
        "fever"
      ]
    },
    {
      title: "Therapy",
      treatments: [
        "Anxiety",
        "Addictions",
        "Depression",
        "Stress Management",
        "Relationship Issues",
        "Grief Counseling",
        "Phobias",
        "Anger Management",
        "Life Transitions Support",
        "Self-Esteem Issues"
      ]
    },
    {
      title: "Psychiatry",
      treatments: [
        "Medication Management",
        "Obsessive Compulsive Disorder (OCD)",
        "ADHD",
        "Bipolar Disorder",
        "Anxiety Disorders",
        "Depression Treatment",
        "Trauma & PTSD",
        "Personality Disorders",
        "Panic Disorders",
        "Stress-Related Psychosomatic Conditions"
      ]
    }
  ];

  const steps = [
    {
      icon: <CalendarMonth sx={{ fontSize: 48, color: "teal" }} />,
      title: "Book Appointment",
      description: "Choose your specialist and select a convenient time slot"
    },
    {
      icon: <Videocam sx={{ fontSize: 48, color: "teal" }} />,
      title: "Virtual Consultation",
      description:
        "Connect with your healthcare provider through secure video call"
    },
    {
      icon: <AccessTime sx={{ fontSize: 48, color: "teal" }} />,
      title: "Follow-up Care",
      description: "Get prescriptions and follow-up care as needed"
    }
  ];

  const faqs = [
    {
      question: "How much does a consultation cost?",
      answer:
        "Consultation fees vary by specialist and service You can see the exact cost before booking your appointment."
    },
    {
      question: "How long are the appointments?",
      answer:
        "Initial consultations typically last 30-45 minutes, while follow-up appointments are usually 15-20 minutes. Duration may vary based on your specific needs."
    },
    {
      question: "Can I get prescriptions through TreatMe?",
      answer:
        "Yes, our licensed healthcare providers can prescribe medications when appropriate. Prescriptions are sent directly to your Medication section on the app."
    },
    {
      question: "Is my information secure?",
      answer:
        "Yes, we maintain strict HIPAA compliance and use enterprise-grade encryption to protect your personal health information."
    }
  ];

  return (
    <Box>
      <Navbar />

      <Box sx={{ bgcolor: "white", color: "teal" }}>
        <Container maxWidth="xl" disableGutters>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6} sx={{ py: 10, px: 10 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                Healthcare at Your Fingertips
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4 }}>
                Connect with top healthcare providers from the comfort of your
                home. Quality care, when you need it most.
              </Typography>
              <Link to={"/signin"}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "teal",
                    "&:hover": { bgcolor: "grey.100" },
                    borderRadius: 28,
                    px: 4
                  }}
                >
                  Book Now
                </Button>
              </Link>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ position: "relative", height: "100%" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,5.95) 0%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0) 100%)",
                    zIndex: 1,
                    pointerEvents: "none"
                  }
                }}
              >
                <Box
                  component="img"
                  src={bgImage}
                  alt="Telemedicine Consultation"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            How It Works
          </Typography>
          <Grid container spacing={6} sx={{ mt: 4 }}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Stack alignItems="center" spacing={2}>
                  {step.icon}
                  <Typography variant="h5" component="h3">
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary" textAlign="center">
                    {step.description}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: "grey.50" }}>
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Our Services
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    component="h3"
                    gutterBottom
                  >
                    {service.title}
                  </Typography>
                  <List sx={{ listStyleType: "none", pl: 0 }}>
                    {service.treatments.map((treatment, idx) => (
                      <ListItem key={idx} sx={{ p: 0, my: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CircleIcon sx={{ color: "teal", width: "12px" }} />
                        </ListItemIcon>
                        <ListItemText primary={treatment} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: "white" }}>
        <Container maxWidth="xl" sx={{ alignItems: "start" }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 4, maxWidth: 800, mx: "auto", alignContent: "start" }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  "&:not(:last-child)": { mb: 2 },
                  boxShadow: "none",
                  border: "none"
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" textAlign="start">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: "start", px: 0 }}>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TiPlus size={30} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  TreatMe
                </Typography>
              </Box>
              <Typography color="grey.400">
                Healthcare solutions for the digital age
              </Typography>
            </Grid>

            {[
              {
                title: "Services",
                items: ["Dermatology", "Urgent Care", "Therapy", "Psychiatry"]
              },
              {
                title: "Company",
                items: ["About Us", "Contact", "Privacy Policy"]
              },
              {
                title: "Contact",
                items: ["support@treatme.com", "1-800-TREATME", "Mon-Sun 24/7"]
              }
            ].map((section, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <List sx={{ p: 0 }}>
                  {section.items.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <Typography color="grey.400">{item}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: 1,
              borderColor: "grey.800",
              textAlign: "center"
            }}
          >
            <Typography color="grey.400">
              &copy; 2025 TreatMe. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  ExpandMore,
  Search,
  MedicalServices,
  CalendarMonth,
  Videocam,
  CreditCard,
  Security,
  Help,
  Email,
  Phone,
  Chat,
  ArrowForward,
  LiveHelp,
  School,
  AutoStories,
} from "@mui/icons-material";

// FAQ items type
interface FAQItem {
  question: string;
  answer: string;
}

// Section type
interface SectionType {
  title: string;
  icon: React.ReactNode;
  faqs: FAQItem[];
}

const HelpAndSupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const faqSections: SectionType[] = [
    {
      title: "Getting Started",
      icon: <MedicalServices color="primary" />,
      faqs: [
        {
          question: "How do I create an account?",
          answer:
            'To create an account, click on the "Sign Up" button on our homepage. Fill in your personal details, including your name, email address, and a strong password. You\'ll receive a verification email to confirm your account. Follow the instructions in the email to complete your registration.',
        },
        {
          question: "Is my medical information secure?",
          answer:
            "Yes, we take your privacy and security very seriously. All your medical information is encrypted and stored securely following HIPAA compliance guidelines. We use industry-standard security protocols to ensure your data remains confidential.",
        },
        {
          question: "How do I complete my medical profile?",
          answer:
            'After logging in, navigate to "My Profile" in the menu and select "Medical Information." Fill in your medical history, current medications, allergies, and other relevant health information. The more complete your profile is, the better our doctors can assist you.',
        },
      ],
    },
    {
      title: "Appointments",
      icon: <CalendarMonth color="primary" />,
      faqs: [
        {
          question: "How do I schedule an appointment?",
          answer:
            'Go to the "Book Appointment" section, select your preferred medical specialty, choose an available doctor, and pick a convenient date and time slot. Review your selection and confirm the appointment. You\'ll receive an email confirmation with the appointment details.',
        },
        {
          question: "Can I reschedule or cancel my appointment?",
          answer:
            'Yes, you can reschedule or cancel appointments up to 6 hours before the scheduled time without any penalty. Go to "My Appointments," find the appointment you want to change, and click on "Reschedule" or "Cancel."',
        },
        {
          question: "What if I miss my appointment?",
          answer:
            "If you miss an appointment without prior cancellation, a missed appointment fee may apply. We recommend rescheduling if you can't make it to avoid any charges. Repeated missed appointments may affect your ability to book future appointments.",
        },
      ],
    },
    {
      title: "Video Consultations",
      icon: <Videocam color="primary" />,
      faqs: [
        {
          question: "How do I join a video consultation?",
          answer:
            'Five minutes before your scheduled appointment, log in to your account and go to "My Appointments." You\'ll see a "Join Now" button for your upcoming appointment. Click it to enter the virtual waiting room. Make sure your camera and microphone are working properly.',
        },
        {
          question:
            "What should I do if I have technical issues during my consultation?",
          answer:
            "If you experience technical difficulties, first try refreshing your browser or restarting the app. Check your internet connection and device settings. If issues persist, you can contact our technical support team via the chat function or call our helpline for immediate assistance.",
        },
        {
          question: "What equipment do I need for a video consultation?",
          answer:
            "You need a device with a camera and microphone (smartphone, tablet, or computer), a stable internet connection, and a quiet, well-lit private space. We recommend using headphones for better audio quality and privacy during your consultation.",
        },
      ],
    },
    {
      title: "Billing & Insurance",
      icon: <CreditCard color="primary" />,
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover), PayPal, and some FSA/HSA cards. Payment is processed securely through our encrypted payment system.",
        },
        {
          question: "Does insurance cover telemedicine consultations?",
          answer:
            "Many insurance plans now cover telemedicine consultations. We work with several major insurance providers. You can verify your coverage by entering your insurance information in your profile or contacting our billing department for assistance.",
        },
        {
          question: "How do I get a receipt for my consultation?",
          answer:
            'After each paid consultation, an electronic receipt will be automatically sent to your registered email address. You can also download receipts and invoices from the "Billing History" section in your account.',
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: <Security color="primary" />,
      faqs: [
        {
          question: "How is my personal information protected?",
          answer:
            "We follow strict HIPAA guidelines and use advanced encryption for all data transmission and storage. Our platform includes multi-factor authentication, regular security audits, and we never share your information with third parties without your explicit consent.",
        },
        {
          question: "Can family members access my medical records?",
          answer:
            "Your medical records are private and accessible only to you and your healthcare providers. You can grant access to family members by adding them as authorized individuals in your account settings, which you can modify or revoke at any time.",
        },
        {
          question: "What happens to my data if I close my account?",
          answer:
            "If you close your account, we retain your medical records for the period required by law (typically 7-10 years depending on your location). After this period, your data is securely deleted from our systems. You can request a copy of your medical records before closing your account.",
        },
      ],
    },
  ];

  // Filter FAQs based on search query
  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqSections
      : faqSections
          .map((section) => ({
            ...section,
            faqs: section.faqs.filter(
              (faq) =>
                faq.question
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter((section) => section.faqs.length > 0);

  const handleSectionClick = (sectionTitle: string) => {
    setActiveSection(activeSection === sectionTitle ? null : sectionTitle);

    // If a section is clicked, clear the search
    if (searchQuery) {
      setSearchQuery("");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1, py: 5 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            pt: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="primary"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              mb: 2,
            }}
          >
            Help & Support Center
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              color: "text.secondary",
              mb: 4,
            }}
          >
            Find answers to common questions about using our telemedicine
            platform
          </Typography>

          {/* Modern Search Bar */}
          <Paper
            elevation={2}
            sx={{
              p: 1,
              maxWidth: "700px",
              mx: "auto",
              display: "flex",
              alignItems: "center",
              borderRadius: 4,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(0,150,136,0.1)",
              },
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="What can we help you with?"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ px: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "20px",
                px: 3,
                py: 1,
              }}
            >
              Search
            </Button>
          </Paper>
        </Box>

        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            position: "relative",
          }}
        >
          Popular Topics
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {faqSections.map((section, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={1}
                sx={{
                  height: "100%",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,150,136,0.1)",
                  },
                  display: "flex",
                  flexDirection: "column",
                  bgcolor:
                    activeSection === section.title
                      ? "rgba(0, 150, 136, 0.05)"
                      : "white",
                  borderLeft:
                    activeSection === section.title ? "4px solid" : "none",
                  borderColor: "primary.main",
                }}
                onClick={() => handleSectionClick(section.title)}
              >
                <CardContent sx={{ p: 3, flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "50%",
                        bgcolor: "rgba(0, 150, 136, 0.1)",
                        mr: 2,
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {section.faqs[0].question}
                  </Typography>
                  <Button
                    color="primary"
                    endIcon={<ArrowForward />}
                    sx={{
                      alignSelf: "flex-start",
                      mt: "auto",
                      fontWeight: 500,
                    }}
                  >
                    {activeSection === section.title
                      ? "Hide details"
                      : "View details"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {activeSection && (
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 5,
              borderRadius: 3,
              borderLeft: "4px solid",
              borderColor: "primary.main",
              bgcolor: "rgba(0, 150, 136, 0.02)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  bgcolor: "rgba(0, 150, 136, 0.1)",
                  mr: 2,
                }}
              >
                {
                  faqSections.find((section) => section.title === activeSection)
                    ?.icon
                }
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {activeSection} FAQ
              </Typography>
            </Box>

            {faqSections
              .find((section) => section.title === activeSection)
              ?.faqs.map((faq, faqIndex) => (
                <Accordion
                  key={faqIndex}
                  elevation={1}
                  defaultExpanded={faqIndex === 0}
                  sx={{
                    "&.MuiAccordion-root": {
                      mb: 2,
                      bgcolor:
                        faqIndex % 2 === 0
                          ? "rgba(0, 150, 136, 0.03)"
                          : "white",
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3 }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setActiveSection(null)}
              >
                Close Section
              </Button>
            </Box>
          </Paper>
        )}

        {/* FAQ Sections - Only show when no section is selected and there is a search query */}
        {!activeSection && searchQuery && (
          <>
            <Typography
              variant="h5"
              sx={{
                my: 4,
                fontWeight: 600,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  width: "40px",
                  height: "3px",
                  backgroundColor: "primary.main",
                  borderRadius: "2px",
                },
              }}
            >
              Search Results
            </Typography>

            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "50%",
                        bgcolor: "rgba(0, 150, 136, 0.1)",
                        mr: 2,
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                  </Box>

                  {section.faqs.map((faq, faqIndex) => (
                    <Accordion
                      key={faqIndex}
                      elevation={1}
                      defaultExpanded
                      sx={{
                        "&.MuiAccordion-root": {
                          mb: 2,
                          bgcolor:
                            faqIndex % 2 === 0
                              ? "rgba(0, 150, 136, 0.03)"
                              : "white",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{ px: 3 }}
                      >
                        <Typography sx={{ fontWeight: 500 }}>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{ color: "text.secondary" }}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ))
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "rgba(0, 150, 136, 0.05)",
                  borderRadius: 4,
                }}
              >
                <Help
                  color="primary"
                  sx={{ fontSize: 60, mb: 2, opacity: 0.8 }}
                />
                <Typography variant="h6" gutterBottom>
                  No results found for "{searchQuery}"
                </Typography>
                <Typography variant="body1" paragraph>
                  Try using different keywords or browse the topics above.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LiveHelp />}
                  sx={{ mt: 1, borderRadius: 40, px: 3 }}
                  onClick={() => setSearchQuery("")}
                >
                  Browse Help Topics
                </Button>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Footer with contact information */}
      <Box
        component="footer"
        sx={{
          bgcolor: "white",
          p: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                © 2025 Treatme. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                  gap: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chat fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">Live Chat</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Email fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">support@Treatme.com</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Phone fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">1-800-TELE-MED</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HelpAndSupportPage;

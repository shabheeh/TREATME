import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Button,
  Tab,
  Tabs,
  IconButton,
  useTheme,
} from "@mui/material";
import { Refresh, Add, Schedule } from "@mui/icons-material";
import { IWallet } from "../../../types/wallet/wallet.types";
import walletService from "../../../services/wallet/walletService";
import { toast } from "sonner";
import AddFundsModal from "./AddFundsModal";
import { formatMonthDay, formatTime } from "../../../utils/dateUtils";

const WalletPatient: React.FC = () => {
  const theme = useTheme();
  // const [tabValue, setTabValue] = useState(0);
  const [isAddFundsModalOpen, setAddFundsModalOpen] = useState<boolean>(false);

  const [wallet, setWallet] = useState<IWallet | null>(null);

  // const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue);
  // };

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const wallet = await walletService.accessWallet();
      if (wallet) {
        setWallet(wallet);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const reversedTransactions = wallet?.transactions.slice().reverse();

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: "white",
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="light">
                  Treetme Wallet
                </Typography>
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    sx={{ color: "white" }}
                    onClick={fetchWallet}
                  >
                    <Refresh />
                  </IconButton>
                </Box>
              </Box>

              <Box mt={3} mb={2}>
                <Typography variant="h3" fontWeight="bold">
                  ₹{wallet?.balance.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Last updated:{" "}
                  {wallet?.updatedAt && formatMonthDay(wallet?.updatedAt)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddFundsModalOpen(true)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  Add Funds
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions */}
        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Payment History</Typography>
              <Chip
                label={`${wallet?.transactions.length} transactions`}
                size="small"
                sx={{ backgroundColor: theme.palette.grey[200] }}
              />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              {/* <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="All" />
                <Tab label="Consultations" />
                <Tab label="Medications" />
              </Tabs> */}
            </Box>

            <List disablePadding>
              {reversedTransactions && reversedTransactions.length > 0 ? (
                reversedTransactions.map((transaction) => (
                  <React.Fragment key={transaction._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        py: 1.5,
                        px: 0,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      {/* <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.light,
                          }}
                        >
                          {getServiceIcon(transaction.serviceType)}
                        </Avatar>
                      </ListItemIcon> */}
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight="medium">
                              {transaction.description}
                            </Typography>
                            {transaction.type === "debit" ? (
                              <Typography fontWeight="bold" color="error.main">
                                -{transaction.amount.toFixed()}
                              </Typography>
                            ) : (
                              <Typography
                                fontWeight="bold"
                                color="success.main"
                              >
                                +{transaction.amount.toFixed()}
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt={0.5}
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Schedule
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatMonthDay(transaction.date)}{" "}
                                {formatTime(transaction.date)}
                              </Typography>
                            </Box>
                            <Chip
                              label={transaction.status}
                              size="small"
                              sx={{
                                color: "white",
                                backgroundColor:
                                  transaction.status === "success"
                                    ? "success.main"
                                    : "error.main",
                                fontWeight: "medium",
                                fontSize: "0.7rem",
                                height: 24,
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              ) : (
                <Box py={4} textAlign="center">
                  <Typography color="text.secondary">
                    No transactions found
                  </Typography>
                </Box>
              )}
            </List>

            {/* {wallet && wallet?.transactions.length > 0 && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Button color="primary">View More</Button>
              </Box>
            )} */}
          </Box>
        </Grid>
      </Grid>

      <AddFundsModal
        open={isAddFundsModalOpen}
        onClose={() => setAddFundsModalOpen(false)}
        fetchWallet={fetchWallet}
      />
    </Box>
  );
};

export default WalletPatient;

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
  IconButton,
  useTheme,
  Pagination,
  Stack,
} from "@mui/material";
import { Refresh, Add, Schedule } from "@mui/icons-material";
import {
  ITransaction,
  IWallet,
  TransactionsPagination,
} from "../../../types/wallet/wallet.types";
import walletService from "../../../services/wallet/walletService";
import { toast } from "sonner";
import AddFundsModal from "./AddFundsModal";
import { formatMonthDay, formatTime } from "../../../utils/dateUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";

const WalletPatient: React.FC = () => {
  const theme = useTheme();

  const [isAddFundsModalOpen, setAddFundsModalOpen] = useState<boolean>(false);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<TransactionsPagination>({
    page: 1,
    totalPages: 0,
    totalTransactions: 0,
  });

  const userRole = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    fetchWallet();
  }, [currentPage]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const { wallet, transactions, pagination } =
        await walletService.accessWallet(currentPage);

      setWallet(wallet);
      setTransactions(transactions);
      setPagination(pagination);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const getDisplayRange = () => {
    if (pagination.totalTransactions === 0) return { start: 0, end: 0 };

    const start = (pagination.page - 1) * 10 + 1;
    const end = Math.min(pagination.page * 10, pagination.totalTransactions);

    return { start, end };
  };

  const { start, end } = getDisplayRange();

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
                    disabled={loading}
                  >
                    <Refresh />
                  </IconButton>
                </Box>
              </Box>

              <Box mt={3} mb={2}>
                <Typography variant="h3" fontWeight="bold">
                  ₹{wallet?.balance.toFixed(2) || "0.00"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Last updated:{" "}
                  {wallet?.updatedAt
                    ? formatMonthDay(wallet.updatedAt)
                    : "Never"}
                </Typography>
              </Box>

              {userRole === "patient" && (
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
              )}
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
                label={`${pagination.totalTransactions || 0} transactions`}
                size="small"
                sx={{ backgroundColor: theme.palette.grey[200] }}
              />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}></Box>

            <List disablePadding>
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <React.Fragment key={transaction._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        py: 1.5,
                        px: 0,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight="medium">
                              {transaction.description}
                            </Typography>
                            {transaction.type === "debit" ? (
                              <Typography fontWeight="bold" color="error.main">
                                -₹{transaction.amount.toFixed(2)}
                              </Typography>
                            ) : (
                              <Typography
                                fontWeight="bold"
                                color="success.main"
                              >
                                +₹{transaction.amount.toFixed(2)}
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

            {/* Pagination */}
            {pagination.totalTransactions > 0 && pagination.totalPages > 1 && (
              <Box sx={{ mt: 3, mb: 2 }}>
                <Stack spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Showing {start} - {end} of {pagination.totalTransactions}{" "}
                    transactions
                  </Typography>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPagination-ul": {
                        justifyContent: "center",
                      },
                    }}
                  />
                </Stack>
              </Box>
            )}
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

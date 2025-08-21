import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Box,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Legend,
  ResponsiveContainer,
  Line,
  CartesianGrid,
} from "recharts";
import { Person } from "@mui/icons-material";

export const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [income, setIncome] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#4F46E5", "#16A34A", "#F59E0B", "#EF4444", "#06B6D4"];

  const fetchData = async () => {
    try {
      const [incomeRes, budgetRes, transactionRes, userRes] = await Promise.all(
        [
          axios.get(`/incomesbyUserID/${userId}`),
          axios.get(`/budgetsbyUserID/${userId}`),
          axios.get(`/transactionsByUserId/${userId}`),
          axios.get(`/user/${userId}`),
        ]
      );

      setIncome(incomeRes.data.data || []);
      setBudget(budgetRes.data.data || []);
      setTransactions(transactionRes.data.data || []);
      setUser(userRes.data.data || null);
    } catch (err) {
      console.error("Error fetching user details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const totalBudget = budget.reduce((sum, b) => sum + b.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Box sx={{ padding: 4, bgcolor: "#f3f4f6", minHeight: "100vh" }}>
      {loading ? (
        <>
          <Skeleton variant="text" width={300} height={50} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ mt: 2 }}
          />
        </>
      ) : (
        <>
          {/* Profile Section */}
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              mb: 4,
              p: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Avatar
              src={user?.profilePic || ""}
              sx={{
                width: 100,
                height: 100,
                bgcolor: "primary.main",
                mr: { md: 4, xs: 0 },
                mb: { xs: 2, md: 0 },
              }}
            >
              {!user?.profilePic && <Person fontSize="large" />}
            </Avatar>

            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold">
                {user?.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                📧 {user?.email}
              </Typography>
              <Chip
                label={user?.roleId?.name || "User"}
                color={user?.roleId?.name === "Admin" ? "error" : "primary"}
                sx={{ mt: 1 }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Extra Details */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Joined On
                  </Typography>
                  <Typography variant="body1">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Transactions
                  </Typography>
                  <Typography variant="body1">{transactions.length}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Bio
                  </Typography>
                  <Typography variant="body1">
                    {user?.bio || "No bio provided."}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* Stats Overview */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 3, bgcolor: "#eef2ff" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Income
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    ₹{totalIncome.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 3, bgcolor: "#ecfdf5" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Budget
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
                    ₹{totalBudget.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 3, bgcolor: "#fef2f2" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    ₹{totalExpense.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Income vs Expense Summary */}
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Income vs Expense
                  </Typography>
                  <ResponsiveContainer width={500} height={300}>
                    <BarChart
                      data={[
                        { name: "Income", amount: totalIncome },
                        { name: "Expense", amount: totalExpense },
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="amount"
                        fill="#4F46E5"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Monthly Income & Expense (Bar) */}
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Income & Expenses
                  </Typography>
                  <ResponsiveContainer width={400} height={300}>
                    <BarChart
                      data={(() => {
                        const grouped = {};
                        transactions.forEach((t) => {
                          const date = new Date(t.date);
                          const month = date.toLocaleString("default", {
                            month: "short",
                          });
                          if (!grouped[month])
                            grouped[month] = { month, expense: 0, income: 0 };
                          if (t.type === "expense")
                            grouped[month].expense += t.amount;
                          else grouped[month].income += t.amount;
                        });
                        return Object.values(grouped);
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="income"
                        fill="#16A34A"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        fill="#EF4444"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Yearly Trend (Line Chart) */}
            <Grid item xs={12}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Yearly Trend (All Months)
                  </Typography>
                  <ResponsiveContainer width={1000} height={350}>
                    <LineChart
                      data={(() => {
                        // Initialize all months
                        const months = [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];
                        const grouped = months.map((m) => ({
                          month: m,
                          expense: 0,
                          income: 0,
                        }));

                        transactions.forEach((t) => {
                          const date = new Date(t.date);
                          const month = date.toLocaleString("default", {
                            month: "short",
                          });
                          const entry = grouped.find((g) => g.month === month);
                          if (t.type === "expense") entry.expense += t.amount;
                          else entry.income += t.amount;
                        });
                        return grouped;
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#16A34A"
                        strokeWidth={3}
                        dot
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

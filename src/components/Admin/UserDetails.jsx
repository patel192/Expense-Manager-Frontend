import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Divider,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
    <Box sx={{ padding: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      {loading ? (
        <>
          <Skeleton variant="text" width={300} height={50} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[...Array(3)].map((_, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Skeleton variant="rectangular" width="100%" height={120} />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" width="100%" height={320} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" width="100%" height={320} />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          {/* User Info */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {user?.name} – Dashboard
          </Typography>
          <Typography variant="body1">📧 {user?.email}</Typography>
          <Typography variant="body1">👤 Role: {user?.roleId?.name}</Typography>

          <Divider sx={{ my: 3 }} />

          {/* Stats Overview */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
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
              <Card elevation={3} sx={{ borderRadius: 3 }}>
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
              <Card elevation={3} sx={{ borderRadius: 3 }}>
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
            <Grid item xs={12} md={12}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Income vs Expense
                  </Typography>
                  <ResponsiveContainer width={500} height={350}>
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

            <Grid item xs={12} md={12}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Expense by Category
                  </Typography>
                  <ResponsiveContainer width={400} height={350}>
                    <PieChart>
                      <Pie
                        data={transactions
                          .filter((t) => t.type === "expense")
                          .reduce((acc, t) => {
                            const cat = t.categoryId?.name || "Other";
                            const existing = acc.find((a) => a.name === cat);
                            if (existing) existing.value += t.amount;
                            else acc.push({ name: cat, value: t.amount });
                            return acc;
                          }, [])}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                        dataKey="value"
                      >
                        {transactions.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
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

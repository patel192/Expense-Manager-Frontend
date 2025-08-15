import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Card, CardContent, Typography } from "@mui/material";
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, incomeRes, transRes, budgetRes] = await Promise.all([
          axios.get(`/user/${userId}`),
          axios.get(`/incomesbyUserID/${userId}`),
          axios.get(`/transactions/${userId}`),
          axios.get(`/budgetsbyUserID/${userId}`),
        ]);

        setUser(userRes.data.data);
        console.log(userRes.data.data);
        setIncome(incomeRes.data.data);
        console.log(incomeRes.data.data);

        setTransactions(transRes.data.data);
        console.log(transRes.data.data);

        setBudget(budgetRes.data.data);
        console.log(budgetRes.data.data);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );

  return (
    <div style={{ padding: "30px" }}>
      {/* User Info */}
      <Typography variant="h4" gutterBottom>
        {user?.name} - Details
      </Typography>
      <Typography variant="body1">Email: {user?.email}</Typography>
      <Typography variant="body1">Role: {user?.roleId?.name}</Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#E3F2FD" }}>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{income.reduce((sum, inc) => sum + inc.amount, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#E8F5E9" }}>
            <CardContent>
              <Typography variant="h6">Total Budget</Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{budget.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#FFF8E1" }}>
            <CardContent>
              <Typography variant="h6">Total Transactions</Typography>
              <Typography variant="h4" fontWeight="bold">
                {transactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} style={{ marginTop: "30px" }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Income vs Expense
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Income",
                      amount: income.reduce((sum, inc) => sum + inc.amount, 0),
                    },
                    {
                      name: "Expense",
                      amount: transactions
                        .filter((t) => t.type === "expense")
                        .reduce((sum, exp) => sum + exp.amount, 0),
                    },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expense by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
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
                    labelLine={false}
                    outerRadius={100}
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
    </div>
  );
};

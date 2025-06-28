import axios from "axios";
import React, { useEffect, useState } from "react";
import "/Users/patel/Desktop/Expense-Manager-Frontend/src/assets/css/Transaction.css"; // Dark mode styles here

export const Transaction = () => {
  const [Expenses, setExpenses] = useState([]);
  const [Incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ExpenseRes = await axios.get(
          "http://localhost:3001/api/expensesbyUserID/" + localStorage.getItem("id")
        );
        const IncomeRes = await axios.get(
          "http://localhost:3001/api/incomesbyUserID/" + localStorage.getItem("id")
        );

        setExpenses(ExpenseRes.data.data);
        setIncomes(IncomeRes.data.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="transaction-container">
      <h2 className="section-title">Transactions</h2>

      <div className="table-wrapper">
        <h3 className="table-title">Expenses</h3>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {Expenses.map((expense) => (
              <tr key={expense._id}>
                <td>₹{expense.amount}</td>
                <td>{expense.description}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-wrapper">
        <h3 className="table-title">Incomes</h3>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Source</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {Incomes.map((income) => (
              <tr key={income._id}>
                <td>₹{income.amount}</td>
                <td>{income.source}</td>
                <td>{new Date(income.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

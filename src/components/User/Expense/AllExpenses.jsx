import React, { useEffect, useState } from "react";
import axios from "axios";
import "/Users/patel/Desktop/Expense-Manager-Frontend/src/assets/css/allexpenses.css"; // Import the new CSS

export const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/expensesbyUserID/" + localStorage.getItem("id")
        );
        setExpenses(res.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="expenses-container">
      <h2 className="expenses-title">All Expenses</h2>

      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <div key={expense._id} className="expense-card">
            <div className="expense-left">
              <h3 className="expense-desc">{expense.description}</h3>
              <p className="expense-date">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div className="expense-right">
              <div className="expense-amount">₹{expense.amount}</div>
              <button className="button">Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-expense-text">No expenses found...</p>
      )}
    </div>
  );
};

import React from "react";
import "/Users/patel/Desktop/Final Front end/Final Frontend/src/assets/css/Exepense.css";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]); // State to store fetched expenses
  
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res =await axios.get("http://localhost:3001/api/expenses"); 
        setExpenses(res.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    
    fetchExpenses();
  }, []);
  
  return (
    <div>
      <div style={{textAlign:"center",fontSize:"20px",color:"black"}}>All Expenses</div>
    {expenses.length > 0 ? (
      expenses.map((expense) => (
        <div key={expense.id} className="expense-card">
          <div className="expense-info">
            <h3 className="expense-title">Expense</h3>
            <p className="expense-category">{expense.description}</p>
          </div>
          <div className="expense-figure">
            <div className="expense-amount">₹{expense.amount}</div>
            <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
          </div>
          <div>
            <button style={{background:"red"}}>Delete</button></div>
        </div>
      ))
    ) : (
      <p>Loading expenses...</p>
    )}
  </div>

      
  );
};

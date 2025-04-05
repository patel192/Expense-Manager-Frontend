import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
export const ViewIncome = () => {
  const [incomes, setincomes] = useState([]); // State to store fetched expenses
  
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const res =await axios.get("http://localhost:3001/api/incomes"); 
        setincomes(res.data.data);
      } catch (error) {
        console.error("Error fetching Incomes:", error);
      }
    };
    
    fetchIncomes();
  }, []);
  return (
<div>
      <div style={{textAlign:"center",fontSize:"20px",color:"black"}}>All Expenses</div>
    {incomes.length > 0 ? (
      incomes.map((income) => (
        <div key={income.id} className="expense-card">
          <div className="expense-info">
            <h3 className="expense-title">Incomes</h3>
            <p className="expense-category">{income.source}</p>
          </div>
          <div className="expense-figure">
            <div className="expense-amount">₹{income.amount}</div>
            <div className="expense-date">{new Date(income.date).toLocaleDateString()}</div>
          </div>
          <div>
            <button style={{background:"red"}}>Delete</button></div>
        </div>
      ))
    ) : (
      <p>No expenses Found...</p>
    )}
  </div>
  )
}

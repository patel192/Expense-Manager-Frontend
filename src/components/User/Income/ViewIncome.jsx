import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
export const ViewIncome = () => {
  const [incomes, setincomes] = useState([]); // State to store fetched expenses
  
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const res =await axios.get("http://localhost:3001/api/incomesbyUserId/"+localStorage.getItem("id")); 
        setincomes(res.data.data);
        console.log(res.data.data)
      } catch (error) {
        console.error("Error fetching Incomes:", error);
      }
    };
    
    fetchIncomes();
  }, []);
  return (
<div>
      <div style={{textAlign:"center",fontSize:"20px",color:"black"}}>All Incomes</div>
    {incomes.length > 0 ? (
      incomes.map((income) => (
        <div key={income.id} className="expense-card">
          <div className="expense-info">
            <h3 className="expense-title" style={{color:"white"}}>Incomes</h3>
            <p className="expense-category" style={{color:"white"}}>{income.source}</p>
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
      <p>No Incomes Found...</p>
    )}
  </div>
  )
}

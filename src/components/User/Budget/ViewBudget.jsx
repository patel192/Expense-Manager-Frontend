import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
export const ViewBudget = () => {
  const [budgets, setbudgets] = useState([]);
  useEffect(() => {
    const Viewbudgets = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/budgets");
        setbudgets(res.data.data)
        console.log(res.data.data)
      } catch (error) {
        alert(error.message);
      }
    };
    Viewbudgets();
  },[]);

  return (
    <div>
      <div style={{textAlign:"center",fontSize:"20px",color:"black"}}>Budgets</div>
      {budgets.length > 0 ? (
        budgets?.map((budget) => (
          <div key={budget.id} className="expense-card">
          <div className="expense-info">
            <h3 className="expense-title">Budget</h3>
            <p className="expense-category">{budget.description}</p>
          </div>
          <div className="expense-figure">
            <div className="expense-amount">₹{budget.amount}</div>
            <div className="expense-date">{new Date(budget.start_date).toLocaleDateString()+ "-" + new Date(budget.end_date).toLocaleDateString()}</div>
          </div>
          <div>
            <button style={{color:'white'}}>Delete</button></div>
        </div>
        ))
      ):(<p>No Budget Found</p>)
    }
    </div>
  )
}

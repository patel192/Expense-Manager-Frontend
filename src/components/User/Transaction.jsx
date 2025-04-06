import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
export const Transaction = () => {
  const [Expenses, setExpenses] = useState([])
  const [Incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ExpenseRes = await axios.get(
        "http://localhost:3001/api/expensesbyUserID/" +
          localStorage.getItem("id")
      );
      const IncomeRes = await axios.get(
        "http://localhost:3001/api/incomesbyUserID/" +
          localStorage.getItem("id")
      );
      console.log(ExpenseRes.data.data);
      setExpenses(ExpenseRes.data.data)
      console.log(IncomeRes.data.data);
      setIncomes(IncomeRes.data.data)
    };
    fetchData()
  }),[];
  return (
    <div>
      <div>
        <label>Expenses</label>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
           {Expenses?.map((Expense)=>{
            return(
               <tr>
                <td>{Expense.amount}</td>
                <td>{Expense.description}</td>
                <td>{Expense.date}</td>
               </tr>
            )
           })}
            
          </tbody>
        </table>
      </div>
      <div>
        <label>Incomes</label>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Source</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {Incomes?.map((Income)=>{
                return(
                  <tr>
                    <td>{Income.amount}</td>
                    <td>{Income.source}</td>
                    <td>{Income.date}</td>
                  </tr>
                )    
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

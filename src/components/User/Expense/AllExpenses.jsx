import React, { useEffect, useState } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

export const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axiosInstance.get(
          `/expensesbyUserID/${localStorage.getItem("id")}`
        );
        setExpenses(res.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axiosInstance.delete(`/expense/${id}`);
        setExpenses((prev) => prev.filter((e) => e._id !== id));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  return (
    <div className="expenses-container" style={styles.container}>
      <h2 style={styles.title}>All Expenses</h2>

      {expenses.length > 0 ? (
        <div style={styles.list}>
          {expenses.map((expense) => (
            <div key={expense._id} style={styles.card}>
              <div style={styles.left}>
                <div style={styles.iconWrapper}>
                  <MdOutlineAttachMoney size={28} color="#4CAF50" />
                </div>
                <div>
                  <h3 style={styles.desc}>{expense.description}</h3>
                  <p style={styles.date}>
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div style={styles.right}>
                <div style={styles.amount}>₹{expense.amount}</div>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(expense._id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No expenses found...</p>
        </div>
      )}
    </div>
  );
};

// Inline styles for simplicity (can be moved to CSS file)
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    borderRadius: "10px",
    padding: "12px 16px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconWrapper: {
    background: "#f0fdf4",
    padding: "8px",
    borderRadius: "50%",
  },
  desc: {
    fontSize: "16px",
    fontWeight: "500",
    margin: 0,
  },
  date: {
    fontSize: "14px",
    color: "#777",
    margin: 0,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  amount: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#e53935",
  },
  deleteBtn: {
    background: "#ffebee",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#e53935",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    background: "#f9f9f9",
    borderRadius: "10px",
  },
  emptyText: {
    fontSize: "18px",
    color: "#777",
  },
};

import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast,Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const ManageUsers = () => {
  const [users, setusers] = useState([])
  useEffect(()=>{
    const fetchUsers = async () =>{
      try{
         const res = await axios.get("/users");
         console.log(res)
         setusers(res.data.data)
      }catch(error){
        alert("Error to fetch the users")
      }
    }
    fetchUsers()
  },[])
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/user/${userId}`);
      setusers(users.filter((user) => user._id !== userId));
      toast.success("User Deleted Successfully", {
        autoClose: 3000,
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
      
    } catch (error) {
      alert("Error deleting user");
    }
  };
  return (
    <div>
      <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}/>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user)=>{
            return(
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.email}</td>
            <td>{user.roleId.name}</td>
            <td><button onClick={()=> handleDelete(user._id)}>Delete</button></td>
          </tr>

            )
          })}
        </tbody>
      </table>
    </div>
  )
}

import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
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
      alert("User Deleted Successfully") // remove from state
    } catch (error) {
      alert("Error deleting user");
    }
  };
  return (
    <div>
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

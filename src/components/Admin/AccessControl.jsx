import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
export const Accesscontrol = () => {
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
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user)=>{
            return(
          <tr>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.email}</td>
            <td>{user.roleId.name}</td>
          </tr>

            )
          })}
        </tbody>
      </table>
    </div>
  )
}

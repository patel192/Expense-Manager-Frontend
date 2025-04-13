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
      <table class="table table-striped table-dark">
        <thead>
          <tr>
            <th style={{color:"white"}}>Name</th>
            <th style={{color:"white"}}>Age</th>
            <th style={{color:"white"}}>Email</th>
            <th style={{color:"white"}}>Role</th>
            <th style={{color:"white"}}>Is Active?</th>
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
            <td>{user.is_active === undefined ? 'N/A' : user.is_active ? 'Yes' : 'No'}</td>
          </tr>

            )
          })}
        </tbody>
      </table>
    </div>
  )
}

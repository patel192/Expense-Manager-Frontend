import React from "react";

import { useForm } from "react-hook-form";
import axios from "axios";


export const ForgotPassword = () => {
  const {register,handleSubmit}=useForm();
  ;
  const SubmitHandler = async (data) => {
        try{
          const check = await axios.get("/users");
          const res = await axios.post("/user/forgotpassword",data);
          const DataObj = check.data.data
          const exist = DataObj.find(user => user.email === data.email)
          if(exist){
            console.log("email exist")
            if(res.status === 200){
                alert("Email sent succefully")
            }
          }else{
            alert("Please Enter the registered email address")
          }
        }catch(error){
          console.error("Failed to send email")
          alert("Failed")
        }
  }
  return (
    <div>
      <div class="wrapper">
        <div class="title">Forgot Password</div>
        <form onSubmit={handleSubmit(SubmitHandler)}>
          <div class="field">
            <input type="text" {...register("email")} required />
            <label>Email Address</label>
          </div>

          <div class="field">
            <input type="submit" value="Reset" />
          </div>
        </form>
      </div>
    </div>
  );
};
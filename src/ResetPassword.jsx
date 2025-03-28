import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { data, useNavigate, useParams } from "react-router-dom";

export const ResetPassword = () => {
  const{register,handleSubmit} = useForm();
  const token = useParams().token
  const Navigate = useNavigate()
  const SubmitHandler = async (data) => {
    const Obj = {
      token:token,
      password:data.password
    }
    const res = await axios.post("/user/resetpassword",Obj)
    if(res.status === 200){
      alert("Password Updated Successfully")
      Navigate("/login")
    }else{
      alert("Internal Server error")
    }
    console.log(res.data)
  }
  return (
    <div>
      <div class="wrapper">
        <form onSubmit={handleSubmit(SubmitHandler)}>
          <div class="title">
             Reset Pssword
          </div>
          <div class="field">
            <input type="text" placeholder="Enter Your New Password" {...register("password")} required/>
          </div>
          <div class="field">
            <input type="submit" value="Reset Password" />
          </div>
        </form>
      </div>
    </div>
  );
};
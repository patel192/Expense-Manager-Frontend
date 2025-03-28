import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import "./assets/css/Login.css"
export const Login = () => {
  const Navigate = useNavigate()
   const {register,handleSubmit,formState:{errors}} = useForm();
   const SubmitHandler = async (data) => {
      console.log("Login form submitted with data:", data);
      try {
          const res = await axios.post("user/login", data);
          console.log("Response received:", res);
  
          // Debugging: Log response data
          console.log("Response Data:", res.data);
  
          // Check if response is successful
          if (res.status >= 200 && res.status < 300) {
              alert("Login Success");
  
              // Debugging: Check if res.data contains necessary fields
              console.log("User ID:", res.data?.data?._id);
              console.log("Role:", res.data?.data?.roleId?.name);
  
              // Ensure data exists before storing
              if (res.data?.data?._id && res.data?.data?.roleId?.name) {
                  localStorage.setItem("id", res.data.data._id);
                  localStorage.setItem("role", res.data.data.roleId.name);
  
                  // Navigate to appropriate dashboard
                  if (res.data.data.roleId.name === "User") {
                      Navigate("/dashboard");
                  } else if (res.data.data.roleId.name === "Admin") {
                      Navigate("/admindashboard");
                  }
              } else {
                  console.error("Invalid response structure, missing required fields.");
                  alert("Login failed: Missing user details in response.");
              }
              return;
          }
      } catch (error) {
          console.error("Login error:", error);
  
          if (error.response) {
              alert("Login Failed: " + error.response.data.message);
          } else {
              alert("Login Failed: Server is unreachable");
          }
      }
  };
  
  
   const ErrorHandler = {
      emailHandler:{
         required:{
            value:true,
            message:"The Email is required"
         },
         pattern:{
            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message:"Please Enter The Valid Email Address"
         }
      },
      passwordHandler:{
         required:{
            value:true,
            message:"The Password is required"
         }
      }
   }
  return (
    <div>
     <div class="wrapper">
         <div class="title">
            Login Form
         </div>
         <form onSubmit={handleSubmit(SubmitHandler)}>
            <div class="field">
               <input type="text"  {...register("email",ErrorHandler.emailHandler)} />
               <label>Email Address</label>
               {errors.email?.message}
            </div>
            <div class="field">
               <input type="password" {...register("password",ErrorHandler.passwordHandler)} />
               <label>Password</label>
               {errors.password?.message}
            </div>
            <div class="content">
               <div class="checkbox">
                  <input type="checkbox" id="remember-me" />
                  <label for="remember-me">Remember me</label>
               </div>
               <div class="pass-link">
                  <a href="/forgotpassword">Forgot password?</a>
               </div>
            </div>
            <div class="field">
               <input type="submit" value="Login" />
            </div>
            <div class="signup-link">
               Not a member? <a href="/signup">Signup now</a>
            </div>
         </form>
      </div>
      </div>
  )
}

import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ToastContainer, toast,Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const SubmitHandler = async (data) => {
    console.log("Login form submitted with data:", data);
    try {
      const res = await axios.post("user/login", data);
      console.log("Response received:", res);

      // Debugging: Log response data
      console.log("Response Data:", res.data);

      // Check if response is successful
      if (res.status >= 200 && res.status < 300) {
        toast.success("Login Success", {
          style: {
            backgroundColor: "#1e293b", // green
            color: "white",
          },
        });
        

        // Debugging: Check if res.data contains necessary fields
        console.log("User ID:", res.data?.data?._id);
        console.log("Role:", res.data?.data?.roleId?.name);

        // Ensure data exists before storing
        if (res.data?.data?._id && res.data?.data?.roleId?.name) {
          localStorage.setItem("id", res.data.data._id);
          localStorage.setItem("role", res.data.data.roleId.name);
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: res.data.data.name,
              email: res.data.data.email,
              role: res.data.data.roleId.name,
            })
          );

          // Navigate to appropriate dashboard

          setTimeout(() => {
            if (res.data.data.roleId.name === "User") {
              Navigate("/private/userdashboard");
            } else if (res.data.data.roleId.name === "Admin") {
              Navigate("/admin/admindashboard");
            }
          }, 2000);
        } else {
          console.error("Invalid response structure, missing required fields.");
          alert("Login failed: Missing user details in response.");
        }
        return;
      }
    } catch (error) {
      toast.error(
        "Login Failed: " +
          (error.response?.data?.message || "Server is unreachable")
      );
    }
  };

  const ErrorHandler = {
    emailHandler: {
      required: {
        value: true,
        message: "The Email is required",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please Enter The Valid Email Address",
      },
    },
    passwordHandler: {
      required: {
        value: true,
        message: "The Password is required",
      },
    },
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
      transition={Bounce}
      />
      <div class="wrapper">
        <div class="title">Login Form</div>
        <form onSubmit={handleSubmit(SubmitHandler)}>
          <div class="field">
            <input
              type="text"
              {...register("email", ErrorHandler.emailHandler)}
            />
            <label>Email Address</label>
            {errors.email?.message}
          </div>
          <div class="field">
            <input
              type="password"
              {...register("password", ErrorHandler.passwordHandler)}
            />
            <label>Password</label>
            {errors.password?.message}
          </div>
          <div class="content">
            <div class="pass-link">
              <a href="/forgotpassword">Forgot password?</a>
            </div>
          </div>
          <div class="signup-button">
            <input type="submit" className="signup-btn" value="Login" />
          </div>
          <div class="signup-link">
            Not a member? <a href="/signup">Signup now</a>
          </div>
        </form>
      </div>
    </div>
  );
};

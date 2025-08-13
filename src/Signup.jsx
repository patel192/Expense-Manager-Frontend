import React from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user", data); // Correct API path

      if (res.status === 201) {
        toast.success("User Created Successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        console.log(res.data);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        alert("User not created");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup Failed");
    }
  };

  const ErrorHandler = {
    NameHandler: {
      required: {
        value: true,
        message: "The name is required",
      },
    },
    AgeHandler: {
      required: {
        value: true,
        message: "The age is required",
      },
      min: {
        value: 18,
        message: "The Minimum age should be 18",
      },
    },
    EmailHandler: {
      required: {
        value: true,
        message: "The email is required",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Enter the valid email",
      },
    },
    PasswordHandler: {
      required: {
        value: true,
        message: "The password is required",
      },
      minLength: {
        value: 8,
        message: "The Minimum length of password should be 8",
      },
      maxLength: {
        value: 20,
        message: "The Maximum length of password should be 20",
      },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "Use strong password",
      },
    },
  };
  return (
    <div class="container">
      <ToastContainer/>
      <div class="content">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div class="user-details">
            <div class="input-box">
              <span class="details">Name</span>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", ErrorHandler.NameHandler)}
              />
              {errors.name?.message}
            </div>
            <div class="input-box">
              <span class="details">Age</span>
              <input
                type="Number"
                placeholder="Enter your number"
                min="18"
                {...register("age", ErrorHandler.AgeHandler)}
              />
              {errors.age?.message}
            </div>
            <div class="input-box">
              <span class="details">Email</span>
              <input
                type="text"
                placeholder="Enter your email"
                {...register("email", ErrorHandler.EmailHandler)}
              />
              {errors.email?.message}
            </div>
            <div class="input-box">
              <span class="details">Password</span>
              <input
                type="text"
                placeholder="Enter your password"
                {...register("password", ErrorHandler.PasswordHandler)}
              />
              {errors.password?.message}
            </div>
          </div>
          <div class="Role-details">
            <input
              type="radio"
              name="role-id"
              id="dot-1"
              value="67da4c20d58329a643242b24"
              {...register("roleId", {
                required: "Role selection is required",
              })}
            />
            <input
              type="radio"
              name="role-id"
              id="dot-2"
              value="67da4c13d58329a643242b22"
              {...register("roleId", {
                required: "Role selection is required",
              })}
            />

            <span class="Role-title">Role</span>
            <div class="category">
              <label for="dot-1">
                <span class="dot one"></span>
                <span class="gender">User</span>
              </label>
              <label for="dot-2">
                <span class="dot two"></span>
                <span class="gender">Admin</span>
              </label>
            </div>
          </div>

          <div class="signup-button">
            <input type="submit" className="signup-btn" value="Sign Up" />
          </div>
        </form>
      </div>
      <div class="login-link">
        Already a member? <a href="/login">Login now</a>
      </div>
    </div>
  );
};

import React, { useEffect } from "react";
import { useFormik } from "formik";
import { loginSchema } from "../schemas";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { userEndpoints } from "../api/endpoints/userEndpoints";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/chats");
    }
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, action) => {
        try {
          console.log(values);

          const response = await axios.post(
            userEndpoints.loginUser(),
            { email: values.email, password: values.password },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );
          console.log(response);

          if (response?.data?.success) {
            toast.success(response?.data?.message);
            setIsAuthenticated(true);
            // localStorage.setItem("userInfo", JSON.stringify(response.data));
            navigate("/chats");
          } else {
            toast.message(response?.data?.message);
          }
        } catch (error) {
          toast.error("Invalid credentials");
          console.log(error);
        }

        action.resetForm();
      },
    });

  return (
    <>
      <div className="min-h-[350px]">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              autoComplete="off"
              name="email"
              id="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border w-3/4 mt-4 sm:mt-2 px-3 sm:px-2 py-4 sm:py-3 rounded"
            />
            {errors.email && touched.email ? (
              <p className="text-red-800">{errors.email}</p>
            ) : null}
          </div>

          <div>
            <input
              type="password"
              autoComplete="off"
              name="password"
              id="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border w-3/4 mt-4 sm:mt-2 px-3 sm:px-2 py-4 sm:py-3 rounded"
            />
            {errors.password && touched.password ? (
              <p className="text-red-800">{errors.password}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="mt-10 sm:mt-10 px-6 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-700 w-3/4"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;

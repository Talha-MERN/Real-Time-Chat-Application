import React, { useRef } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { signupSchema } from "../schemas";
import PreviewProfileImage from "../layouts/PreviewProfileImage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import { useUserStore } from "../stores/useUserStore";
import { userEndpoints } from "../api/endpoints/userEndpoints";

const initialValues = {
  name: "",
  email: "",
  password: "",
  profilePicture: null,
};

const Signup = () => {
  const navigate = useNavigate();
  // const { isAuthenticated, setIsAuthenticated } = useUserStore();
  const fileRef = useRef(null);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, action) => {
      try {
        console.log(values);

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        if (values.profilePicture) {
          formData.append("profilePicture", values.profilePicture);
        }

        const response = await axios.post(
          userEndpoints.registerUser(),
          formData,
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
          localStorage.setItem("userInfo", JSON.stringify(response.data));
          // setIsAuthenticated(true);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error("Invalid credentials");
        // console.log(error);
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
              type="text"
              autoComplete="off"
              name="name"
              id="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border w-3/4 mt-4 sm:mt-2 px-3 sm:px-2 py-4 sm:py-2 rounded"
            />
            {errors.name && touched.name ? (
              <p className="text-red-800">{errors.name}</p>
            ) : null}
          </div>

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
              className="border w-3/4 mt-4 sm:mt-2 px-3 sm:px-2 py-4 sm:py-2 rounded"
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
              className="border w-3/4 mt-4 sm:mt-2 mb-4 sm:mb-2 px-3 sm:px-2 py-4 sm:py-2 rounded"
            />
            {errors.password && touched.password ? (
              <p className="text-red-800">{errors.password}</p>
            ) : null}
          </div>

          <div className="flex justify-center mt-3 gap-3">
            <input
              hidden
              ref={fileRef}
              type="file"
              autoComplete="off"
              name="profilePicture"
              id="profilePicture"
              // placeholder="Profile Picture"
              // value={values.profilePicture}
              onChange={(event) =>
                setFieldValue("profilePicture", event.target.files[0])
              }
              onBlur={handleBlur}
              className="border w-3/4 mt-4 sm:mt-2 px-3 sm:px-2 py-4 sm:py-3 rounded"
            />
            {values.profilePicture && (
              <PreviewProfileImage file={values.profilePicture} />
            )}
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                fileRef.current.click();
              }}
            >
              Upload Your <br></br> Profile Picture
            </button>
            {errors.profilePicture && touched.profilePicture ? (
              <p className="text-red-800">{errors.profilePicture}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="mt-5 sm:mt-10 px-6 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-700 w-3/4"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;

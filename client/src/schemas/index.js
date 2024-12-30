import * as Yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const signupSchema = Yup.object({
  name: Yup.string().required("Please enter your username"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
  profilePicture: Yup.mixed()
    .nullable()
    .test(
      "FILE_SIZE",
      "Uploaded File is too big.",
      (value) => !value || (value && value.size <= 1024 * 1024)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file has unsupported Format.",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    ),
});

export const loginSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
});

import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { loginStyles, loginTheme } from "../../common/styles";
import { useFormik } from "formik";
import CopyrightOutlinedIcon from "@mui/icons-material/CopyrightOutlined";
import "./Login.css";
import * as yup from "yup";
import { login } from "../../common/Services/apiServices";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../navigation/NavigationBar";
import { useDispatch } from "react-redux";
import { EMPTY } from "../../common/constants";
import { showNotification } from "../../common/Notification";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lockIconStyle, textFieldStyle, footerStyle } = loginStyles();
  const formik = useFormik({
    initialValues: { emailAddress: EMPTY, password: EMPTY },
    validationSchema: yup.object().shape({
      emailAddress: yup
        .string()
        .email("Invalid Email")
        .required("Email address is required."),
      password: yup.string().min(8).required("Password is required."),
    }),
    onSubmit: async (values) => {
      const payload = {
        username: values.emailAddress,
        password: values.password,
      };
      const result = await login(payload);
      if (result && result.token) {
        dispatch({
          type: "UPDATE_USER_DETAILS",
          isLoggedIn: true,
          roles: result.userRoles,
          isAdmin: result.userRoles.indexOf("ADMIN") != -1,
        })
        localStorage.setItem("token", result.token);
        showNotification("Logged in successfully!", "success");
        navigate("/");
      }
    },
  });

  return (
    <MuiThemeProvider theme={loginTheme}>
      <Grid container direction="column" height="100vh">
        <Grid
          item
          display="flex"
          flexDirection="column"
          justifyContent="center"
          justifyItems="center"
        >
          <NavigationBar />
        </Grid>
        <Grid
          item
          width="30%"
          display="flex"
          alignSelf="center"
          flexDirection="column"
          justifyContent="center"
          justifyItems="center"
          flexGrow={1}
          top="20%"
        >
          <Grid
            item
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <LockOutlinedIcon
              fontSize="medium"
              className={lockIconStyle}
            />
            <Typography variant="h5">Sign in</Typography>
          </Grid>
          <Grid
            item
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap="20px"
            marginTop="18px"
            marginBottom="18px"
          >
            <TextField
              name="emailAddress"
              variant="outlined"
              label="Email Address*"
              error={formik.errors.emailAddress}
              value={formik.values.emailAddress}
              onChange={formik.handleChange}
              helperText={formik.errors.emailAddress}
              className={textFieldStyle}
            ></TextField>
            <TextField
              name="password"
              type="password"
              variant="outlined"
              label="Password*"
              error={formik.errors.password}
              value={formik.values.password}
              onChange={formik.handleChange}
              helperText={formik.errors.password}
              className={textFieldStyle}
            ></TextField>
            <Button id="signInBtn" onClick={formik.handleSubmit}>
              Sign In
            </Button>
            <Button variant="body" id="signInText" onClick={() => navigate('/signUp')}>
              Don't have an account? Sign Up
            </Button>
          </Grid>
          <Grid
            item
            justifyContent="center"
            display="flex"
            alignItems="flex-start"
          >
            <Typography
              variant="body"
              className={footerStyle}
            >
              Copyright <CopyrightOutlinedIcon /> <span> upGrad </span> 2024
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};
export default Login;

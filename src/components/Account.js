import React, { useState, useEffect } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";

import clsx from "clsx";

import axios from "axios";
import { authMiddleWare } from "../util/auth";
import { useNavigate } from "react-router";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  root: {},
  details: {
    display: "flex",
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  locationText: {
    paddingLeft: "15px",
  },
  buttonProperty: {
    position: "absolute",
    top: "50%",
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  progess: {
    position: "absolute",
  },
  uploadButton: {
    marginLeft: "8px",
    margin: theme.spacing(1),
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10,
  },
  submitButton: {
    marginTop: "10px",
  },
});

const Account = ({ classes, ...rest }) => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    country: "",
    profilePicture: "",
  });

  const [buttonLoading, setButtonLoading] = useState(false);
  const [image, setImage] = useState();
  const [content, setContent] = useState();
  const [imageError, setImageError] = useState("");
  const [uiLoading, setUiLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = authMiddleWare(navigate);
    axios.defaults.headers.common = authToken;

    axios
      .get("/user")
      .then((response) => {
        console.log(response.data);
        setState({
          ...response.data.userCredentials,
        });
        setUiLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/login");
        }
        setState({ errorMsg: "Error in retrieving the data" });
        console.log(error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const profilePictureHandler = (event) => {
    event.preventDefault();
    setUiLoading(true);
    authMiddleWare(navigate);
    const authToken = localStorage.getItem("AuthToken");
    let form_data = new FormData();
    form_data.append("image", image);
    form_data.append("content", content);
    axios.defaults.headers.common = {
      Authorization: "Bearer " + authToken,
    };
    axios
      .post("/user/image", form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/login");
        }
        console.log(error);
        setUiLoading(false);
        setImageError("Error in posting the data");
      });
  };

  const updateFormValues = (event) => {
    event.preventDefault();
    setButtonLoading(true);
    authMiddleWare(navigate);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: "Bearer " + authToken };
    const formRequest = {
      firstName: state.firstName,
      lastName: state.lastName,
      country: state.country,
    };
    axios
      .post("/user", formRequest)
      .then(() => {
        setButtonLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/login");
        }
        console.log(error);
        setButtonLoading(false);
      });
  };

  if (uiLoading === true) {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {uiLoading && (
          <CircularProgress size={150} className={classes.uiProgress} />
        )}
      </main>
    );
  } else {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Card {...rest} className={clsx(classes.root, classes)}>
          <CardContent>
            <div className={classes.details}>
              <div>
                <Typography
                  className={classes.locationText}
                  gutterBottom
                  variant="h4"
                >
                  {state.firstName} {state.lastName}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  className={classes.uploadButton}
                  onClick={profilePictureHandler}
                >
                  Upload Photo
                </Button>
                <Button variant="outlined" size="small" component="label">
                  Upload File
                  <input type="file" onChange={handleImageChange} hidden />
                </Button>

                {imageError ? (
                  <div className={classes.customError}>
                    Wrong Image Format || Supported Format are PNG and JPG
                  </div>
                ) : (
                  false
                )}
              </div>
            </div>
            <div className={classes.progress} />
          </CardContent>
          <Divider />
        </Card>

        <br />
        <Card {...rest} className={clsx(classes.root, classes)}>
          <form autoComplete="off" noValidate>
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="First name"
                    margin="dense"
                    name="firstName"
                    variant="outlined"
                    value={state.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Last name"
                    margin="dense"
                    name="lastName"
                    variant="outlined"
                    value={state.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    margin="dense"
                    name="email"
                    variant="outlined"
                    disabled={true}
                    value={state.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    margin="dense"
                    name="phone"
                    type="number"
                    variant="outlined"
                    disabled={true}
                    value={state.phoneNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="User Name"
                    margin="dense"
                    name="userHandle"
                    disabled={true}
                    variant="outlined"
                    value={state.username}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    margin="dense"
                    name="country"
                    variant="outlined"
                    value={state.country}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions />
          </form>
        </Card>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          className={classes.submitButton}
          onClick={updateFormValues}
          disabled={
            buttonLoading ||
            !state.firstName ||
            !state.lastName ||
            !state.country
          }
        >
          Save details
          {buttonLoading && (
            <CircularProgress size={30} className={classes.progress} />
          )}
        </Button>
      </main>
    );
  }
};

export default withStyles(styles)(Account);

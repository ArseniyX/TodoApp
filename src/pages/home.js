import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import Account from "../components/Account";
import Todo from "../components/Todo";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import NotesIcon from "@material-ui/icons/Notes";
import Avatar from "@material-ui/core/avatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from "react-router";

import { authMiddleWare } from "../util/auth";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  avatar: {
    height: 110,
    width: 110,
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20,
  },
  uiProgress: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  toolbar: theme.mixins.toolbar,
});

const Home = ({ classes }) => {
  const [render, setRender] = useState(false);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    profilePicture: "",
    uiLoading: true,
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    authMiddleWare(navigate);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = {
      Authorization: "Bearer " + authToken,
    };
    console.log(authToken);
    axios
      .get("/user")
      .then((response) => {
        setState({
          ...response.data.userCredentials,
          uiLoading: false,
        });
        console.log(response.data, authToken);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/login");
        }
        console.log(error);
        setErrorMsg("Error in retrieving the data");
      });
  }, []);

  const loadAccountPage = () => {
    setRender(true);
  };

  const loadTodoPage = () => {
    setRender(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem("AuthToken");
    navigate("/login");
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            TodoApp
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Divider />
        <center>
          <Avatar src={state?.imageUrl} className={classes.avatar} />
          <p>
            {state.firstName} {state.lastName}
          </p>
        </center>
        <Divider />
        <List>
          <ListItem button key="Todo" onClick={loadTodoPage}>
            <ListItemIcon>
              <NotesIcon />
            </ListItemIcon>
            <ListItemText primary="Todo" />
          </ListItem>

          <ListItem button key="Account" onClick={loadAccountPage}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>

          <ListItem button key="Logout" onClick={logoutHandler}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <div>{render ? <Account /> : <Todo />}</div>
    </div>
  );
};

export default withStyles(styles)(Home);

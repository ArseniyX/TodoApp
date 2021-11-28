import React, { useState, useEffect, useRef } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";

import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";
import { useNavigate } from "react-router";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  submitButton: {
    display: "block",
    color: "white",
    textAlign: "center",
    position: "absolute",
    top: 14,
    right: 10,
  },
  floatingButton: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
  form: {
    margin: 13,
    marginTop: theme.spacing(10),
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: 350,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  pos: {
    marginBottom: 12,
  },
  uiProgress: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "53%",
    top: "35%",
  },
  dialogStyle: {
    maxWidth: "50%",
  },
  viewRoot: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Transition = (props) => {
  const transitionRef = useRef();
  return <Slide direction="up" ref={transitionRef} {...props} />;
};

const Todo = (props) => {
  const [state, setState] = useState({
    todos: [],
    title: "",
    body: "",
    todoId: "",
    buttonType: "",
    errors: [],
    open: false,
    viewOpen: false,
  });
  const [uiLoading, setUiLoading] = useState(true);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const authToken = authMiddleWare(navigate);
    axios.defaults.headers.common = authToken;
    axios
      .get("/todos")
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          todos: response.data,
        }));
        setUiLoading(false);
        console.log("test");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteTodoHandler = (data) => {
    const authToken = authMiddleWare(navigate);
    axios.defaults.headers.common = authToken;
    const todoId = data.todo.todoId;
    axios
      .delete(`todo/${todoId}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditClickOpen = (data) => {
    setState((prevState) => ({
      ...prevState,
      title: data.todo.title,
      body: data.todo.body,
      todoId: data.todo.todoId,
      buttonType: "Edit",
      open: true,
    }));
  };

  const handleViewOpen = (data) => {
    setState((prevState) => ({
      ...prevState,
      title: data.todo.title,
      body: data.todo.body,
      viewOpen: true,
    }));
  };

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    viewRoot: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);

  dayjs.extend(relativeTime);
  const { classes } = props;
  const { open, errors, viewOpen } = state;

  const handleClickOpen = () => {
    setState((prevState) => ({
      ...prevState,
      todoId: "",
      title: "",
      body: "",
      buttonType: "",
      open: true,
    }));
  };

  const handleSubmit = (event) => {
    const authToken = authMiddleWare(navigate);
    event.preventDefault();
    const userTodo = {
      title: state.title,
      body: state.body,
    };
    let options = {};
    if (state.buttonType === "Edit") {
      options = {
        url: `/todo/${state.todoId}`,
        method: "put",
        data: userTodo,
      };
    } else {
      options = {
        url: "/todo",
        method: "post",
        data: userTodo,
      };
    }
    axios.defaults.headers.common = authToken;
    axios(options)
      .then(() => {
        setState((prevState) => ({ ...prevState, open: false }));
        window.location.reload();
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          open: true,
          errors: error.response.data,
        }));
        console.log(error);
      });
  };
  const handleViewClose = () => {
    setState((prevState) => ({ ...prevState, viewOpen: false }));
  };

  const handleClose = () => {
    setState((prevState) => ({ ...prevState, open: false }));
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

        <IconButton
          className={classes.floatingButton}
          color="primary"
          aria-label="Add Todo"
          onClick={handleClickOpen}
        >
          <AddCircleIcon style={{ fontSize: 60 }} />
        </IconButton>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {state.buttonType === "Edit"
                  ? "Edit Todo"
                  : "Create a new Todo"}
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={(e) => handleSubmit(e)}
                className={classes.submitButton}
              >
                {state.buttonType === "Edit" ? "Save" : "Submit"}
              </Button>
            </Toolbar>
          </AppBar>

          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="todoTitle"
                  label="Todo Title"
                  name="title"
                  autoComplete="todoTitle"
                  helperText={errors.title}
                  value={state.title}
                  error={errors.title ? true : false}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="todoDetails"
                  label="Todo Details"
                  name="body"
                  autoComplete="todoDetails"
                  multiline
                  rows={12}
                  rowsMax={12}
                  helperText={errors.body}
                  error={errors.body ? true : false}
                  onChange={handleChange}
                  value={state.body}
                />
              </Grid>
            </Grid>
          </form>
        </Dialog>

        <Grid container spacing={2}>
          {state.todos.map((todo) => (
            <Grid item xs={12} sm={6}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {todo.title}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {dayjs(todo.createdAt).fromNow()}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {`${todo.body.substring(0, 65)}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleViewOpen({ todo })}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditClickOpen({ todo })}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => deleteTodoHandler({ todo })}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          onClose={handleViewClose}
          aria-labelledby="customized-dialog-title"
          open={viewOpen}
          fullWidth
          classes={{ paperFullWidth: classes.dialogStyle }}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
            {state.title}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              id="todoDetails"
              name="body"
              multiline
              readonly
              rows={1}
              rowsMax={25}
              value={state.body}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    );
  }
};
export default withStyles(styles)(Todo);

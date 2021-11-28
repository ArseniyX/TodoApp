import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createTheme from "@material-ui/core/styles/createTheme";

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#33c9dc",
        main: "#FF5722",
        dark: "#d50000",
        contrastText: "#fff",
      },
    },
  });
  return (
    <MuiThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/signup" element={<Signup />} exact />
      </Routes>
    </MuiThemeProvider>
  );
};

export default App;

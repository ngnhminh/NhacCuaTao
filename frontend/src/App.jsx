import { Router, Route} from "@solidjs/router";
import MainLayout from "./layout/MainLayout";
import LoginLayout from "./layout/LoginLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      {/* Các route sử dụng MainLayout */}
      {/* <Route path="/" component={MainLayout}>
        <Route path="/" component={Home} />
      </Route> */}

      {/* Các route sử dụng LoginLayout */}
      <Route path="/" component={LoginLayout}>
        <Route path="/" component={Login} />
      </Route>
    </Router>
  );
};

export default App;

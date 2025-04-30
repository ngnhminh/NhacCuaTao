import { Router, Route} from "@solidjs/router";
import MainLayout from "./layout/MainLayout";
import LoginLayout from "./layout/LoginLayout";
import RegisterLayout from "./layout/RegisterLayout";
import Home from "./pages/Home";
import { AuthProvider } from "./layout/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import AdminPage from "./pages/AdminPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Layout chính */}
        <Route path="/" component={MainLayout}>
          <Route path="/" component={Home} />
        </Route>

        {/* Login layout */}
        <Route path="/login" component={LoginLayout} />
        
        {/* Register layout */}
        <Route path="/register" component={RegisterLayout} />

        <Route path="/admin/login" component={AdminLogin} />

        {/* Admin */}
        <Route path="/admin" component={AdminPage} />

      </Router>
    </AuthProvider>
  );
};

export default App;

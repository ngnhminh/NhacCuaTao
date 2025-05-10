import { Router, Route } from '@solidjs/router';
import MainLayout from './layout/MainLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Album from './pages/Album';
import Playlist from './pages/Playlist';
import FavoriteListPage from './pages/FavoriteListPage';
import Artist from './pages/Artist';
import { AuthProvider } from './layout/AuthContext';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';
import Profile from './pages/Profile';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                {/* Layout chính */}
                <Route path="/" component={MainLayout}>
                    <Route path="/" component={Home} />
                    <Route path="/album/:id" component={Album} />
                    <Route path="/artist/:id" component={Artist} />
                    <Route path="/playlist/:id" component={Playlist} />
                    <Route path="/favorite" component={FavoriteListPage} />
                    <Route path="/profile" component={Profile} />
                </Route>

                {/* Login layout */}
                <Route path="/login" component={Login} />

                {/* Register layout */}
                <Route path="/register" component={Register} />

                <Route path="/admin/login" component={AdminLogin} />

                {/* Admin */}
                <Route path="/admin" component={AdminPage} />
            </Router>
        </AuthProvider>
    );
};

export default App;

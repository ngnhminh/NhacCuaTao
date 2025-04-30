import { Router, Route } from '@solidjs/router';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import SidePart from './components/SidePart';

const App = () => {
    return (
        <Router root={MainLayout}>
            <Route path="/" component={Home} />
            <Route path="/sb" component={SidePart} />
        </Router>
    );
};

export default App;

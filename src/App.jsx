import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/guards/PrivateRoute';
import GuestRoute from './components/guards/GuestRoute';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import Catalog from './pages/Catalog/Catalog';
import TrailDetails from './pages/TrailDetails/TrailDetails';
import UserProfile from './pages/UserProfile/UserProfile';
import CreateTrail from './pages/CreateTrail/CreateTrail';
import EditTrail from './pages/EditTrail/EditTrail';
import MyTrails from './pages/MyTrails/MyTrails';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trails" element={<Catalog />} />
        <Route path="/trails/:trailId" element={<TrailDetails />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />}>
          <Route path="/trails/new" element={<CreateTrail />} />
          <Route path="/trails/:trailId/edit" element={<EditTrail />} />
          <Route path="/my-trails" element={<MyTrails />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

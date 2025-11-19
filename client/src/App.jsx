import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostItem from './pages/PostItem';
import PrivateRoute from './components/PrivateRoute';
import ItemDetail from './pages/ItemDetail'; // ItemDetail is correctly imported!

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ⚠️ FIX APPLIED: ADDED THE DYNAMIC ITEM DETAIL ROUTE ⚠️ */}
          <Route path="/item/:id" element={<ItemDetail />} /> 
          
          {/* --- Private Routes Group --- */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post" element={<PostItem />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
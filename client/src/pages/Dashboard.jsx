// client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css'; // New styles for layout and filters

const CATEGORIES = ['Electronics', 'Keys', 'Wallets/Purses', 'Bags/Backpacks', 'Clothing', 'ID/Documents', 'Jewelry', 'Other'];

function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '', // Lost or Found
    category: '',
    search: ''
  });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct query string from filters
      const query = new URLSearchParams(filters).toString();
      
      // GET /api/items?type=Lost&category=Electronics...
      const res = await axios.get(`/api/items?${query}`); 
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]); // Refetch data whenever filters change

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) return <h2 className="dashboard-title">Loading items...</h2>;
  if (error) return <h2 className="dashboard-title error-message-text">{error}</h2>;

  return (
    <div className="dashboard-layout">
      <h1 className="dashboard-title">Welcome Back, {user.name.split(' ')[0]}!</h1>
      
      <div className="filter-bar">
        {/* Type Filter */}
        <select name="type" onChange={handleFilterChange} value={filters.type} className="filter-select">
          <option value="">All Items</option>
          <option value="Lost">Lost Items</option>
          <option value="Found">Found Items</option>
        </select>

        {/* Category Filter */}
        <select name="category" onChange={handleFilterChange} value={filters.category} className="filter-select">
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        {/* Search Input (Future: Implement client-side search or add to API) */}
        <input 
          type="text" 
          name="search" 
          placeholder="Search by title or description..." 
          value={filters.search} 
          onChange={handleFilterChange} 
          className="filter-input"
        />
      </div>

      <div className="item-grid">
        {items.length > 0 ? (
          items.map(item => <ItemCard key={item._id} item={item} />)
        ) : (
          <p className="no-items-message">No items found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
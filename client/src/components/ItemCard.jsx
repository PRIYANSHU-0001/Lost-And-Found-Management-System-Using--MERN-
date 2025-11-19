// client/src/components/ItemCard.jsx

import React from 'react';
import '../styles/ItemCard.css'; 

function ItemCard({ item }) {
  // Determine color based on item type
  const typeColor = item.type === 'Lost' ? 'item-card-lost' : 'item-card-found';
  const typeLabel = item.type === 'Lost' ? 'LOST' : 'FOUND';

  // Format date nicely
  const dateStr = new Date(item.dateOccurred).toLocaleDateString();

  return (
    <div className={`item-card ${typeColor}`}>
      <div className="item-card-header">
        <span className="item-type-badge">{typeLabel}</span>
        <span className="item-status-badge">{item.status}</span>
      </div>
      
      <div className="item-card-image-container">
        {/* Placeholder image, replace with actual Cloudinary URL */}
        <img src={item.images[0] || 'placeholder.jpg'} alt={item.title} className="item-card-image" />
      </div>
      
      <div className="item-card-body">
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-detail">📍 {item.location}</p>
        <p className="item-card-detail">📅 {dateStr}</p>
        <p className="item-card-detail item-card-category">{item.category}</p>
      </div>
      
      <div className="item-card-footer">
        {/* TO-DO: Implement detailed view link */}
        <button className="btn btn-detail">View Details</button>
      </div>
    </div>
  );
}


export default ItemCard;
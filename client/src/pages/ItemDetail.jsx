// client/src/pages/ItemDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To check login status
import '../styles/ItemDetail.css'; 

function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current logged-in user info
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                // Send GET request to the backend API. The backend is set up to POPULATE the poster field (name, email, universityId).
                const res = await axios.get(`/api/items/${id}`);
                setItem(res.data);
            } catch (err) {
                console.error("Error fetching item details:", err);
                setError('Failed to load item details. It might be archived or deleted.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <h2 className="detail-loading">Loading Item Details...</h2>;
    if (error) return <h2 className="detail-error">{error}</h2>;
    if (!item) return <h2 className="detail-error">Item data is missing.</h2>;

    // Determine colors
    const typeColor = item.type === 'Lost' ? 'detail-lost' : 'detail-found';
    const typeLabel = item.type === 'Lost' ? 'LOST ITEM' : 'FOUND ITEM';

    return (
        <div className="item-detail-page">
            <button onClick={() => navigate(-1)} className="btn btn-back">← Back to Dashboard</button>
            
            <div className={`detail-card ${typeColor}`}>
                <header className="detail-header">
                    <h1 className="detail-title">{item.title}</h1>
                    <span className="detail-type-badge">{typeLabel}</span>
                </header>
                
                <div className="detail-content-grid">
                    <div className="detail-images">
                        <img src={item.images[0]} alt={item.title} className="main-image" />
                    </div>
                    
                    <div className="detail-info">
                        <h2>Description</h2>
                        <p className="detail-description">{item.description}</p>
                        
                        <div className="detail-meta">
                            <p><strong>Category:</strong> {item.category}</p>
                            <p><strong>Color:</strong> {item.color || 'N/A'}</p>
                            <p><strong>Location:</strong> {item.location}</p>
                            <p><strong>Date:</strong> {new Date(item.dateOccurred).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span className={`status-${item.status.toLowerCase()}`}>{item.status}</span></p>
                        </div>

                        {/* 💡 CONTACT DETAILS FEATURE */}
                        <div className="contact-details-box">
                            <h3>Contact Poster</h3>
                            {user ? (
                                <div className="contact-info">
                                    <p><strong>Poster Name:</strong> {item.poster.name}</p>
                                    <p><strong>University ID:</strong> {item.poster.universityId}</p>
                                    <p><strong>Email:</strong> 
                                        <a href={`mailto:${item.poster.email}`} className="contact-link">{item.poster.email}</a>
                                    </p>
                                    <p className="contact-note">
                                        Use the email address above to coordinate the recovery of the item.
                                    </p>
                                </div>
                            ) : (
                                <p className="contact-alert">
                                    Please <a href="/login">log in</a> to view the contact details of the item's poster.
                                </p>
                            )}
                        </div>
                        {/* END CONTACT DETAILS FEATURE */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemDetail;
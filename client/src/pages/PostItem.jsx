import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/PostForm.css'; // Import the form styles

const CATEGORIES = ['Electronics', 'Keys', 'Wallets/Purses', 'Bags/Backpacks', 'Clothing', 'ID/Documents', 'Jewelry', 'Other'];

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function PostItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    type: 'Lost',
    title: '',
    description: '',
    category: 'Electronics', // ADDED BACK
    color: '',               // ADDED BACK
    location: '',            // ADDED BACK
    dateOccurred: getTodayDate(), // Date default to today
    images: [], 
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [hasImage, setHasImage] = useState(true); // Tracks user's choice for LOST items
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // --- Handlers ---
  const onChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'type') {
      setHasImage(true);
      setImageFiles([]);
    }
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImageFiles(files);
  };

  const uploadImages = async () => {
    console.log("Simulating image upload to Cloudinary...");
    if (imageFiles.length === 0) return [];
    
    // Using a valid placeholder service URL here
    const mockUrls = imageFiles.map((file, index) => 
      `https://via.placeholder.com/400x300?text=${formData.type}+Item+${index+1}` 
    );
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    return mockUrls;
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!user) { throw new Error('You must be logged in to post an item.'); }
      
      let uploadedUrls = [];
      
      // 1. Upload Images ONLY if necessary
      if (formData.type === 'Found' || hasImage) {
        uploadedUrls = await uploadImages();
      }
      
      // 2. CONDITIONAL VALIDATION: If type is 'Found' AND finalUrls is empty, throw error.
      if (formData.type === 'Found' && uploadedUrls.length === 0) {
          throw new Error('For Found reports, images are mandatory for verification.');
      }

      // 3. Prepare final data 
      const finalData = { ...formData, images: uploadedUrls, };

      // 4. Post item data to the protected API
      const res = await axios.post('/api/items', finalData);
      
      setSuccess(true);

      setTimeout(() => { navigate('/dashboard'); }, 2500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to post item.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-container">
      <h1 className="post-title">Report {formData.type} Item</h1>
      
      <form onSubmit={onSubmit}>
        
        {error && <div className="error-message form-full-width">{error}</div>}
        {success && <div className="success-message form-full-width">Report submitted successfully! The AI engine is checking for matches.</div>}

        <div className="form-grid">
          
          {/* Item Type (Lost/Found) */}
          <div className="form-group">
            <label htmlFor="type" className="form-label">Type of Report</label>
            <select id="type" name="type" value={formData.type} onChange={onChange} className="form-select" required>
              <option value="Lost">I Lost Something</option>
              <option value="Found">I Found Something</option>
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">Item Title (e.g., Red backpack, iPhone 12)</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={onChange} className="form-input" required />
          </div>

          {/* ADDED BACK: Category */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select id="category" name="category" value={formData.category} onChange={onChange} className="form-select" required>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          {/* ADDED BACK: Color */}
          <div className="form-group">
            <label htmlFor="color" className="form-label">Color (e.g., Black, Blue, Multi)</label>
            <input type="text" id="color" name="color" value={formData.color} onChange={onChange} className="form-input" />
          </div>
          
          {/* ADDED BACK: Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">Specific Location (e.g., Library 3rd Floor, Cafeteria)</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={onChange} className="form-input" required />
          </div>

          {/* Date Occurred (with Max date set to Today) */}
          <div className="form-group">
              <label htmlFor="dateOccurred" className="form-label">Date Lost/Found</label>
              <input 
                  type="date" 
                  id="dateOccurred" 
                  name="dateOccurred" 
                  value={formData.dateOccurred} 
                  onChange={onChange} 
                  className="form-input" 
                  required 
                  max={getTodayDate()} 
              />
          </div>

          {/* Description (Full Width) */}
          <div className="form-group form-full-width">
            <label htmlFor="description" className="form-label">Detailed Description (Crucial for AI Matching!)</label>
            <textarea id="description" name="description" value={formData.description} onChange={onChange} className="form-textarea" required />
          </div>

          {/* Image Upload (Conditional Logic) */}
          <div className="form-group form-full-width">
            <label className="form-label">Upload Images (Max 3, High Priority for AI Match)</label>
            
            {/* CHOICE INTERFACE (Only for LOST reports) */}
            {formData.type === 'Lost' && (
                <div style={{marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <span style={{fontSize: '0.9rem', color: 'var(--color-text-light)'}}>Do you have a picture of the lost item or a similar one?</span>
                    
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button 
                            type="button" 
                            className={`btn ${hasImage ? 'btn-primary' : 'btn-secondary'}`} 
                            onClick={() => setHasImage(true)}
                            style={{padding: '0.4rem 0.8rem', fontSize: '0.9rem'}}
                        >
                            Yes
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${!hasImage ? 'btn-error-outline' : 'btn-secondary'}`} 
                            onClick={() => { setHasImage(false); setImageFiles([]); }}
                            style={{padding: '0.4rem 0.8rem', fontSize: '0.9rem'}}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}

            {/* IMAGE UPLOAD INPUT (Shows if type is Found OR if user selected 'Yes' for Lost) */}
            {(formData.type === 'Found' || hasImage) && (
                <>
                    <input type="file" id="images" name="images" onChange={onFileChange} multiple accept="image/*" className="form-input" />
                    
                    {formData.type === 'Lost' && hasImage && (
                        <p className="guidance-text" style={{color: 'var(--color-primary-dark)', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                            Tip: Upload a photo of a similar item or the location where it was lost.
                        </p>
                    )}

                    {/* Image Previews */}
                    <div className="image-preview-container">
                        {imageFiles.map((file, index) => (
                            <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="image-preview" />
                        ))}
                    </div>
                </>
            )}
            
            {/* NO IMAGE CONFIRMATION (Shows if type is Lost AND user selected 'No') */}
            {formData.type === 'Lost' && !hasImage && (
                <p className="guidance-text" style={{color: 'var(--color-error)', padding: '1rem', border: '1px solid var(--color-error)', borderRadius: 'var(--border-radius)'}}>
                    You are posting a **Lost** report without an image. Matching will rely heavily on your detailed description.
                </p>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-submit btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : `Post ${formData.type} Report`}
        </button>
      </form>
    </div>
  );
}

export default PostItem;
import React, { useState } from 'react';
import './AddProduct.css'; // Import the CSS file

const AddPost = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(false);

  const addProduct = async () => {
    // Basic validation
    if (!text && !image) {
      setError(true);
      return;
    }

    try {
      // Clear error and input fields
      setError(false);
      setText('');
      setImage('');

      const userId = JSON.parse(localStorage.getItem('user'))._id;
      const result = await fetch("http://localhost:8000/add-post", {
        method: "post",
        body: JSON.stringify({ text, image, userId }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (result.ok) {
        // Handle success, e.g., show a success message
        console.warn("User post added successfully");
      } else {
        // Handle error, e.g., show an error message
        console.error("Failed to add user post");
      }
    } catch (error) {
      console.error("Error during user post addition:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className='add-user-post'>
      <h1>Create a Post</h1>
      <textarea
        placeholder='Whats on your mind?'
        className='inputBox1 text-input'
        value={text}
        onChange={(e) => { setText(e.target.value); setError(false); }}
      />
      {error && !text && <span className='invalid-input'>Enter valid text content</span>}

      <input
        type="text"
        placeholder='Enter image URL (optional)'
        className='inputBox1 image-input'
        value={image}
        onChange={(e) => { setImage(e.target.value); setError(false); }}
      />

      <button onClick={addProduct} className='appButton'>Post</button>
    </div>
  );
}

export default AddPost;

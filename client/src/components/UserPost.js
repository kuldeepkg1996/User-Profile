import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserPostList.css'; // Import the CSS file

const UserPostList = () => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    try {
      let result = await fetch('http://localhost:8000/posts');
      result = await result.json();
      setUserPosts(result);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const deleteUserPost = async (id) => {
    console.warn(id);
    let result = await fetch(`http://localhost:8000/posts/delete/${id}`, {
      method: 'DELETE' // Use 'DELETE' instead of 'Delete'
    });
    result = await result.json();
    if (result) {
      getUserPosts();
    }
  };
  

  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`/search/${key}`);
      result = await result.json();
      if (result) {
        setUserPosts(result);
      }
    } else {
      getUserPosts();
    }
  };
   const handleLike = ()=>{

   }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust formatting as needed
  };

  return (
    <div className="user-post-list">
      <h3>User Post List</h3>
      <input
        type="text"
        className="search-user-post-box"
        placeholder="Search User Post"
        onChange={searchHandle}
      />

      {userPosts.length > 0 ? (
        userPosts.map((item, index) => (
          <div className="post-item" key={index}>
            <div className="post-header">
              <p className="post-username"> {index + 1}</p>
              <p className="post-timestamp">Posted on: {item.timestamp}</p>
            </div>
            <p className="post-text">{item.text}</p>
            {item.image && <img className="post-image" src={item.image} alt="user-post-image" />}
            <div className="post-actions">
              <button className='delete-button' onClick={() => deleteUserPost(item._id)}>Delete</button>
              <Link to={`/update/${item._id}`} className="update-link">Update</Link>
              <button className="like-button" onClick={() => handleLike(item._id)}>Like</button>
            </div>
          </div>
        ))
      ) : (
        <h1>No Result Found</h1>
      )}
    </div>
  );
};

export default UserPostList;

import React from 'react';
import {
    Link, useNavigate
} from 'react-router-dom';
const Nav = () => {
    const auth = localStorage.getItem('user');
    const navigate = useNavigate();
    const handleLogout = () => {
        try {
          // Clear user data from local storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');

          navigate('/login'); // Replace '/login' with the desired route
    
        } catch (error) {
          console.error('Error during logout:', error);
        }
      
};

    return (
        <div style={{ position: "sticky", top: "0", width: "100%" }}>
            <img
                alt='logo'
                className='logo'
                src='https://png.pngtree.com/png-clipart/20191121/original/pngtree-kg-letter-logo-design-png-image_5157131.jpg' />
            {
                auth ?

                    <ul className="nav-ul">
                        <li><Link to="/">Post</Link></li>
                        <li><Link to="/add">Add Post</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li> <Link onClick={handleLogout} to="/signup">Logout</Link></li>
                    </ul>
                    :
                    <ul className="nav-ul nav-right">
                        <li> <Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
            }


        </div>
    )
}

export default Nav;
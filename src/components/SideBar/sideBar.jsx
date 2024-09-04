import React, { useState } from 'react';
import './sideBar.css';

import Dash from '../../assets/icons/Dashboard.png';
import List from '../../assets/icons/List.png';
import Book from '../../assets/icons/Book.png';
import Group from '../../assets/icons/Users.png';
import Issuance from '../../assets/icons/Issuance.png';
import { Link, useLocation } from 'react-router-dom';


const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Dash, roles: ['ADMIN'] },
  { path: '/categories', label: 'Categories', icon: List, roles: ['ADMIN'] },
  { path: '/books', label: 'Books', icon: Book, roles: ['ADMIN'] },
  { path: '/users', label: 'Users', icon: Group, roles: ['ADMIN'] },
  { path: '/issuances', label: 'Issuances', icon: Issuance, roles: ['ADMIN'] },
  { path: '/userHistory', label: 'User History', icon: Book, roles: ['USER'] },
];

const SideBar = ({ isAdmin }) => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);

  const handleItemClick = (path) => {
    setSelectedItem(path);
  };

  
  const userRole = isAdmin ? 'ADMIN':'USER';

  return (
    <div className='sideBar-div'>
      <div className="dashboard-items-div">
        {menuItems
          .filter((item) => item.roles.includes(userRole)) // Filter items based on user role
          .map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`item ${selectedItem === item.path ? 'selected' : ''}`} 
              onClick={() => handleItemClick(item.path)}
            >
              <img src={item.icon} alt={`${item.label} Icon`} className="icon" />
              <span className="item-text">{item.label}</span>
            </Link>
          ))}
      </div>
    </div>
  );
};


export default SideBar;

import React from 'react';
import SideBar from '../components/SideBar/sideBar';
import Navbar from '../components/Navbar/navbar';

const AdminHOC = (Component) => function HOC() {
  return (
    <div className='adminHOC-div'>
      <Navbar />
     
      <SideBar isAdmin={true} />
      <div className="hoc-area">
        <Component />
      </div>  
    </div>
  );
}

export default AdminHOC;

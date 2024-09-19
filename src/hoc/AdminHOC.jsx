import React from 'react';
import Navbar from '../components/navbar/navbar';
import SideBar from '../components/sideBar/sideBar';

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

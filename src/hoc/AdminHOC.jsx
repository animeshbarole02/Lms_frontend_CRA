import React from 'react';
import Navbar from '../components/navbar/navbar';
import SideBar from '../components/sideBar/sideBar';

const AdminHOC = (Component) => function HOC(props) {

  return (
    <div className='adminHOC-div'>
      <Navbar />
      <SideBar isAdmin={true} />
      <div className="hoc-area">
         <Component {...props} />
      </div>
    </div>
  );
}

export default AdminHOC;

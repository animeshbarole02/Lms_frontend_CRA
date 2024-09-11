import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/navbar';
import SideBar from '../components/sideBar/sideBar';
import Loader from '../components/loader/loader'; 

const AdminHOC = (Component) => function HOC(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='adminHOC-div'>
      <Navbar />
      <SideBar isAdmin={true} />
      <div className="hoc-area">
        {loading ? <Loader /> : <Component {...props} />}
      </div>
    </div>
  );
}

export default AdminHOC;

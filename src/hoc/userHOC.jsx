import React from 'react';
import Navbar from "../components/navbar/navbar";
import SideBar from "../components/sideBar/sideBar";

const UserHOC = (Component) => function HOC() {
  return (
    <div className="userHoc-div">
      <Navbar />
      <SideBar isAdmin={false} />
      <div className="userHoc-content">
        <Component />
      </div>
    </div>
  );
};

export default UserHOC;

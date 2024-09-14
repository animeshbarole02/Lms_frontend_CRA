import React from "react";
import SearchIcon from "../../assets/icons/magnifying-glass.png";

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {

 
  return (
    <div className="search-input-div">
      <div className="search-icon-div">
        <img src={SearchIcon} alt="Search" />
      </div>
      <div className="search-categories-div">
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;

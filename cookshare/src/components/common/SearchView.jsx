import React, { useState } from "react";

const SearchView = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <input
      type="text"
      className="form-control"
      style={{ maxWidth: 800 }}
      placeholder="Search recipes by name..."
      value={value}
      onChange={handleChange}
    />
  );
};

export default SearchView; 
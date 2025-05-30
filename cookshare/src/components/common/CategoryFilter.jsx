import React, { useEffect, useState } from "react";
import { getAllCategories } from "../services/RecipeService";

const CategoryFilter = ({ onCategoryClick, activeCategory }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchCategories();
  }, []);

  const handleCheckboxChange = (category) => {
    let updated;
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter((c) => c !== category);
    } else {
      updated = [...selectedCategories, category];
    }
    setSelectedCategories(updated);
    onCategoryClick(updated);
  };

  return (
    <div className="categories-container" style={{ minWidth: 120 }}>
      <div
        className="mb-2"
        style={{
          fontWeight: 600,
          color: "#222",
          fontSize: 17,
          letterSpacing: 0.5,
          textAlign: "left",
        }}
      >
        Categories
      </div>
      {isLoading && <div style={{ fontSize: 13 }}>Fetching categories...</div>}
      {errorMessage && <div className="text-danger" style={{ fontSize: 13 }}>{errorMessage}</div>}
      <div>
        {categories &&
          categories.map((category) => (
            <label
              key={category}
              className="category-checkbox d-flex align-items-center mb-2"
              style={{
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 400,
                color: "#222",
                background: "none",
                borderRadius: 0,
                padding: "2px 0",
                marginLeft: 2,
              }}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCheckboxChange(category)}
                style={{
                  marginRight: 8,
                  width: 15,
                  height: 15,
                  accentColor: "#222",
                }}
              />
              <span>{category}</span>
            </label>
          ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

import React, { useEffect, useState } from "react";
import Hero from "../hero/Hero";
import RecipeCard from "../recipe/RecipeCard";
import { getAllRecipes } from "../services/RecipeService";
import { Row, Col, Container } from "react-bootstrap";
import CategoryFilter from "../common/CategoryFilter";
import { getCurrentUser } from "../services/UserService";
import SearchView from "../common/SearchView";
import Pagination from "react-bootstrap/Pagination";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8; // hoặc 6, 9 tùy ý

  // Check login status on mount
  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.userName);
      } else {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
      }
    }).catch(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
    });
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getAllRecipes();
        setRecipes(response);
        setFilteredRecipes(response);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    let filtered = recipes;
    if (activeCategories.length > 0) {
      filtered = filtered.filter(
        (recipe) => activeCategories.includes(recipe.category)
      );
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(recipe => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredRecipes(filtered);
  }, [activeCategories, recipes, searchTerm]);

  // Tính toán phân trang
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const handleCategoryClick = (categories) => {
    setActiveCategories(categories);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Hero />
      <main className='home-container d-flex'>
        {/* Sidebar */}
        <div className='sidebar' style={{ minWidth: 220, marginRight: 32 }}>
          <CategoryFilter
            onCategoryClick={handleCategoryClick}
            activeCategory={activeCategories}
          />
        </div>
        {/* Main content */}
        <Container className='main-content text-center mb-4' id='explore'>
          <h2 className='text-center mb-4 home-title'>
            Explore Recipes on CookShare
          </h2>
          {/* SearchView ở giữa phía trên danh sách */}
          <div className='d-flex justify-content-center mb-4'>
            <SearchView onSearch={handleSearch} />
          </div>
          {isLoading && <div>Loading recipes.....</div>}
          {errorMessage && (
            <div className='text-danger mb-4'>{errorMessage}</div>
          )}
          <Row>
            {currentRecipes && currentRecipes.length > 0 ? (
              currentRecipes.map((recipe) => (
                <Col key={recipe.id} md={4} lg={3} sm={12} xs={12}>
                  <RecipeCard recipe={recipe} />
                </Col>
              ))
            ) : (
              <div className='text-danger mb-4'>
                No recipes found at this time , please check again later!
              </div>
            )}
          </Row>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </Container>
      </main>
    </>
  );
};

export default Home;

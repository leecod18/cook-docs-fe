import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { Card } from "react-bootstrap";
import {
  likeRecipe,
  unLikeRecipe,
  getRecipeById,
  checkUserLike,
} from "../services/RecipeService";

const Like = ({ recipeId }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await getRecipeById(recipeId);
        setLikes(response.likeCount);
        
        if (userId) {
          const userLike = await checkUserLike(recipeId, userId);
          setHasLiked(userLike !== null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
  }, [recipeId, userId]);

  const handleLikeClick = async () => {
    if (!userId) {
      // Redirect to login if user is not logged in
      window.location.href = "/login";
      return;
    }

    try {
      if (!hasLiked) {
        await likeRecipe(recipeId);
        setLikes(likes + 1);
      } else {
        await unLikeRecipe(recipeId);
        setLikes(likes - 1);
      }
      setHasLiked((prevLike) => !prevLike);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card.Text className="d-flex align-items-center thumb">
      <FaThumbsUp
        onClick={handleLikeClick}
        style={{ color: hasLiked ? "blue" : "gray", cursor: "pointer" }}
      />
      <span className="ms-2">{likes}</span>
    </Card.Text>
  );
};

export default Like;

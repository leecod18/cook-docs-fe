import React, { useEffect, useState } from "react";

const ImageDownloader = ({ recipeId }) => {
  const [recipeImage, setRecipeImage] = useState(null);

  useEffect(() => {
    const fetchRecipeImage = async (recipeId) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/images/image/download/${recipeId}`
        );
        const blobImage = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecipeImage(reader.result);
        };
        reader.readAsDataURL(blobImage);
      } catch (error) {
        console.error("Error fetching recipe image:", error);
      }
    };

    if (recipeId) {
      fetchRecipeImage(recipeId);
    }
  }, [recipeId]);

  if (!recipeImage) return null;

  return (
    <div >
      <img src={recipeImage} alt='Recipe Image'></img>
    </div>
  );
};

export default ImageDownloader;

import React, { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import { Container, Row } from "react-bootstrap";
import { Link, useParams} from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import { getRecipeById } from "../services/RecipeService";
import ImageDownloader from "./ImageDownloader";

const ImageUpdater = () => {
  const [imageId, setImageId] = useState(null);
  const { recipeId } = useParams();

  useEffect(() => {
    const getTheRecipe = async () => {
      try {
        const response = await getRecipeById( recipeId);
        if (response && response.imageDto && response.imageDto.id) {
            setImageId(response.imageDto.id);
        } else {
            setImageId(null);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setImageId(null);
      }
    };
    getTheRecipe();
  }, [recipeId]);

  return (
    <Container className='p-5' style={{ maxWidth: "700px", margin: "0 auto" }}>
      <fieldset className='border p-4 mb-4'>
        <legend className='sub-title'>Updating Recipe Image</legend>
        
        {imageId && (
            <Row className='mb-4 text-center'>
                <h5>Current Image:</h5>
                <ImageDownloader recipeId={imageId} />
            </Row>
        )}

        <Row className='mb-4'>
          <ImageUploader existingImageId={imageId} recipeId={recipeId} />
        </Row>

        <div className='d-flex gap-4'>
          <Link
            to={`/recipe/${recipeId}/recipe-details`}
            className='btn btn-sm btn-secondary mt-3'
            style={{ backgroundColor: "#562f63b5" }}>
            <FaArrowLeft /> Back to recipe details
          </Link>
        </div>
      </fieldset>
    </Container>
  );
};

export default ImageUpdater;

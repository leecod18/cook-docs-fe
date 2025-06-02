import React from "react";
import { Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import RatingStars from "../common/RatingStars";

const Reviews = ({ reviews, onEditReview, onDeleteReview, currentUserId }) => {
  return (
    <div className="reviews-section">
      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => {
          const isReviewOwner = currentUserId && review.user.id === currentUserId;
          return (
            <Card key={review.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5>{review.user.userName}</h5>
                    <RatingStars rating={review.stars} />
                    <p className="mt-2">{review.feedBack}</p>
                  </div>
                  {isReviewOwner && (
                    <div className="review-controls">
                      <button
                        className="btn btn-link text-info"
                        onClick={() => onEditReview(review)}>
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn btn-link text-danger"
                        onClick={() => onDeleteReview(review.id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default Reviews;

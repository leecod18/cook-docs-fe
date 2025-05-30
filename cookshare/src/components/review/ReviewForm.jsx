import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from "react-bootstrap"
import { FaStar } from "react-icons/fa"
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ReviewForm = ({ editingReview, onReviewSubmit }) => {
    const [hover, setHover] = useState(null);
    const [rating, setRating] = useState(null);
    const [feedback, setFeedback] = useState("");
    const { recipeId } = useParams();
    const userId = localStorage.getItem("userId");

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    useEffect(() => {
        if (editingReview) {
            setRating(editingReview.stars);
            setFeedback(editingReview.feedBack);
        } else {
            resetForm();
        }
    }, [editingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        if (!feedback.trim()) {
            toast.error("Please provide feedback");
            return;
        }

        const reviewInfo = {
            userId: parseInt(userId),
            stars: rating,
            feedBack: feedback,
        };

        if (onReviewSubmit) {
            await onReviewSubmit({ recipeId, reviewInfo });
            resetForm();
        }
    };

    const resetForm = () => {
        setRating(null);
        setFeedback("");
    };

    if (!userId) {
        return (
            <Card className="text-center p-4 mb-4">
                <Card.Body>
                    <h5>Want to share your thoughts?</h5>
                    <p className="text-muted">Please log in to leave a review</p>
                    <Link to="/login" className="btn btn-primary">
                        Log in to Review
                    </Link>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div className='mb-2'>
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                        <Form.Label key={index} className='me-2'>
                            <Form.Control
                                type='radio'
                                name='rating'
                                value={ratingValue}
                                onChange={() => handleRatingChange(ratingValue)}
                                checked={rating === ratingValue}
                                style={{ display: "none" }}
                            />
                            <FaStar
                                className="star"
                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                                style={{ cursor: "pointer" }}
                            />
                        </Form.Label>
                    );
                })}
            </div>
            <Form.Group className="mb-3">
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your review..."
                    value={feedback}
                    onChange={handleFeedbackChange}
                />
            </Form.Group>
            <Button 
                type="submit" 
                variant="primary"
                disabled={!rating || !feedback.trim()}
            >
                {editingReview ? "Update Review" : "Submit Review"}
            </Button>
        </Form>
    );
};

export default ReviewForm;

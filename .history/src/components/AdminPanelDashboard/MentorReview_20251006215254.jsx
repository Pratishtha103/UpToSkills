import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, User, Plus } from "lucide-react";

function MentorReview() {
  const [mentorReviews, setMentorReviews] = useState([]);
  const [newReviewMentor, setNewReviewMentor] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/mentorreviews")
      .then((res) => res.json())
      .then((data) => data.success && setMentorReviews(data.data))
      .catch(console.error);
  }, []);

  const addMentorReview = () => {
    if (!newReviewMentor || !newReviewText || newReviewRating === "") return;

    const review = { mentor: newReviewMentor, feedback: newReviewText, rating: parseFloat(newReviewRating) };

    fetch("http://localhost:5000/api/mentorreviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMentorReviews([data.data, ...mentorReviews]);
          setNewReviewMentor("");
          setNewReviewText("");
          setNewReviewRating("");
        } else alert(data.message);
      })
      .catch(console.error);
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rounded ? "text-warning fill-warning" : "text-muted-foreground"}`} />
        ))}
        <span className="ml-2 text-sm font-medium text-foreground">{rating}</span>
      </div>
    );
  };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2 className="text-2xl font-bold text-foreground mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        Mentor Reviews
      </motion.h2>

      <motion.div className="stat-card p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-xl font-bold text-foreground mb-4">Add New Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Mentor Name</label>
            <input type="text" placeholder="Mentor Name" value={newReviewMentor} onChange={(e) => setNewReviewMentor(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Review Text</label>
            <input type="text" placeholder="Review Text" value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Rating (0-5)</label>
            <input type="number" placeholder="Rating (0-5)" value={newReviewRating} onChange={(e) => setNewReviewRating(e.target.value)} min="0" max="5" step="0.1" className="input-field" />
          </div>
        </div>
        <motion.button onClick={addMentorReview} className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="w-4 h-4" /> Add Review
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentorReviews.map((review, index) => (
          <motion.div key={review.id} className="stat-card p-6 cursor-pointer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ scale: 1.02, y: -4 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-accent">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">{review.mentor}</h4>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
              <p className="text-muted-foreground italic leading-relaxed">"{review.feedback}"</p>
            </div>
            <div className="flex items-center justify-between">{renderStars(review.rating)}</div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default MentorReview;

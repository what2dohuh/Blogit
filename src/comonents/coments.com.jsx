import React, { useState, useEffect } from 'react';
import { Timestamp, updateDoc } from 'firebase/firestore';

const CommentsCom = ({ user, post }) => {
    const [comments, setComments] = useState([]); // State for storing comments
    const [newComment, setNewComment] = useState(''); // State for new comment input
    const [loading, setLoading] = useState(false); // Loading state for submissions

    // Initialize comments from the post data
    useEffect(() => {
        setComments(post.comments || []); // Ensure comments is always an array
    }, [post]);

    // Handle adding new comments
    const handleAddComment = async () => {
        if (newComment.trim() === '') return; // Prevent empty comments
        setLoading(true);

        try {
            // Prepare the new comment data
            const commentData = {
                text: newComment,
                timestamp: Timestamp.fromDate(new Date()), // Add timestamp
                user: user.email, // Author of the comment
                uid: user.uid // User ID
            };

            // Add the new comment to the local state
            const updatedComments = [...comments, { id: Date.now(), ...commentData }];
            setComments(updatedComments);

            // Update the post's comments array in Firestore
            await updateDoc(post.ref, {
                comments: updatedComments
            });

            // Clear the input field after submission
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>

            {/* Comment Input Section */}
            {user?<div className="comment-input">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button onClick={handleAddComment} disabled={loading}>
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </div>:<></>}
            

            {/* Display Comments */}
            <div className="comments-list" style={{ marginTop: '20px' }}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item" style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                            <p><strong>{comment.uid === user?.uid ? 'by: You' : `by: ${comment.user}`}</strong></p>
                            <p>{comment.text}</p>
                            <small>{new Date(comment.timestamp.seconds * 1000).toLocaleString()}</small>
                        </div>
                    ))
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default CommentsCom;

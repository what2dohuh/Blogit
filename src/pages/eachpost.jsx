import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarCom from '../comonents/navbar.com';
import '../style/eachpost.css'; // Import CSS for styling
import { collectionGroup, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { db,auth} from '../config/config_fire';
import Timeform from '../comonents/timeform';
import { onAuthStateChanged } from 'firebase/auth';
import ComentsCom from '../comonents/coments.com';

const Eachpost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0);
    const [upvoted, setUpvoted] = useState(false);
    const [likesuid, setlikesuid] = useState([]);
    const [user, setuser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(us)=>{
            const getData = async () => {
                try {
                    setuser(us || null)
                    const querySnapshot = await getDocs(collectionGroup(db, "post"));
                    let foundPost = null;
    
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.postid === postId) {
                            foundPost = { ...data, id: doc.id, ref: doc.ref }; // Store the doc reference
                        }
                    });
    
                    if (foundPost) {
                        setPost(foundPost);
                        setLikes(foundPost.likes || 0); // Initialize likes from post data
                        setlikesuid(foundPost.likesuid || [])
                    } else {
                        setError('No such post!');
                    }
                } catch (error) {
                    setError('Error fetching post!');
                } finally {
                    setLoading(false);
                }
            };
            getData();
        })
        return () => unsubscribe();

    }, [postId]);

    useEffect(() => {
        if (post) {
            setLikes(post.likes || 0); // Ensure likes state is updated if post changes
            if(!user) {
                setUpvoted(true);
                return;
            }
            setUpvoted(likesuid.includes(user?.uid) || false); // Reset upvote state
        }
    }, [post]);

    const handleUpvote = async () => {
        if (!upvoted) {
            const newLikes = likes + 1;
            setLikes(newLikes); // Increment likes locally
            setUpvoted(true);
            likesuid.push(user.uid)

            if (post && post.ref) {
                try {
                    await updateDoc(post.ref, {
                        likes: newLikes,
                        likesuid:likesuid
                    });
                } catch (error) {
                    console.error("Error updating likes:", error);
                }
            }
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <NavbarCom />
            <div className="each-post-container">
                {post && (
                    <div className="post-details">
                        <h1 className="post-title">{post.heading}</h1>
                        <img src={post.imageUrl} alt={post.heading} className="post-image" />
                        <p className="post-category">Category: {post.category}</p>
                        <p className="post-description" dangerouslySetInnerHTML={{ __html: post.post }}></p>
                        <p className="post-author">Written by: {post.user}</p>
                        <p className="post-date">Posted on: <Timeform time={post.timestamp}/></p>
                        <p className="post-likes">Likes: {likes}</p>
                        <button 
                          className={`upvote-btn ${upvoted ? 'upvoted' : ''}`} 
                          onClick={handleUpvote} 
                          disabled={upvoted}
                        >
                          {upvoted ? 'Upvoted' : 'Upvote'} ({likes})
                        </button>
                    </div>
                )}
                <ComentsCom user={user} post={post}/>
            </div>
        </>
    );
};

export default Eachpost;

import React, { useEffect, useState } from 'react';
import { Editor } from 'primereact/editor';
import '../style/createpost.css'; // Import the CSS file
import NavbarCom from '../comonents/navbar.com';
import { auth, db } from '../config/config_fire';
import { collection, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
    const [text, setText] = useState('');
    const [heading, setHeading] = useState(''); // Heading state
    const [image, setImage] = useState(null); // Image state
    const [category, setCategory] = useState(''); // Category state
    const nav = useNavigate();
    const [errorMessage, seterrorMessage] = useState("");

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Store the selected image in state
    };
    useEffect(() => {
        if (!auth.currentUser){
            toast("Login to create a post!!")
            nav('/');
        }
    }, []);
    const handlePost = async () => {
        if (auth.currentUser) {
            try {
                let imageUrl = '';
                
                // Check if there's an image to upload
                if (image) {
                    const storage = getStorage(); // Get the Firebase Storage instance
                    const storageRef = ref(storage, `images/${image.name}`); // Create a storage reference
                    const snapshot = await uploadBytes(storageRef, image); // Upload the image
                    imageUrl = await getDownloadURL(snapshot.ref); // Get the download URL
                } else {
                    seterrorMessage("Image is not uploaded");
                    toast(errorMessage);
                    return;
                }

                if (!heading) {
                    seterrorMessage("Heading is required");
                    toast(errorMessage);
                    return;
                }

                if (!category) {
                    seterrorMessage("Category is required");
                    toast(errorMessage);
                    return;
                }

                // Add the post to the user's sub-collection "posts"
                const userDocRef = doc(db, "posts", auth.currentUser.uid); // Reference to user document
                const postsCollectionRef = collection(userDocRef, "post"); // Reference to "posts" sub-collection
                
                // Create a new document in the sub-collection with auto-generated ID
                const newPostRef = doc(postsCollectionRef); 
                
                await setDoc(newPostRef, {
                    uid: auth.currentUser.uid,
                    heading: heading, // Add heading
                    post: text,
                    imageUrl: imageUrl, // Add image URL
                    category: category, // Add category
                    timestamp: new Date(),
                    likes: 0,
                    comments: [],
                    user: auth.currentUser.email,
                    postid: newPostRef.id
                });

                console.log("Post created successfully");
                nav('/');
            } catch (err) {
                seterrorMessage(err.message);
                toast(errorMessage);
            }
        }
        console.log(text);
    };

    return (
        <>
            <NavbarCom />
            <div className="create-post-container">
                <h2 className="create-post-title">Create Post</h2>

                {/* Heading Input */}
                <input 
                    type="text" 
                    value={heading} 
                    onChange={(e) => setHeading(e.target.value)} 
                    placeholder="Enter a heading" 
                    className="heading-input"
                />

                {/* Text Editor */}
                <Editor
                    value={text}
                    onTextChange={(e) => setText(e.htmlValue)}
                    style={{ height: '320px' }}
                    className="editor"
                />

                {/* Image Selector */}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="image-input"
                />

                {/* Category Selector */}
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="category-select"
                >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                </select>

                {/* Post Button */}
                <button className="post-button" onClick={handlePost}>Post</button>
            </div>
            <ToastContainer /> {/* Toast Container */}
        </>
    );
}

export default CreatePost;

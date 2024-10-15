import { collectionGroup, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/config_fire';
import { onAuthStateChanged } from 'firebase/auth';  // Import onAuthStateChanged
import NavbarCom from '../comonents/navbar.com';
import ProfileCom from '../comonents/profile.com';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);
    const [Data, setData] = useState([]);

    useEffect(() => {
        // Use onAuthStateChanged to listen to user state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const getData = async () => {
                    const querySnapshot = await getDocs(collectionGroup(db, "post")); // Use collectionGroup to get sub-collections
                    const postsArray = [];
                    
                    querySnapshot.forEach((doc) => {
                      // Collect each document's data and add to the array
                      if(doc.data().uid === user.uid) {
                      postsArray.push(doc.data());
                      }
                    });

                    console.log(postsArray)
                    setData(postsArray); // Set the full array at once
                  };
                  getData();
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        setError("No user found");
                    }
                } catch (error) {
                    setError(error.message);
                }
            } else {
                setError("No user logged in");
            }
            setLoading(false);  // End loading state
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Display loading state while waiting for Firebase to determine user state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error message if any
    if (error) {
        return <div>{error}</div>;
    }

    // Render profile and user data if available
    return (
        <div>
            <NavbarCom />
            {loading ? <div>loading</div>: <ProfileCom data={Data} userData={userData} user={user} />}
         
        </div>
    );
};

export default Profile;

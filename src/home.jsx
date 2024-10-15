import React, { useEffect, useState } from 'react';
import { auth, db } from './config/config_fire';
import Sidebar from './comonents/navbar.com';
import SearchCom from './comonents/search.com';
import CardCom from './comonents/card.com';
import Homemaincard from './comonents/homemaincard';
import { collectionGroup, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';
import './style/main.css'

const Home = () => {
  
  const [data, setData] = useState([]); // Keep it as an array
  const [highestlikes, sethighestlikes] = useState({});
  const [loading, setloading] = useState(true);

  useEffect(() => {
   
    // Fetch posts from Firestore
    const getData = async () => {
      const querySnapshot = await getDocs(collectionGroup(db, "post")); // Use collectionGroup to get sub-collections
      const postsArray = [];
      
      querySnapshot.forEach((doc) => {
        // Collect each document's data and add to the array
        postsArray.push(doc.data());
      });
      setData(postsArray); // Set the full array at once
      const highestLikedPost = postsArray.reduce((max, post) => post.likes > (max.likes || 0) ? post : max, postsArray[1]);
      sethighestlikes(highestLikedPost)
      console.log(highestLikedPost)
      setloading(false); // Once all data is fetched, set loading to false
    };

    getData();
  }, []);
  if(loading) return <>Loading</>
  return (
    <>
      <div>
        <Sidebar />
        <SearchCom />

        <Homemaincard data={highestlikes}/>
        {data.map((d) =>  <Link style={{textDecoration:"none"}}to={`/post/${d.postid}`} key={d.id}> {/* Adjust the link path as needed */}
            <CardCom
              time={d.timestamp}
              title={d.heading}
              img={d.imageUrl}
              descr={d.post}
              username={d.user}
              category={d.category}
              postId={d.postid} // Use document id as postId
              uid={d.uid}
              initialLikes={d.likes}
            />
          </Link>)}
      </div>
    </>
  );
}

export default Home;

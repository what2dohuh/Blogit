import Signup from "./auth/signup";
import { BrowserRouter as Router, Routes,Route, BrowserRouter } from 'react-router-dom'
import Home from "./home";
import Login from "./auth/login";
import CreatePost from "./pages/createPost";
import Eachpost from "./pages/eachpost";
import Profile from "./pages/profile";

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Home />} />
    <Route path="/createpost" element={<CreatePost />} />
    <Route path="/post/:postId" element={<Eachpost/>} />
    <Route path="/profile" element={<Profile/>} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

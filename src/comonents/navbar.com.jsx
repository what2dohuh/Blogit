import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import '../style/sidebar.css'
import {auth} from "../config/config_fire.js"
const NavbarCom = () => {
    const [openLinks, setopenLinks] = useState(false);
    const toggole=()=>{
        setopenLinks(!openLinks)
    }

    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((usr) => {
        if (usr) {
          setUser(usr);
        } else {
          setUser(null);
        }
      });

   return () => unsubscribe();
    }, []);
    const handlelogout =async()=>{
        try {
            await auth.signOut();
            
        } catch (error) {
            console.error(error)
        }
      }
    return (
        <div className='navbar'>
        <div className='left' id={openLinks ? "open":"close"}>
            <Link to='/'><h2>YName</h2></Link>
        <Link to='/trending'>Economics</Link>
        <Link to='/trending'>Politics</Link>
        <Link to='/trending'>Technology</Link>
        <Link to='/trending'>Banking</Link>

        <div className='hiddenLinks'>
        <div className=" bold">
        <Link to='/'>Home</Link>
        </div>
        <Link to='/createpost'>{user ?"create post":""}</Link>
        <Link to='/trending'>Treding</Link>
        <div className=" bold">
        <Link to='/profile'>{user?"Profile":""}</Link>
        </div>
            <Link to={`/${user ? "": "login"}`}> <div  className="btnn">{user ? "Logout ": "login"} </div></Link>
        </div>

        </div>
        <div className='right'>
        <div className=" bold">
        <Link to='/'>Home</Link>
        </div>
        <Link to='/createpost'>{user ?"create post":""}</Link>
        <Link to='/trending'>Treding</Link>

        <div className=" bold">
        <Link to='/profile'>{user?"Profile":""}</Link>
        </div>
            <Link to={`/${user ? "": "login"}`}> <div  className="btnn" onClick={handlelogout}>{user ? "Logout ": "login"} </div></Link>
        <button className="on"onClick={toggole}>
            <i className="fa fa-bars"></i>  
        </button >
        </div>
    </div>
    );
}

export default NavbarCom;

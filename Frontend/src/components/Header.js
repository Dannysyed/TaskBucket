import React from "react";
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userReducer";
import { setToken } from "../store/authReducer";

function Header() {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(setUser({}));
    dispatch(setToken(null));
    navigate("/");
  }

  return <div className="bg-violet-500 header">
    <div className="mr-5"> LOGO</div>
    <div>
    <Link to="/homepage">Home</Link>
    </div>
    <div>
       <span className="mr-3"> {user.name} </span>
       <button  onClick={handleLogOut}> Log Out </button>
    </div>
  </div>;
}

export default Header;

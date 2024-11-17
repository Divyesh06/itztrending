import React from "react";
import TrendContext from "../Context/TrendProvider";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, BoxArrowLeft } from "react-bootstrap-icons";
import Popover from "./Popover";
import { logout } from "../auth_apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Avatar(props) {
    async function logout_and_redirect() {
        await logout()
        setTimeout(() =>toast.warn("You have been logged out"), 1)
        navigate("/login")
    }
    const navigate = useNavigate();
    const { profpic } = useContext(TrendContext)
    const [popoverVisible, setPopoverVisible] = useState(false);
    return (
        <>
            <img className="avatar" src={profpic} alt="avatar" onClick={() => setPopoverVisible(!popoverVisible)} />
            {popoverVisible ? <Popover top={5} left={-120}>
                <div onClick={() => navigate("/profile-edit")}><Pencil style={{ marginRight: "12px" }} />Edit Profile</div>
                <div onClick={logout_and_redirect}><BoxArrowLeft style={{ marginRight: "12px" }} />Logout</div>
            </Popover> : <></>}
            
        </>
    )

}

export default Avatar
import { useState, useEffect, useRef, useContext } from "react";
//import navlink
import { NavLink, useNavigate } from "react-router-dom";
import FloatingLabelInput from "./FloatingLabelInput";
import InputForm from "./InputForm";
import { PlusLg, Check2, ExclamationTriangle } from "react-bootstrap-icons";
import { send_password_reset_request} from "../auth_apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
    async function handleSubmit(e) {
      e.preventDefault();
      // const a = await send_password_reset_request(email);
      // console.log(a);
      // const success = a[0];
      // const response = a[1];
      const [success, response] = await send_password_reset_request(email);
  
      if (!success) {
        toast.error(response);

      }
      else {
        navigate("/verify-otp?email=" + email);
        setTimeout(() =>toast.success("Password Reset Request Sent"), 1); //Hack from a stackoverflow answer
      }
      
    }


  return (
    <>
      
      <InputForm handleSubmit={handleSubmit}>
        <section style={{ position: "relative" }}>
        <h1 style={{ fontSize: "32px" }}>
            Reset Password
            <span style={{ color: "var(--primary-color)", fontSize: "1.4em" }}>
              .
            </span>

            
          </h1>
          <p style={{ fontSize: "17px", marginTop: "15px" }}>
            Enter your email address and we will send you an OTP to reset your password
          </p>
          <br></br>
          <FloatingLabelInput
            type="email"
            label="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={"envelope-fill"}
          />
        </section>
        <section>
          <button type="submit">
            Get OTP
          </button>
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <NavLink to="/login">Back to Login</NavLink>
          </p>
        </section>
      </InputForm>
    </>
  );
}

export default ResetPassword;

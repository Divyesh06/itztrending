import { useState, useEffect, useRef, useContext } from "react";
//import navlink
import { NavLink, useNavigate } from "react-router-dom";
import FloatingLabelInput from "./FloatingLabelInput";
import InputForm from "./InputForm";
import { PlusLg, Check2, ExclamationTriangle } from "react-bootstrap-icons";
import { reset_password} from "../auth_apis";
import { useSearchParams } from "react-router-dom";
import TrendContext from "../Context/TrendProvider";
function VerifyOtp(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email"));
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [newPassword , setNewPassword] = useState("");
    function handleSubmit(e) {
      e.preventDefault();
      reset_password(otp, email, newPassword);
      navigate("/login");
    }


  return (
    <>
      <InputForm handleSubmit={handleSubmit}>
        <section style={{ position: "relative" }}>
        <h1 style={{ fontSize: "32px" }}>
            Verify OTP
            <span style={{ color: "var(--primary-color)", fontSize: "1.4em" }}>
              .
            </span>

            
          </h1>
          <p style={{ fontSize: "17px", marginTop: "15px" }}>
            We just sent you an OTP to your {email}. Check your Inbox and Spams
          </p>
          <br></br>
          <FloatingLabelInput
            type="text"
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            icon={"lock-fill"}
          />
          <FloatingLabelInput
            type="password"
            label="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={"eye"}
          />
        </section>
        <section>
          <button type="submit">
            Reset Password
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

export default VerifyOtp;

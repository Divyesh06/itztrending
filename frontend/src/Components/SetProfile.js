import { useState, useEffect, useRef, useContext } from "react";
//import navlink
import { useNavigate } from "react-router-dom";
import FloatingLabelInput from "./FloatingLabelInput";
import InputForm from "./InputForm";
import { check_username_availability } from "../auth_apis";
import { PlusLg, Check2, ExclamationTriangle } from "react-bootstrap-icons";
import { set_username_and_profpic } from "../auth_apis";
import TrendContext from "../Context/TrendProvider";
function SetProfile(props) {
  const { profpic, setProfpic, username, setUsername } = useContext(TrendContext);

  const [isAvailable, setIsAvailable] = useState(true);

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

const navigate=useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const [ success, response ] = await set_username_and_profpic(username, profpic);
      if (success) {
        console.log(response);
        setProfpic(response.user.profpic);
        setUsername(response.user.username);
        navigate('/');
        
      } else {
        alert(response);
      }
  }

  function profpic_change() {
    setProfpic(fileInputRef.current.files[0]);
    imageRef.current.src = URL.createObjectURL(fileInputRef.current.files[0]);
  }

  async function checkAvailability() {
    if (username.length < 3) {
      setIsAvailable(false);
      return;
    }
    const availability = await check_username_availability(username);

    setIsAvailable(availability.available);
  }

  useEffect(
    function () {
      checkAvailability();
    },
    [username]
  );

  return (
    <>
      <InputForm handleSubmit={handleSubmit}>
        <section style={{ position: "relative" }}>
          <h1 style={{ fontSize: "32px" }}>
            Create Profile
            <span style={{ color: "var(--primary-color)", fontSize: "1.2em" }}>
              .
            </span>
          </h1>
          <center>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                fileInputRef.current.click();
              }}
            >
              <img
                ref={imageRef}
                className="profpic"
                height="140px"
                width="140px"
                style={{ marginTop: "40px", marginBottom: "10px" }}
                src="https://api.multiavatar.com/Divyesh%20Lakhotia.png"
              ></img>
              <input
                type="file"
                id="profpic-file-input"
                style={{ display: "none" }}
                onChange={profpic_change}
                ref={fileInputRef}
                accept="image/*"
              ></input>
              <div className="add-profpic-icon">
                <PlusLg
                  size={25}
                  style={{ marginTop: "7px" }}
                  color="var(--text-color)"
                />
              </div>
            </div>
          </center>
          <FloatingLabelInput
            type="text"
            label="Username"
            value={username}
            onChange={async function (e) {
              await setUsername(e.target.value);
            }}
            icon={"at"}
          />
          <p
            style={{ marginTop: "20px", textAlign: "center", fontSize: "15px" }}
          >
            <span style={{ margin: "50px 5px" }}>
              {isAvailable ? (
                <Check2 size={15} color="#15ff00" />
              ) : (
                <ExclamationTriangle size={15} color="#ff3333" />
              )}
            </span>
            {isAvailable ? "Username available" : "Username already exists"}
          </p>
        </section>
        <section>
          <button type="submit" disabled={!isAvailable}>
            Continue
          </button>

          {/* <br></br>
        
            <FloatingLabelInput type="email" label="Email" value={email} onChange={function(e){setEmail(e.target.value)}}/>
            <FloatingLabelInput type="password" label="Password" value={password} onChange={function(e){setPassword(e.target.value)}} />
            
            {mode == "login" ? <a href="/reset-password" className="reset-link">Forgot Password?</a> : ""}
            
            </section>
            <section>
            
            <p style={{marginTop: "20px", textAlign: "center"}}>{mode=="signup" ? "Already have an account?" : "Don't have an account?"} <a href={mode=="signup" ? "/login" : "/signup"}>{mode=="signup" ? "Login" : "Sign Up"}</a> </p> */}
        </section>
      </InputForm>
    </>
  );
}

export default SetProfile;

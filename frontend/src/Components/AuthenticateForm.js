import { useState } from "react"
//import navlink
import FloatingLabelInput from "./FloatingLabelInput";
import { NavLink } from "react-router-dom"
import InputForm from "./InputForm";

function Authenticate(props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const mode = props.mode

    async function handleSubmit(e) {
        e.preventDefault()
        console.log(email, password)
        
    }

    return (
        <>
        <InputForm handleSubmit={handleSubmit}>
            
            <section style={{position: "relative"}}>
            <p style={{fontSize: "17px", marginTop: "15px"}}>{mode=="signup" ? "Dive into what's Trending!" : "Continue with your account"}</p>
            <h1 style={{fontSize: "32px"}}>{mode=="signup" ? "Create an Account" : "Welcome Back"}<span style={{color: "var(--primary-color)", fontSize: "1.4em"}}>.</span></h1>
            <br></br>
        
            <FloatingLabelInput type="email" label="Email" value={email} onChange={function(e){setEmail(e.target.value)}} icon={"envelope-fill"}/>
            <FloatingLabelInput type="password" label="Password" value={password} onChange={function(e){setPassword(e.target.value)}} icon={"eye"}/>
            
            {mode == "login" ? <a href="/reset-password" className="reset-link">Forgot Password?</a> : ""}
            
            </section>
            <section>
            <button type="submit">{mode=="signup" ? "Get Started" : "Continue"}</button>
            <p style={{marginTop: "20px", textAlign: "center", marginBottom: "15px"}}>{mode=="signup" ? "Already have an account?" : "Don't have an account?"} <a href={mode=="signup" ? "/login" : "/signup"}>{mode=="signup" ? "Login" : "Sign Up"}</a> </p>
            </section>
            
            
        </InputForm>
      </>
    )

}

export default Authenticate
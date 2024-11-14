import React from "react"
//import navlink

import { NavLink } from "react-router-dom"

function Authenticate(props) {
    //Mode is either signup or login

    //Send a request to auth/login or auth/signup

    const mode = props.mode

    async function handleSubmit(e) {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        if (mode == "signup") {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({email: email, password: password})
            })

            
        
        } else if (mode == "login") {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({email: email, password: password})
            })

            alert(await response.json())
        }
    }

    return (
        <>
        <h1>{mode=="signup" ? "Sign Up" : "Login"}</h1>
        <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
        </div>
        <button type="submit" onClick={handleSubmit}>{mode=="signup" ? "Get Started" : "Login"}</button>
        
        </>
    )


}

export default Authenticate
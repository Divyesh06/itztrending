import React from "react"
import {NavLink} from "react-router-dom"

function Authenticate(mode) {
    //Mode is either signup or login
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
        <button type="submit">{mode=="signup" ? "Get Started" : "Login"}</button>
        <p>{mode=="signup" ? "Already have an account?" : "Don't have an account?"} <NavLink to={mode=="signup" ? "/login" : "/signup"}>{mode=="signup" ? "Login" : "Sign Up"}</NavLink></p>
        </>
    )
}
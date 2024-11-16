import { post_data_to_server } from "./apis"

async function check_auth() {
    //Run on init
    //Returns true, user_data if logged in else false, null

    const response = await fetch("http://localhost:5000/api/auth/check-auth", {
        method: "GET",
        credentials: "include"
    })

    if (response.ok) {
        const user_data = await response.json()
        return [true, user_data]

    } else {
        return [false, null]
    }
}

async function login(email, password) {
    //Returns true, user_data if logged in else false, error message

    const response = await post_data_to_server("/auth/login", {email: email, password: password}, false)


    if (response.ok) {
        const user_data = await response.json()
        return [true, user_data]
    } else {
        const error_msg = await response.json()
        return [false, error_msg.error]
    }
}

async function signup(email, password) {
    //Returns true, user_data if logged in else false, error message

    const response = await post_data_to_server("/auth/signup", {email: email, password: password}, false)

    if (response.ok) {
        const user_data = await response.json()
        return [true, user_data]
    } else {
        const error_msg = await response.json()
        return [false, error_msg.error]
    }
}

async function set_username_and_profpic(username, profpic) {
    //profpic can be null. Only pass input file if you want to change profpic
    //Returns true, user_data is successful else false, error message

    const formData = new FormData();
    formData.append('username', username);

    if (profpic) {
        formData.append('profpic', profpic);
    }

    const response = await fetch("http://localhost:5000/api/auth/set_username_and_profpic", {
        method: "POST",
        body: formData,
        credentials: "include"
    });   
    
    if (response.ok) {
        return [true, await response.json()]
    }

    const error_msg = await response.json()
    return [false, error_msg.error]

}

async function check_username_availability(username) {
    //Returns true if username is available else false
    
    // const response = await fetch(http://localhost:5000/api/auth/check_username_availability, {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({username: username})
    // });   

    const availability = await post_data_to_server("/auth/check_username_availability", {username: username})
    return availability
}

async function send_password_reset_request(email) {
    //Returns true,null if password reset request sent else false, error message

    const response = await post_data_to_server("/auth/reset-password", {email: email}, false)

    if (response.ok) {
        return true, null
    } else {
        const error_msg = await response.json()
        return [false, error_msg.error]
    }
    }

async function reset_password(token, email, new_password) {
    //Returns true,null if password reset else false, error message

    const response = await post_data_to_server("/auth/check-reset-token", {token: token, email: email, password: new_password}, false)

    if (response.ok) {
        return true, null
    } else {
        const error_msg = await response.json()
        return [false, error_msg.error]
    }
}

async function logout() {
    //Redirects to login
    await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        credentials: "include"
    })
}

//const {isLoggedIn, userData} = await check_auth()

export {check_auth, login, signup, set_username_and_profpic, check_username_availability, send_password_reset_request, reset_password}
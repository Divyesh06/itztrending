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
    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({email: email, password: password})
    })


    if (response.ok) {
        const user_data = await response.json()
        return [true, user_data]
    } else {
        const error_msg = await response.json().error
        return [false, error_msg]
    }
}

async function signup(email, password) {
    //Returns true, user_data if logged in else false, error message
    const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({email: email, password: password})
    })

    if (response.ok) {
        const user_data = await response.json()
        return [true, user_data]
    } else {
        const error_msg = await response.json().error
        return [false, error_msg]
    }
}

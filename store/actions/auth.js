import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId: userId,
            token: token 
        });
    }
}

export const signUp = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCdAcSZSrnK0gFiGwJsdpoAKCoOeFDjwDw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true 
            })
        });

        if(!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = "Something Went Wrong"
            if (errorId === "EMAIL_EXISTS") {
                message = "This Email exists";
            } 
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(authenticate(resData.userId, resData.tokenId, parseInt(resDate.expiresIn) * 1000));

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);

    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCdAcSZSrnK0gFiGwJsdpoAKCoOeFDjwDw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true 
            })
        });

        if(!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = "Something Went Wrong"
            if (errorId === "EMAIL_NOT_FOUND") {
                message = "This Email could not be found";
            } else if (errorId === "INVALID_PASSWORD") {
                message = "Invalid Password";
            }

            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(authenticate(resData.userId, resData.tokenId, parseInt(resDate.expiresIn) * 1000));

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);

    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem("userData", JSON.stringify({
        token: token,
        userId: userId,
        expirayDate: expirationDate.toISOString() 
    }))
}

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem("userData");
    return {
        type: LOGOUT
    }
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout)
        }, expirationTime)
    }
}
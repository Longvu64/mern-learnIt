import {createContext, useReducer, useEffect} from 'react'
import axios from 'axios'
import {apiUrl, LOCAL_STORAGE_TOKEN_NAME} from './constants'
import setAuthToken from '../utils/setAuthToken'

import {authReducer} from '../reducers/authReducer'

export const AuthContext = createContext()
//file này để chứa tất cả trạng thái của auth, những file khác như login register khi cần chỉ việc lấy các hàm trong đây và sử dụng
function AuthContextProvider ({children}){
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null
    })
//Authenticated users 

    const loadUser = async () => {
        if(localStorage[LOCAL_STORAGE_TOKEN_NAME]){
            setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
        }
        try {
            const response = await axios.get(`${apiUrl}/auth`)
            if(response.data.success){
                dispatch({
                    type: 'SET_AUTH', 
                    payload: {isAuthenticated: true, user: response.data.user}})
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
            setAuthToken(null)
            dispatch({
                type: 'SET_AUTH', 
                payload: {isAuthenticated: false, user: null}})
        }
    }

    useEffect(() => {loadUser()},[])
    //Login
    const loginUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, userForm)
            if(response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
                await loadUser() //phải gọi hàm này để sau khi login sẽ chuyển ngay đến login
                return response.data
            }
        } catch (error) {
            if(error.response.data) return error.response.data
            else return{success: false, message:error.message}
        }
    }

    //Register
    const registerUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/register`, userForm)
            if(response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
                await loadUser() //phải gọi hàm này để sau khi login sẽ chuyển ngay đến login
                return response.data
            }
        } catch (error) {
            if(error.response.data) return error.response.data
            else return{success: false, message:error.message}
        }
    }
    //Logout

    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
        dispatch({
            type: 'SET_AUTH', 
            payload: {isAuthenticated: false, user: null}})
    }
    //Context data
     const authContextData= { authState, loginUser, registerUser, logoutUser}
    //Return Provider
    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider

// import { createContext, useReducer, useEffect } from 'react'
// import { authReducer } from '../reducers/authReducer'
// import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from './constants'
// import axios from 'axios'
// import setAuthToken from '../utils/setAuthToken'

// export const AuthContext = createContext()

// const AuthContextProvider = ({ children }) => {
// 	const [authState, dispatch] = useReducer(authReducer, {
// 		authLoading: true,
// 		isAuthenticated: false,
// 		user: null
// 	})

// 	// Authenticate user
// 	const loadUser = async () => {
// 		if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
// 			setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
// 		}

// 		try {
// 			const response = await axios.get(`${apiUrl}/auth`)
// 			if (response.data.success) {
// 				dispatch({
// 					type: 'SET_AUTH',
// 					payload: { isAuthenticated: true, user: response.data.user }
// 				})
// 			}
// 		} catch (error) {
// 			localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
// 			setAuthToken(null)
// 			dispatch({
// 				type: 'SET_AUTH',
// 				payload: { isAuthenticated: false, user: null }
// 			})
// 		}
// 	}

// 	useEffect(() => {loadUser()},[])
// 	// Login
// 	const loginUser = async userForm => {
// 		try {
// 			const response = await axios.post(`${apiUrl}/auth/login`, userForm)
// 			if (response.data.success)
// 				localStorage.setItem(
// 					LOCAL_STORAGE_TOKEN_NAME,
// 					response.data.accessToken
// 				)

// 			await loadUser()

// 			return response.data
// 		} catch (error) {
// 			if (error.response.data) return error.response.data
// 			else return { success: false, message: error.message }
// 		}
// 	}

// 	// Register
// 	const registerUser = async userForm => {
// 		try {
// 			const response = await axios.post(`${apiUrl}/auth/register`, userForm)
// 			if (response.data.success)
// 				localStorage.setItem(
// 					LOCAL_STORAGE_TOKEN_NAME,
// 					response.data.accessToken
// 				)

// 			await loadUser()

// 			return response.data
// 		} catch (error) {
// 			if (error.response.data) return error.response.data
// 			else return { success: false, message: error.message }
// 		}
// 	}

// 	// Logout
// 	const logoutUser = () => {
// 		localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
// 		dispatch({
// 			type: 'SET_AUTH',
// 			payload: { isAuthenticated: false, user: null }
// 		})
// 	}

// 	// Context data
// 	const authContextData = { loginUser, registerUser, logoutUser, authState }

// 	// Return provider
// 	return (
// 		<AuthContext.Provider value={authContextData}>
// 			{children}
// 		</AuthContext.Provider>
// 	)
// }

// export default AuthContextProvider
import { createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";
import { toast } from "react-toastify";

// This slice handles the state and actions related to user authentication and other user-related information.
const userSlice= createSlice({
    name: "user",           // Name of the slice
    initialState: {
        loading: false,
        isAuthenticated: false,
        user : {},
        leaderboard: [],
    },
    // Reducers define how the state changes for specific actionslike logout ;
    reducers:{

        registerRequest(state,action){
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {};
        },
        registerSuccess(state,action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        registerFailed(state,action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
        },   

        // ##################################   LOGIN
        loginRequest(state,action){
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {};
        },
        loginSuccess(state,action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFailed(state,action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
        },   

        // ---------------------------------

        fetchUserRequest(state,action){
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {};
        },
        fetchUserSuccess(state,action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        fetchUserFailed(state,action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
        },  

// ------------------------------------------------------
        logoutSuccess(state,action){
            state.isAuthenticated = false,
            state.user= {};
        },
        logoutFailed(state, action){
            state.loading= false;
            state.isAuthenticated = state.isAuthenticated;
            state.user= state.user;
        },

        fetchLeaderboardRequest(state,action){
            state.loading = true;
            state.leaderboard = [];
        },
        fetchLeaderboardSuccess(state,action){
            state.loading = false;
            state.leaderboard = action.payload;
        },
        fetchLeaderboardFailed(state,action){
            state.loading = false;
            state.leaderboard = [];
        },


        clearAllErrors(state,action){
            state.user = state.user;
            state.isAuthenticated = state.isAuthenticated;
            state.leaderboard = state.leaderboard;
            state.loading =false;
        },
    },
});


// ACTIONS CREATORS:---------------------------------------------

export const register = (data) => async(dispatch) => {
    dispatch(userSlice.actions.registerRequest());
    try{
        const response = await axios.post(
            " https://bidverse-backend.onrender.com/api/v1/user/register",
            data,
            {
                withCredentials:true,
                headers: {"Content-type":"multipart/form-data" },
            }
        );
        dispatch(userSlice.actions.registerSuccess(response.data));
        toast.success(response.data.message);
        dispatch(userSlice.actions.clearAllErrors());
    }catch(error){
        dispatch(userSlice.actions.registerFailed());
        toast.error(error.response.data.message);
        dispatch(userSlice.actions.clearAllErrors());
    }

};


export const login= (data) => async(dispatch) => {
    dispatch(userSlice.actions.loginRequest());
    try{
        const response = await axios.post(
            " https://bidverse-backend.onrender.com/api/v1/user/login",
            data,
            {
                withCredentials:true,
                headers: {"Content-type":"application/json" },
            }
        );
        dispatch(userSlice.actions.loginSuccess(response.data));
        toast.success(response.data.message);
        dispatch(userSlice.actions.clearAllErrors());
    }catch(error){
        dispatch(userSlice.actions.loginFailed());
        toast.error(error.response.data.message);
        dispatch(userSlice.actions.clearAllErrors());
    }

};

export const logout = () => async(dispatch) => {
    try{
        const response = await axios.get(
            "https://bidverse-backend.onrender.com/api/v1/user/logout", 
            {withCredentials: true});
        dispatch(userSlice.actions.logoutSuccess());
        toast.success(response.data.message);
        dispatch(userSlice.actions.clearAllErrors());
    }catch(error){
        dispatch(userSlice.actions.logoutFailed());
        toast.error(error.response.data.message);
        dispatch(userSlice.actions.clearAllErrors());
    }
};


export const fetchUser = () => async(dispatch) => {
    dispatch(userSlice.actions.fetchUserRequest());
    try{
        const response = await axios.get(
            "https://bidverse-backend.onrender.com/api/v1/user/me", 
            {withCredentials: true});
        dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
        dispatch(userSlice.actions.clearAllErrors());
    }catch(error){
        dispatch(userSlice.actions.fetchUserFailed());
        dispatch(userSlice.actions.clearAllErrors());
        console.error("Error details:", error.response || error.message);
    }
};


export const fetchLeaderboard = () => async(dispatch) => {
    dispatch(userSlice.actions.fetchLeaderboardRequest());
    try{
        const response = await axios.get(
            "https://bidverse-backend.onrender.com/api/v1/user/leaderboard", 
            {withCredentials: true});
        dispatch(userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard));
        dispatch(userSlice.actions.clearAllErrors());
    }catch(error){
        dispatch(userSlice.actions.fetchLeaderboardFailed());
        dispatch(userSlice.actions.clearAllErrors());
        console.error(error);
    }
};

export default userSlice.reducer;
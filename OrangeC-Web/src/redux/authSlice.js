import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        id:'',
        email:'',
        accessToken:'',
        user:{}
    },
    reducers: {
        setAuth: (state, action) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },

        removeAuth: (state) => {
            state.id = '';
            state.email = '';
            state.accessToken = '';
            state.user = {};
        },
        setAvt: (state, action) => {
            console.log('action.payload.image',action.payload);
            state.user.image = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
});

export const { setAuth,removeAuth,setAvt,setUser } = authSlice.actions;
export default authSlice.reducer;
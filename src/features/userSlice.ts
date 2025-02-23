import { createSlice} from '@reduxjs/toolkit';
import { UserState } from '../types/UserState';
import {GoogleSignin} from "@react-native-google-signin/google-signin"



const initialState: UserState = {
    userInfo: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
            state.isLoggedIn = true
        },
        clearUser: (state) => {
            GoogleSignin.signOut()
            state.userInfo = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;


export default userSlice.reducer;

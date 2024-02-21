import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLogged: false
};

const userSlice = createSlice({
    name: "user-slice",
    initialState,
    reducers: {
        logUser: (prevState, user) => {
            console.log("chamou");
            return {
                user,
                isLogged: true
            }
        },
        logout: (prevState) => {
            return initialState;
        }
    }
});

export const {logUser, logout} = userSlice.actions;

export default userSlice.reducer;
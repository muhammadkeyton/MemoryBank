import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    value:"",
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        login:(state,action)=>{
            if(typeof(action.payload) === "object"){
                localStorage.setItem("profile",JSON.stringify(action.payload));
                state.value = "";
                
            }else{
                state.value = action.payload
            }

        },
        sign_Up:(state,action)=>{
            if(typeof(action.payload) === "object"){
                localStorage.setItem("profile",JSON.stringify(action.payload));
                state.value = "";
                
            }else{
                state.value = action.payload
            }
        },

        google_oAuth:(state,action)=>{
            localStorage.setItem("profile",JSON.stringify(action.payload));
        },

        logOut:(state,action)=>{
            localStorage.removeItem("profile");
            localStorage.clear();
        },
        clearError:(state,action)=>{
            state.value = ""
        }
    }
});

//exporting actions
export const {login,sign_Up,logOut,google_oAuth,clearError} =  authSlice.actions;

//exporting the reducer
export default  authSlice.reducer;

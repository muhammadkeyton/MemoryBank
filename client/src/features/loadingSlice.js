import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value:false
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers:{
        startLoading:(state,action)=>{
            state.value = true;
        },
        stopLoading:(state,action)=>{
            state.value = false;
        }
    }
});

//exporting actions
export const {startLoading,stopLoading} =  loadingSlice.actions;

//exporting the reducer
export default  loadingSlice.reducer;
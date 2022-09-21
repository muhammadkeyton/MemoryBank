import { configureStore } from '@reduxjs/toolkit'

import postsReducer from "../features/postsSlice"
import authReducer from "../features/authSlice"
import loadingSlice from '../features/loadingSlice'


export const store = configureStore({
  reducer: {
    posts:postsReducer,
    auth:authReducer,
    loading:loadingSlice,

  },
})
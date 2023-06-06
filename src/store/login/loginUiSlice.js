import React from 'react'
import { createSlice } from "@reduxjs/toolkit";
const loginUiSlice = createSlice({
    name: 'loginUi',
    initialState: {loginIsVisible: false},

    reducers:{
      toggle(state){
        state.loginIsVisible =!state.loginIsVisible
      }
    }
})

export const loginUiActions= loginUiSlice.actions;
export default loginUiSlice;
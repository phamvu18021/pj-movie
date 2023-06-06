import React from 'react'
import { createSlice } from "@reduxjs/toolkit";
const sidebarUiSlice = createSlice({
    name: 'sidebarUi',
    initialState: {sidebarIsVisible: false},

    reducers:{
      toggle(state){
        state.sidebarIsVisible =!state.sidebarIsVisible
      }
    }
})

export const sidebarUiActions= sidebarUiSlice.actions;
export default sidebarUiSlice;
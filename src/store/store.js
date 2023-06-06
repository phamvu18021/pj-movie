import { configureStore } from "@reduxjs/toolkit";

import loginUiSlice from "./login/loginUiSlice";
import sidebarUiSlice from "./sidebar/sidebarUiSlice";
const store = configureStore({
    reducer:{
        loginUi: loginUiSlice.reducer,
        sidebarUi:sidebarUiSlice.reducer,
    },
});

export default store;
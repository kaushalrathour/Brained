import {configureStore} from "@reduxjs/toolkit"
import userSlice from "../features/userSlice"
import themeSlice from "../features/themeSlice"
import taskSlice from "../features/taskSlice"
export const store = configureStore({
    reducer: {
        user: userSlice,
        theme: themeSlice,
        task: taskSlice
    }
})
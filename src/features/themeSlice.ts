import { createSlice } from '@reduxjs/toolkit';
import { ThemeState } from '../types/ThemeState';
import { darkModeColors, lightModeColors } from '../assets/colors';

const initialState: ThemeState = {
    isDarkMode: false,
    colors: lightModeColors
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        themeToggle: (state) => {
            const isDarkMode = !state.isDarkMode;
            state.isDarkMode = isDarkMode;
            state.colors = isDarkMode? darkModeColors: lightModeColors
        },
    },
});


export const { themeToggle } = themeSlice.actions;


export default themeSlice.reducer;

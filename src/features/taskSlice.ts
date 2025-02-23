import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    tasks: []
};

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTask: (state, action) => {
            const task = action.payload;
            const previousTask = state.tasks
            if (task) {
                state.tasks = [...previousTask, task];
                AsyncStorage.setItem("tasks", JSON.stringify(state.tasks)).catch(error => {
                    console.error("Error saving tasks:", error);
                });
                console.log("Tasks after adding:", state.tasks);
            }
        },
        updateTask: (state, action) => {
            const updatedTask = action.payload;
            console.log("Update Task", updatedTask._id);
            if (updatedTask && updatedTask._id) {
                const index = state.tasks.findIndex(task => task._id === updatedTask._id);
                console.log("Index", index);
                if (index !== -1) {
                    state.tasks[index] = { ...state.tasks[index], ...updatedTask };
                    AsyncStorage.setItem("tasks", JSON.stringify(state.tasks)).catch(error => {
                        console.error("Error updating tasks:", error);
                    });
                }
            }
            console.log("After Update")
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
            AsyncStorage.setItem("tasks", JSON.stringify(state.tasks)).catch(error => {
                console.error("Error deleting tasks:", error);
            });
        },
        setTasks: (state, action) => {
            state.tasks = action.payload;
            AsyncStorage.setItem("tasks", JSON.stringify(state.tasks)).catch(error => {
                console.error("Error setting tasks:", error);
            });
        },
        deleteAllTask: (state)=>{
            state.tasks = []
        }
    },
});

export const { setTask, updateTask, deleteTask, setTasks, deleteAllTask } = taskSlice.actions;

export default taskSlice.reducer;

import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { NavigationContainer as Navigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/Home";
import LoginScreen from "./screens/Login";
import { StackParamList } from "./types/StackParamList";
import LoadingScreen from "./components/Loading";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './features/userSlice';
import AddTaskScreen from "./screens/AddTask";
import { ThemeState } from "./types/ThemeState";
import UpdateTaskScreen from "./screens/UpdateTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setTasks } from "./features/taskSlice";

const Stack = createStackNavigator<StackParamList>();
const { Screen, Navigator } = Stack;

export default function NavigationContainer() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [initialRoute, setInitialRoute] = useState<keyof StackParamList>('Login');
    const {isDarkMode, colors}:ThemeState = useSelector((state: any)=> state.theme)
    const dispatch = useDispatch();
    const options = {
        headerShown: false
    }

    useEffect(() => {
        const checkUser = async () => {
            try {
                await GoogleSignin.hasPlayServices();
                const userInfo = GoogleSignin.getCurrentUser();
                if (userInfo) {
                    const tasks = await AsyncStorage.getItem("tasks");
                    if(tasks !== null) {
                        dispatch(setTasks(JSON.parse(tasks)))
                    }
                    dispatch(setUser(userInfo.user));
                    setInitialRoute('Home'); 
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, [dispatch]);

    if (isLoading) {
        return <LoadingScreen />;
    } else {
        return (
            <Navigation>
                <StatusBar backgroundColor={colors.backgroundPrimary}/>
                <Navigator initialRouteName={initialRoute}>
                    <Screen name="Home" component={HomeScreen} options={options} />
                    <Screen name="Login" component={LoginScreen} options={options} />
                    <Screen name="AddTask" component={AddTaskScreen} options={options} />
                    <Screen name="UpdateTask" component={UpdateTaskScreen} options={options} />
                </Navigator>
            </Navigation>
        );
    }
}

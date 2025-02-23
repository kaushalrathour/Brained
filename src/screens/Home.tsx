import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import { UserState } from "../types/UserState";
import { clearUser } from "../features/userSlice";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { themeToggle } from "../features/themeSlice";
import { HomeProps } from "../types/HomeProps";
import { ThemeState } from "../types/ThemeState";
import { ScaledSheet } from "react-native-size-matters";
import { deleteTask, deleteAllTask } from "../features/taskSlice";

export default function HomeScreen({ navigation }: HomeProps) {
    const dispatch = useDispatch();
    const { tasks } = useSelector((state: any) => state.task);
    const userInfo: UserState = useSelector((state: any) => state.user.userInfo);
    const { colors, isDarkMode }: ThemeState = useSelector((state: any) => state.theme);
    
    const handleLogout = () => {
        dispatch(clearUser());
        dispatch(deleteAllTask());
        navigation.navigate("Login");
    };

    const handleToggleTheme = () => {
        dispatch(themeToggle());
    };

    const handleAddTask = () => {
        navigation.navigate("AddTask");
    };

    const handleDeleteTask = (id: string) => {
        dispatch(deleteTask(id));
    };

    const handleDeleteAllTasks = () => {
        dispatch(deleteAllTask());
    };

    return (
        <Container>
            <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
                <View style={[styles.header, { backgroundColor: colors.backgroundHeader, shadowColor: colors.shadowColor }]}>
                    <View>
                        <Text style={[styles.welcomeText, { color: colors.textPrimary }]}>Welcome back,</Text>
                        <Text style={[styles.userName, { color: colors.textPrimary }]}>{userInfo?.name || 'User'}</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={handleToggleTheme} style={styles.themeButton}>
                            <Icon name={isDarkMode ? "brightness-7" : "brightness-2"} size={24} color={colors.iconPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: colors.buttonSecondary }]}>
                            <Text style={{ color: colors.buttonText }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.content}>
                    {tasks.length > 0 ? (
                        <FlatList 
                            data={tasks} 
                            keyExtractor={(task) => task._id}
                            renderItem={({ item }) => (
                                <View style={styles.taskItem}>
                                    {item.image && <Image source={{ uri: item.image }} style={styles.taskImage} />}
                                    {item.signature && (
                                        <View style={styles.signatureBox}>
                                            <Image source={{ uri: item.signature }} style={styles.signatureImage} />
                                        </View>
                                    )}
                                    <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                                    <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>{item.description}</Text>
                                    <Text style={[styles.taskDeadline, { color: colors.textSecondary }]}>Deadline: {new Date(item.deadline).toLocaleDateString()}</Text>
                                    <View style={styles.taskActions}>
                                        <TouchableOpacity onPress={() => navigation.navigate("UpdateTask", { task: item })}>
                                            <Icon name="edit" size={24} color={colors.iconPrimary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteTask(item._id)}>
                                            <Icon name="delete" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    ) : (
                        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>No tasks yet - start adding some!</Text>
                    )}
                    {tasks.length > 0 && (
                        <TouchableOpacity onPress={handleDeleteAllTasks} style={[styles.deleteAllButton, { backgroundColor: "red" }]}> 
                            <Text style={{ color: "white" }}>Delete All Tasks</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity onPress={handleAddTask} style={[styles.addButton, { backgroundColor: colors.buttonPrimary, shadowColor: colors.shadowColor }]}>
                    <Icon name="add" size={24} color={colors.buttonText} />
                    <Text style={[styles.addButtonText, { color: colors.buttonText }]}>Add Task</Text>
                </TouchableOpacity>
            </View>
        </Container>
    );
}

const styles = ScaledSheet.create({
    container: { 
        flex: 1 
    },
    header: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '15@ms',
        paddingHorizontal: '20@ms',
        marginBottom: '20@ms',
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.1, 
        shadowRadius: 4, 
        elevation: 3 
    },
    welcomeText: { 
        fontSize: '14@ms', 
        opacity: 0.8 
    },
    userName: { 
        fontSize: '20@ms', 
        fontWeight: '600', 
        marginTop: '4@ms' 
    },
    headerIcons: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: '15@ms' 
    },
    themeButton: { 
        padding: '8@ms' 
    },
    logoutButton: { 
        paddingVertical: '8@ms', 
        paddingHorizontal: '15@ms', 
        borderRadius: '8@ms' 
    },
    content: { 
        flex: 1, 
        paddingHorizontal: '20@ms' 
    },
    taskItem: { 
        padding: '15@ms', 
        marginVertical: '8@ms', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8@ms' 
    },
    taskImage: { 
        width: '100%', 
        height: '150@ms', 
        borderRadius: '8@ms', 
        marginBottom: '10@ms' 
    },
    signatureBox: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: '10@ms', 
        borderRadius: '8@ms', 
        alignItems: 'center', 
        marginTop: '10@ms' 
    },
    signatureImage: { 
        width: '100%', 
        height: '100@ms', 
        resizeMode: 'contain' 
    },
    taskTitle: { 
        fontSize: '16@ms', 
        fontWeight: 'bold' 
    },
    taskDescription: { 
        fontSize: '14@ms', 
        marginTop: '4@ms' 
    },
    taskDeadline: { 
        fontSize: '12@ms', 
        marginTop: '4@ms', 
        fontStyle: 'italic' 
    },
    taskActions: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: '10@ms' 
    },
    deleteAllButton: { 
        marginTop: '20@ms', 
        padding: '10@ms', 
        alignItems: 'center', 
        borderRadius: '8@ms' 
    },
    addButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: '10@ms', 
        position: 'absolute', 
        bottom: '30@ms', 
        right: '20@ms', 
        paddingVertical: '15@ms', 
        paddingHorizontal: '20@ms', 
        borderRadius: '30@ms' 
    },
    addButtonText: { 
        fontSize: '14@ms', 
        fontWeight: '500' 
    },
});

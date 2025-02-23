import React from 'react';
import { View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeState } from '../types/ThemeState';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

type Prop = {
    children: React.JSX.Element
}

export default function Container({ children }: Prop) {
    const { colors }: ThemeState = useSelector((state: any) => state.theme);
    return (
        <View style={[styles.container, {backgroundColor: colors.backgroundPrimary}]}>
            <Toast/>
            {children}
        </View>
    );
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        padding: '10@ms',
    },
});

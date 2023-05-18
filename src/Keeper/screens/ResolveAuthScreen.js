import React, { useContext, useEffect } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { ActivityIndicator, View } from "react-native";
const ResolveAuthScreen = ({navigation}) => {
    const { tryLocalLogin } = useContext(AuthContext);

    useEffect(() => {
        tryLocalLogin();
    },[])
    return null
    ;
}

export default ResolveAuthScreen;
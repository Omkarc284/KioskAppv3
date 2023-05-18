import React, { useContext, useEffect } from "react";
import { Context as AuthContext } from "../../Keeper/context/AuthContext";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
const ResolveAuthScreen = () => {
    const { tryLocalLogin } = useContext(AuthContext);

    useEffect(() => {
        tryLocalLogin();
    }, [])
    return null;
}

export default ResolveAuthScreen;
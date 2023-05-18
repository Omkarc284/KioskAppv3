import React,{useState} from 'react';
import {View, Text, StyleSheet, FlatList } from 'react-native';

const DashboardScreen = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    return (
        <>
            { (errorMessage) ?
                        <View>
                            <Text style={styles.subtitle}> {errorMessage}</Text>
                        </View> :
                        <View>
                            <Text style={styles.subtitle}>Dashborad will appear here! </Text>
                        </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    subtitle: {
        color:'#000F4D',
        fontSize: 18,
        fontWeight: '300',
        alignSelf:'center'
    }
});

export default DashboardScreen;
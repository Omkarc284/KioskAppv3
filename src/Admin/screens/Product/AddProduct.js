import React from "react";
import { Text, View } from "react-native";
import HeaderBar from "../../Components/Headerbar";


const AddProduct = props => {
    return(
        <>
            <HeaderBar navigation={props.navigation}/>
            <View style={{margin:24}}>
                <Text>You add products here</Text>
            </View>
        </>
    )
};

export default AddProduct;
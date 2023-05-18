import React from "react";
import { Text, View } from "react-native";
import HeaderBar from "../../Components/Headerbar";
const ProductDetails = props => {
    const token = props.navigation.state.params.token
    const [name, setName] = React.useState(props.navigation.state.params.product.name)
    const [id, setId] = React.useState(props.navigation.state.params.product._id)
    const [price, setPrice] = React.useState(props.navigation.state.params.product.price)
    const [status, setStatus] = React.useState(props.navigation.state.params.product.status)
    const [product, setProduct] = React.useState(props.navigation.state.params.product)
    return (
        <>
            <HeaderBar navigation={props.navigation}/>
            <View style={{margin: 24}}>
                <Text>Product id: {id}</Text>
                <Text>Product name: {name}</Text>
                <Text>Unit Price: {price}</Text>
                <Text>Status: {status}</Text>
                <Text>Date Created: {new Date(product.date_created).toDateString()}</Text>
                <Text>Time Created: {product.time_created}</Text>
            </View>
        </>
    )
}

export default ProductDetails;
import React from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView } from 'react-native'; 
import { useSelector } from 'react-redux';
import Colors from '../../constants/Colors';

const ProductDetailScreen = props => {
    const productId = props.navigation.getParam("productId");
    const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));

    return (
        <ScrollView>
            <Image source={{uri: selectedProduct.imageUrl}} style={styles.image} />
            <View style={styles.actions} >
                <Button color={Colors.primary} title="Add To Cart" />
            </View>
            <Text style={styles.price} >${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description} >{selectedProduct.description}</Text>
        </ScrollView>
    );
}

ProductDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam("productTitle")
    }
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: "100%"
    },
    actions: {
        marginVertical: 10,
        alignItems: "center"
    },  
    price: {
        fontSize: 20,
        color: "#888",
        textAlign: "center",
        marginVertical: 20,
        fontFamily: "open-sans-bold"
    },
    description: {
        fontFamily: "open-sans",
        textAlign: "center",
        fontSize: 14,
        marginHorizontal: 20
    }
});

export default ProductDetailScreen;
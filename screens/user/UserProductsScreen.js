import React from 'react';
import  { FlatList, Platform, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from './../../components/shop/ProductItem';
import HeaderButton from './../../components/UI/HeaderButton';
import Color from './../../constants/Colors';

import * as productsActions from './../../store/actions/products';

const UserProductScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();


    const deleteHandler = (id) => {
        Alert.alert("Are you sure", "Do you really want to delete", [
            { text: "No", style: "default" },
            { text: "Yes", style: "destructive", onPress: () => {
                dispatch(productsActions.deleteProduct(id));
            }}
        ])
    }

    const editProductHandler = (id) => {
        props.navigation.navigate("EditProduct", {
            productId: id
        });
    }

    return (
        <FlatList 
            data={userProducts} 
            keyExtractor={product => product.id} 
            renderItem={itemData => <ProductItem 
                image={itemData.item.imageUrl} 
                title={itemData.item.title} 
                price={itemData.item.price} 
                onSelect={() => {
                    editProductHandler(itemData.item.id);
                }}
            >
                <Button color={Color.primary} title="Edit" onPress={() => {
                    editProductHandler(itemData.item.id);
                }} ></Button>

                <Button color={Color.primary} title="Delete" onPress={() => deleteHandler(itemData.item.id)} ></Button>    

            </ProductItem>}
        />
    );
}

UserProductScreen.navigationOptions = navData => {

    return {
        headerTitle: "Your Products",
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title="Menu" 
                    iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} 
                    onPress={() => {
                        navData.navigation.toggleDrawer();      
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title="Create" 
                    iconName={Platform.OS === "android" ? "md-create" : "ios-create"} 
                    onPress={() => {
                        navData.navigation.navigate("EditProduct");      
                    }}
                />
            </HeaderButtons>
        )
    }
}

export default UserProductScreen;
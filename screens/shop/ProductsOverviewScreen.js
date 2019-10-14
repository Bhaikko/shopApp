import React, { useEffect, useState } from "react";
import {
    Text,
  View,
  FlatList,
  StyleSheet,
  Platform,
  Button,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "./../../components/shop/ProductItem";
import * as cartActions from "./../../store/actions/cart";
import * as productActions from "./../../store/actions/products";
import HeaderButton from "./../../components/UI/HeaderButton";
import Color from "./../../constants/Colors";

const ProductsOverviewScreen = props => {
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setIsLoading(true);
    dispatch(productActions.fetchProducts())
    .then(response => setIsLoading(false))
    .catch(err => {
        setError(err);
    });

  }

  // to reload page when navigated through stack naivgator
  useEffect(() => {
      const willFocusSub = props.navigation.addListener("willFocus", loadProducts);

      return () => {
          willFocusSub.remove();
      }
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts()
      .then(() => setIsLoading(false));
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    );
  }

  if(!isLoading && products.length === 0) {
      return (
          <View style={styles.centered} >
              <Text>No Products Found!</Text>
          </View>
      );
  }

  if (error) {
      return (
          <View style={styles.centered} >
              <Text>An Error Occured</Text>
          </View>
      );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Color.primary}
            title="View Details"
            onPress={() =>
              selectItemHandler(itemData.item.id, itemData.item.title)
            }
          ></Button>
          <Button
            color={Color.primary}
            title="To Cart"
            onPress={() => dispatch(cartActions.addToCart(itemData.item))}
          ></Button>
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
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
    )
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ProductsOverviewScreen;

import PRODUCTS from "./../../data/dummy-data";
import * as productActions from "./../actions/products";
import Product from "./../../models/product";

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(product => product.ownerId === "u1")
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case productActions.DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.pid
        ),
        availableProducts: state.userProducts.filter(
          product => product.id !== action.pid
        )
      };

    case productActions.CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        "u1",
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };

    case productActions.UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        product => product.id === action.pid
      );

      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;

      const availableProductIndex = state.availableProducts.findIndex(
        product => product.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };

    case productActions.SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.products.filter(
          product => product.ownerId === "u1"
        )
      };

    default:
      return state;
  }
};

export default reducer;

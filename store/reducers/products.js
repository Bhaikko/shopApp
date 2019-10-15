import * as productActions from "./../actions/products";
import Product from "./../../models/product";

const initialState = {
  availableProducts: [],
  userProducts: []
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
        action.productData.ownerId,
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
        userProducts: action.userProducts
      };

    default:
      return state;
  }
};

export default reducer;

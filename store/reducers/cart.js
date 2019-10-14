import * as actions from './../actions/cart';
import { DELETE_PRODUCT } from './../actions/products';
import { ADD_ORDER } from './../actions/order';

import CartItem from './../../models/cartItem';

const initialState = {
    items: {},
    totalAmount: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if(state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(state.items[addedProduct.id].quantity + 1, prodPrice, prodTitle, state.items[addedProduct.id].sum + prodPrice);
            } else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
            }

            return {
                ...state,
                items: { 
                    ...state.items,
                    [addedProduct.id]: updatedOrNewCartItem
                },   // adding dynamic key and value pair in object
                totalAmount: state.totalAmount + prodPrice
            }

        case actions.REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;

            let updatedCartItems;
            if (currentQty > 1) {
                const updatedCartItem = new CartItem(selectedCartItem.quantity - 1, selectedCartItem.productPrice, selectedCartItem.productTitle, selectedCartItem.sum - selectedCartItem.productPrice);
                updatedCartItems = { ...state.items, [action.pid]: updatedCartItem }
            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.pid];
            }

            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }

        // since reducer are combined in the end, any actionCreator can be called in any reducer
        case ADD_ORDER:
            return initialState;

        case DELETE_PRODUCT:
            if(!state.items[action.pid]) {
                return state;
            }

            const updatedItems = { ...state.items };
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];
            return {
                ...state, 
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
    }

    return state;
}

export default reducer;
import * as actions from './../actions/order';
import Order from './../../models/order';

const initialState = {
    orders: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.ADD_ORDER:
            const newOrder = new Order(action.orderData.id, action.orderData.items, action.orderData.amount, action.orderData.date);

            return {
                ...state,
                orders: state.orders.concat(newOrder)
            }

        case actions.SET_ORDERS:
            return {
                orders: action.orders
            }
        default: 
            return state;
    }
}

export default reducer;
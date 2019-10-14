import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
    return async dispatch => {
        try {
            const response = await fetch(
              "https://shopsapp-ad041.firebaseio.com/orders/u1.json"
            );
  
            if (!response.ok) {
              throw new Error("Something Went Wrong");
            }
  
            const resData = await response.json();
            const loadedOrders = [];
            console.log(resData);
        
            for (let key in resData) {
              loadedOrders.push(
                new Order(resData.id, resData[key].cartItems, resData[key].totalAmount, new Date(resData[key].date))
              );
            }
            dispatch({
              type: SET_ORDERS,
              orders: loadedOrders
            });
        } catch (err) {
            throw err;
        }
    }
}

export const addOrder = (cartItems, totalAmount) => {
    return async dispatch => {
        const date = new Date();
        const res = await fetch("https://shopsapp-ad041.firebaseio.com/orders/u1.json",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString(),
            })
        });

        if(!res.ok) {
            throw new Error("Something Went Wrong");
        }

        const resData = await res.json();
        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.id,
                items: cartItems,
                amount: totalAmount ,
                date: date
            }
        });
    }
}
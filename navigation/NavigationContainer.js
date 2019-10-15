import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { NavigationActions } from 'react-navigation';

import ShopNavigator from './ShopNavigation';

const NavigationContainer = props => {
    const isAuth = useSelector(state => !!state.auth.token);
    const navRef = useRef();    // to directly get a reference for a component in react

    useEffect(() => {
        if (!Auth) {
            navRef.current.dispatch(NavigationActions.navigate({
                routeName: "Auth"
            }));
        }
    }, [isAuth]);

    return <ShopNavigator ref={navRef} />
}

export default NavigationContainer;
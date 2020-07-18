import React, { useReducer, useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Input from './../../components/UI/Input';
import Card from './../../components/UI/Card';
import Colors from './../../constants/Colors';

import * as authActions from './../../store/actions/auth';


const FORM_INPUT_UPDATE = "UPDATE";
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };

    let updatedFormIsValid = true;

    for (let key in updatedValues) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    };
  }

  return state;
};


const AuthScreen = props => {
    const dispatch = useDispatch();

    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const authHandler = async () => {
        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                await dispatch(authActions.signUp(formState.inputValues.email, formState.inputValues.password));
            } else {
                await dispatch(authActions.login(formState.inputValues.email, formState.inputValues.password));
            }
            props.navigation.navigate("Shop");

        } catch (err) {
            setError(err.message)
            setIsLoading(false);
        }
    }

    const [formState, dispatchFormState] = useReducer(formReducer, {
        // Initial State
        inputValues: {
            email: "",
            password: ""
        },
        inputValidities: {
            email: false,
            password: false 
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert("An Error Occured!", error, [{ text: "Okay" }]);
        }
    }, [error]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', "#ffe3ff"]} style={styles.gradient}>
                <Card style={styles.authContainer} >
                    <ScrollView>
                        <Input 
                            id="email" 
                            label="E-mail" 
                            keyboardType="email-address" 
                            required 
                            email 
                            autoCapitalize="none" 
                            errorText="Please Enter Mail" 
                            onInputChange={inputChangeHandler}
                            initialValue="" 
                        />
                        <Input 
                            id="password" 
                            label="Password" 
                            keyboardType="email-address" 
                            required 
                            minLength={5}
                            securedTextEntry
                            autoCapitalize="none" 
                            errorText="Please Enter Password" 
                            onInputChange={inputChangeHandler}
                            initialValue="" 
                        />
                        <View style={styles.buttonContainer}>
                            {
                                isLoading ? 
                                    <ActivityIndicator size="small" color={Colors.primary} />  :
                                    <Button title={isSignUp ? "Sign Up" : "Login"} color={Colors.primary} onPress={authHandler} />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button 
                                title={`Switch To ${isSignUp ? "Login" : "Sign Up"} `} 
                                color={Colors.accent} 
                                onPress={() => {
                                    setIsSignUp(prevState => !prevState);
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>

            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

AuthScreen.navigationOptions = {
    headerTitle: "Authenticate"
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: "80%",
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;
import React, { useEffect, useState, useMemo, useReducer } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

import Home from "../screens/Home/HomeScreen";
import Login from "../screens/Login/LoginScreen";
import Singup from "../screens/Signin/SignupScreen";
import Orders from "../screens/Orders/OrdersScreen";
import Cart from "../screens/Cart/CartScreen";
import Profile from "../screens/Profile/ProfileScreen";
import Categories from "../screens/Categories/CategoriesScreen";
import Detail from "../screens/Detail/DetailScreen";
import BottomNavigator from "../components/molecules/BottomNavigator";

import { AuthContext } from "../components/context";
import { AuthLogin, AuthSingup } from "../api/index";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp({ cart, updated, token, handleQuantity, handleRemoveCart }) {
  return (
    <Tab.Navigator tabBar={(props) => <BottomNavigator {...props} />}>
      <Tab.Screen
        name="Inicio"
        // component={Home}
        options={{ headerShown: false }}
      >
        {(props) => <Home {...props} token={token} />}
      </Tab.Screen>

      <Tab.Screen
        name="Ordenes"
        // component={Orders}
        options={{ headerShown: false }}
      >
        {(props) => <Orders {...props} token={token} cart={cart} />}
      </Tab.Screen>

      <Tab.Screen
        name="Carrito"
        // component={Cart}
        options={{ headerShown: false }}
      >
        {(props) => (
          <Cart
            {...props}
            cart={cart}
            updated={updated}
            handleQuantity={handleQuantity}
            token={token}
            handleRemoveCart={handleRemoveCart}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Perfil"
        // component={Profile}
        options={{ headerShown: false }}
      >
        {(props) => <Profile {...props} cart={cart} token={token} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Router({ navigation, route }) {
  // const [isLoading, setIsloading] = useState(true);
  // const [token, setToken] = useState("");
  const [cart, setCart] = useState([]);
  var updated = false;

  const handleAddToCart = (item, quantity) => {
    updated = false;
    if (cart.length >= 1) {
      cart.map((cartitem) => {
        if (cartitem.item.name == item.name) {
          cartitem.quantity += quantity;
          updated = true;
          console.log("Actualizado");
        }
      });
      if (updated == false) {
        setCart([
          ...cart,
          {
            item: item,
            quantity: quantity,
          },
        ]);
        updated = false;
        console.log("Agregado");
      }
    } else {
      setCart([
        ...cart,
        {
          item: item,
          quantity: quantity,
        },
      ]);
      updated = false;
      console.log("Agregado");
    }
  };

  const handleQuantity = (cart, item, updtd) => {
    cart.map((cartitem, index) => {
      if (cartitem.item.name == item.name) {
        if (cartitem.quantity > 1) {
          cartitem.quantity -= 1;
          updated ? (updated = false) : (updated = true);
          console.log("Actualizado");
        } else {
          cart.splice(index, 1);
        }
      }
    });
  };

  const handleRemoveCart = () => {
    setCart([]);
  };

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({
    signIn: async (email, password) => {
      // setToken('asd');
      // setIsloading(false);

      let userToken = {
        token: null,
      };
      try {
        userToken = await AuthLogin({ email, password });
        if (userToken !== undefined) {
          await AsyncStorage.setItem("userToken", userToken.token);
        }
      } catch (e) {
        console.log(e);
      }
      // console.log("userToken", userToken);
      dispatch({ type: "LOGIN", id: email, token: userToken });
    },
    signOut: async () => {
      //setToken(null);
      //setIsloading(false);
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (e) {
        // saving error
        console.log(e);
      }
      dispatch({ type: "LOGOUT" });
    },
    signUp: async (username, email, password) => {
      // setToken("asd");
      // setIsloading(false);
      let userToken = {
        token: null,
      };
      try {
        userToken = await AuthSingup({ username, email, password });
        if (userToken !== undefined) {
          // await AsyncStorage.setItem("userToken", userToken.token);
          return userToken;
        }
      } catch (e) {
        // saving error
        console.log(e);
      }
      // dispatch({ type: "REGISTER", id: email, token: userToken });
    },
  }));

  // if (loginState.isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        // userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        // saving error
        console.log(e);
      }
      // console.log("userToken", userToken);
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 1000);
  }, []);

  useEffect(() => {
    if (cart != null) {
      // console.log(cart);
    }
  }, [cart]);

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {loginState.userToken === null || loginState.userToken === undefined ? (
          <>
            <Stack.Screen
              name="GetStarted"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={Singup}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainApp"
              // component={MainApp}
              // initialParams={{ handleAddToCart }}
              options={{ headerShown: false }}
            >
              {(props) => (
                <MainApp
                  {...props}
                  cart={cart}
                  updated={updated}
                  token={loginState.userToken}
                  handleQuantity={handleQuantity}
                  handleRemoveCart={handleRemoveCart}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Categories"
              component={Categories}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Detail"
              // component={Detail}
              options={{ headerShown: false }}
            >
              {(props) => (
                <Detail {...props} handleAddToCart={handleAddToCart} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}

export default Router;

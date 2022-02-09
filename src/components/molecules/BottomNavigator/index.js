import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../assets";
import {
  IC_Favorite,
  IC_Favorite_color,
  IC_Home,
  IC_Home_color,
  IC_Notification,
  IC_Cart2,
  IC_Cart_color,
  IC_Order,
  IC_Order_color,
  IC_Notification_color,
  IC_Profile,
  IC_Profile_color,
} from "../../../assets/images/Icons";

const Icon = ({ label, isFocused }) => {
  switch (label) {
    case "Inicio":
      return isFocused ? <IC_Home_color /> : <IC_Home />;
    case "Ordenes":
      return isFocused ? <IC_Order_color/> : <IC_Order/>;
    case "Carrito":
      return isFocused ? <IC_Cart_color /> : <IC_Cart2 />;
    case "Perfil":
      return isFocused ? <IC_Profile_color /> : <IC_Profile />;
    default:
      return <IC_Home_color />;
  }
};

const BottomNavigator = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Icon label={label} isFocused={isFocused} />
            <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingTop: 28,
    paddingBottom: 33,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  }
});

import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gap } from "../../atoms";
import { IC_Love } from "../../../assets/images/Icons";

const BoxItemTopProduct = ({ bgColor, img, text, price, stock, onPress }) => {
  return (
    <TouchableOpacity style={styles.container(bgColor)} onPress={onPress}>
      <View style={{ top: -40 }}>
        <View>
          <Image source={{ uri: `${img}` }} style={styles.image} />
          <Gap height={20} />
          <Text style={styles.text}>{text}</Text>
        </View>
        <Gap height={15} />
        <View style={styles.price}>
          <Text style={styles.wrapperButtom}>${price}</Text>
          <TouchableOpacity>
            <Text>Max: {stock}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BoxItemTopProduct;

const styles = StyleSheet.create({
  container: (bgColor) => ({
    height: 150,
    width: 140,
    backgroundColor: bgColor,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 40,
  }),
  text: {
    paddingLeft: 10,
    fontSize: 16,
    // fontFamily: fonts.Medium,
  },
  price: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  wrapperButtom: {
    fontSize: 16,
    // fontFamily: fonts.Medium,
  },
  image: {
    height: 110,
    width: 110,
    resizeMode: "contain",
    marginLeft: 20,
  },
});

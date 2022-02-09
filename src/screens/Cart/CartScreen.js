import React, { useEffect, useState, useRef } from "react";
import jwt_decode from "jwt-decode";
import { colors } from "../../assets";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { BoxCartItems } from "../../components/molecules";
import { Button, Gap } from "../../components/atoms";
import { createOrder, getOrders } from "../../api/index";

const Cart = ({
  route,
  navigation,
  cart,
  updated,
  handleQuantity,
  handleRemoveCart,
  token,
}) => {
  // const { item, totalItem } = route.params;

  const [paymentData, setPaymentData] = useState({});

  const calcPayment = () => {
    let products = destructureProducts();
    let subtotal = 0;
    let iva = 0;
    let total = 0;

    products.map((product) => {
      const { price, quantity } = product;
      let itemTotal = price * quantity;
      subtotal += itemTotal;
    });

    iva = subtotal * 0.12;
    total = subtotal + iva;

    setPaymentData({
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      total: total.toFixed(2),
      items: products,
    });
  };

  const destructureProducts = () => {
    const products = cart.map((object) => {
      const item = {
        quantity: object.quantity,
        price: object.item.price,
        _id: object.item._id,
      };
      return item;
    });
    return products;
  };

  function handleRestQuantity(cart, item, updated) {
    handleQuantity(cart, item, updated);
    navigation.reset({
      index: 0,
      routes: [{ name: "Carrito" }],
    });
  }

  function removeCart() {
    handleRemoveCart();
    console.log("boorado");
  }

  useEffect(() => {
    calcPayment();
  }, [updated, cart]);

  useEffect(() => {
    calcPayment();
  }, []);

  const getNumFact = async (token) => {
    try {
      const rta = await getOrders(token);
      console.log('fact ', rta);
      const num = rta.length + 1;
      return num;
    } catch (error) {
      console.log(error);
    }
  };

  const makeBody = async (token) => {
    const number = await getNumFact(token);
    var { id } = jwt_decode(token);
    var { items, subtotal, iva, total } = paymentData;

    const filteredItems = items.map((item) => {
      const newItem = {
        _id: item._id,
        qty: item.quantity,
      };
      return newItem;
    });

    const body = {
      number: number,
      user_id: id,
      subtotal: subtotal,
      iva: iva,
      total: total,
      items: filteredItems,
    };
    return body;
  };

  const postOrder = async () => {
    const body = await makeBody(token.token);

    const rta = await createOrder(token.token, body);

    if (rta.status === 200) {
      console.log("compra exitosa");
      notifyMessage("La compra se realizo con exito");

      setPaymentData({
        subtotal: 0,
        iva: 0,
        total: 0,
      });
    }

    removeCart();
  };

  function notifyMessage(msg) {
    Alert.alert("Aviso", msg, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  }

  return (
    <SafeAreaView>
      <Text style={styles.tittleTopProducts}>Mi carrito de compras</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionBoxTopProduct}>
          {cart.map((cartitem, index) => {
            return (
              <BoxCartItems
                key={cartitem.item._id}
                quantity={cartitem.quantity}
                image={cartitem.item.img}
                name={cartitem.item.name}
                price={cartitem.item.price}
                bgColor="rgba(187, 208, 136, 0.5)"
                onPress={() => handleRestQuantity(cart, cartitem.item, updated)}
              />
            );
          })}
        </View>

        <Gap height={50} />
        {/* Total */}
        <Text style={styles.tittleTopProducts}>Valor a pagar</Text>

        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text style={styles.tittleTotal}>Subtotal</Text>
            <Text style={styles.tittleTotal}>{paymentData.subtotal}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.tittleTotal}>Iva</Text>
            <Text style={styles.tittleTotal}>{paymentData.iva}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.tittleTotal}>Total</Text>
            <Text style={styles.tittleTotal}>{paymentData.total}</Text>
          </View>
        </View>

        <Gap height={40} />
        <Button text="Realizar orden" onPress={() => postOrder()} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  total: {
    flex: 1,
    flexDirection: "row",
  },
  totalRow: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  sectionBoxTopProduct: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tittleTopProducts: {
    margin: 24,
    color: colors.primary,
    // fontFamily: fonts.SemiBold,
    fontSize: 20,
  },
  tittleTotal: {
    margin: 8,
    color: colors.primary,
    // fontFamily: fonts.SemiBold,
    fontSize: 16,
  },
});

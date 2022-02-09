import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import jwt_decode from "jwt-decode";
import { colors } from "../../assets";
import { getOrdersByUserId, getProducts } from "../../api/index";
import { Gap } from "../../components/atoms";

const Orders = ({ token, cart }) => {
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState({
    id: 0,
    date: 0,
    total: 0,
    items: [],
  });

  const [products, setproducts] = useState([]);

  const separator = () => {
    return (
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 1,
        }}
      />
    );
  };

  const ShowModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.rowContent}>
              <Text>Orden: {order.id}</Text>
              <Text>{order.date}</Text>
            </View>
            <Text style={styles.desc}>Total: {order.total}</Text>
            {order.items.map((item, index) => {

              const findedProduct = products.find((product) => {
                if (product._id === item._id) {
                  return product
                }
              })


              return (
                <View key={index}>
                  <Gap height={7} />
                  <View style={styles.rowContent}>
                    <Text style={styles.desc}>Producto: {`${findedProduct.name} - $ ${findedProduct.price}`}</Text>
                  </View>
                </View>
              );
            })}
            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  function handleShowModal(id, date, total, items) {
    setOrder({
      id: id,
      date: date,
      total: total,
      items: items,
    });
    setModalVisible(true);
  }

  const fetchOrders = async (token, id) => {
    const ordenes = await getOrdersByUserId(token, id);
    setOrders(ordenes);
    // console.log(orders);
  };

  const fetchProducts = async (token) => {
    const products = await getProducts(token);

    const filteredProducts = products.map((product) => {
      const newProduct = {
        _id: product._id,
        name: product.name,
        price: product.price,
      };
      return newProduct;
    });

    // console.log(filteredProducts);
    setproducts(filteredProducts);
  }

  const fetchUserID = (token) => {
    var { id } = jwt_decode(token);
    fetchOrders(token, id);
  };

  useEffect(() => {
    fetchUserID(token.token);
    fetchProducts(token.token);
  }, []);

  useEffect(() => {
    fetchUserID(token.token);
  }, [cart]);

  const Item = ({ id, date, total, items }) => (
    <TouchableOpacity onPress={() => handleShowModal(id, date, total, items)}>
      <View style={styles.rowContent}>
        <Text>Orden: {id}</Text>
        <Text>{date}</Text>
      </View>
      <Gap height={7} />
      <View style={styles.rowContent}>
        <Text style={styles.desc}>Productos: {items[0]._id}....</Text>
        <Text style={styles.desc}>Total: {total}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const fullDate = new Date(item.date).toLocaleDateString();

    return (
      <Item
        id={item.number}
        date={fullDate}
        total={item.total}
        items={item.items}
      />
    );
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.content}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.tittle}>Ordenes</Text>
        </View>
        <ShowModal />
        <View style={styles.wrapperContetntList}>
          {orders.length > 0 ? (
            <FlatList
              data={orders}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              ItemSeparatorComponent={separator}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text>Cargando</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  tittle: {
    color: colors.primary,
    fontSize: 20,
    marginBottom: 24
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 28,
    marginTop: 64,
  },
  wrapperContetntList: {
    // paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  desc: {
    fontSize: 12,
  },
  rowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: colors.primary,
  },
});

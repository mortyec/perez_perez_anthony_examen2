import React, { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import { Button, Gap } from "../../components/atoms";
import { AuthContext } from "../../components/context";
import { IL_Avatar } from "../../assets/images/Illustrations";
import { colors } from "../../assets";

import { getUserbyId } from '../../api'



const Profile = ({ token }) => {
  const isDarkMode = useColorScheme() === "dark";

  const { signOut } = useContext(AuthContext);

  function handleLogout() {
    signOut();
  }


  const [user, setUser] = useState({})

  useEffect(() => {
    fetchUser(token.token);
  }, [])

  const fetchUser = async (token) => {
    var { id } = jwt_decode(token)
    const user = await getUserbyId(token, id)
    setUser(user)
  }

  return (
    <SafeAreaView style={styles.flex1}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.header}></View>
      <Image style={styles.avatar} source={IL_Avatar} />
      <View style={styles.body}>
        <View style={styles.bodyContent}>

          {
            user ?

              <View>
                <Text style={styles.name}>{user.username}</Text>
                <Text style={styles.info}>{user.email}</Text>
              </View>

              :

              <Text style={styles.name}>Cargando</Text>

          }



          <Gap height={50} />
          <Button
            onPress={() => {
              handleLogout();
              // fetchUser();
            }}
            text="Cerrar Sesión"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  header: {
    backgroundColor: colors.primary,
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: colors.white,
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    // flex: 1,
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 28,
    // color: "#696969",
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    // color: "#00BFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    // color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
});

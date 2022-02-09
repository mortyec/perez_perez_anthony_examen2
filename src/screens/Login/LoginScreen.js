import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, TextInput } from "react-native";
import { Button, Gap } from "../../components/atoms";
import { colors } from "../../assets";
import { IL_GetStarted_PNG } from "../../assets/images/Illustrations";

import { AuthContext } from "../../components/context";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidUser, setIsValidUser] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [token, setToken] = useState(null);

  const { signIn } = useContext(AuthContext);

  const handleLogin = (email, password) => {
    signIn(email, password);
  };
  // const handleLogin = async () => {
  //   const _token = await AuthLogin({
  //     email,
  //     password,
  //   });

  //   console.log("token", _token);
  //   setToken(_token);

  //   // navigation.replace("MainApp", token)
  // };

  // useEffect(() => {
  //   if (token != "") {
  //     // navigation.replace("MainApp", token)
  //   }
  // }, [token]);

  return (
    <View style={styles.screen}>
      <Image source={IL_GetStarted_PNG} style={styles.image} />

      <View style={styles.wrapperSlogan}>
        <Text style={styles.txtSlogan}>La compra del dia </Text>
        <Text style={styles.txtSlogan}>en una APP</Text>
      </View>

      <Gap height={30} />

      <TextInput
        placeholder="Correo electronico"
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
      />
      {isValidUser ? null : (
        <Text style={styles.errMsg}>Correo electrónico invalido</Text>
      )}

      <TextInput
        placeholder="Constraseña"
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      {isValidPassword ? null : (
        <Text style={styles.errMsg}>Contraseña invalida</Text>
      )}
      {/* <Button onPress={() => handleLogin()} text="Acceder" /> */}
      <Button
        onPress={() => {
          handleLogin(email, password);
        }}
        text="Acceder"
      />
      <Gap height={20} />

      <Button
        onPress={() => navigation.replace("Signup")} // SignUp Component
        text="Crear cuenta"
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  image: { height: 225, width: "100%", resizeMode: "stretch" },
  wrapperSlogan: { marginTop: 51 },
  txtSlogan: {
    fontSize: 30,
    color: colors.primary,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 40,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  errMsg: {
    color: "red",
    paddingHorizontal: 20,
    marginHorizontal: 40,
  },
});

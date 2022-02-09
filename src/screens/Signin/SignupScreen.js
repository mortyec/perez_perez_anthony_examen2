import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { colors } from "../../assets";
import { Button, Gap } from "../../components/atoms";

import { AuthContext } from "../../components/context";

const SigninScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [creado, setCreado] = useState(false);

  const [isValidUser, setIsValidUser] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const { signUp } = useContext(AuthContext);

  const handleSignup = (username, email, password) => {
    const t = signUp(username, email, password);
    if (t != undefined) {
      setCreado(true);
      notifyMessage("Usuario creado correctamente");
      navigation.navigate("GetStarted");
    }
  };

  function notifyMessage(msg) {
    Alert.alert("Aviso", msg, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  }

  return (
    <View>
      <Gap height={200} />
      <View style={styles.wrapperSlogan}>
        <Text style={styles.txtSlogan}>Crear Nuevo Usuario </Text>
      </View>

      <Gap height={60} />

      <TextInput
        placeholder="Nombre de usuario"
        style={styles.input}
        onChangeText={(text) => setUserName(text)}
      />

      <TextInput
        placeholder="Correo electronico"
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        placeholder="Constraseña"
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      {isValidUser ? null : (
        <Text style={styles.errMsg}>Correo electrónico invalido</Text>
      )}

      <Gap height={60} />

      <Button
        onPress={() => {
          handleSignup(userName, email, password);
        }}
        text="Crear"
      />
    </View>
  );
};

export default SigninScreen;

// Styles

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
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

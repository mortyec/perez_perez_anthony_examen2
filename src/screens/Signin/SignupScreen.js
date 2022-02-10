import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { colors } from "../../assets";
import { Button, Gap } from "../../components/atoms";
import { Header } from "../../components/molecules";

import { AuthContext } from "../../components/context";

import { getUsers } from '../../api'

const SigninScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [creado, setCreado] = useState(false);

  const [isValidUser, setIsValidUser] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const { signUp } = useContext(AuthContext);

  const [correos, setCorreos] = useState([])

  
  
  useEffect(() => {
    adpp_cargarUsuarios();

  }, [])

  const adpp_cargarUsuarios = async () => {
    const rta = await getUsers()
    const correos = rta.map(user => user.email)
    setCorreos(correos)
  }

  //username = cedula
  const handleSignup = (username, email, password) => {
    const esCedulaValida = adpp_validarCedula(username);
    const esCorreoValido = adpp_validarMail(email);
    const esContrasenaValida = adpp_validarPassword(password);

    console.log('el email', esCorreoValido);
    console.log('la cedula', esCedulaValida);
    console.log('la contraseña', esContrasenaValida);

    if (esCorreoValido && esContrasenaValida && esCedulaValida) {
      const rta = signUp(username, email, password);
      rta.then(console.log);
      notifyMessage("Su usuario fue creado correctamente");
      navigation.navigate("GetStarted");
    } else {
      notifyMessage("Datos invalidos");
    }
  };

  //Validacion Correos
  const adpp_validarMail = (email) => {
    const hay = correos.some(mail => mail === email);
    return !hay;
  }

  function adpp_validarCedula(cedula) {
    if(cedula.length == 10){
        
      //Obtenemos el digito de la region que sonlos dos primeros digitos
      var digito_region = cedula.substring(0,2);
      
      //Pregunto si la region existe ecuador se divide en 24 regiones
      if( digito_region >= 1 && digito_region <=24 ){
        
        // Extraigo el ultimo digito
        var ultimo_digito   = cedula.substring(9,10);

        //Agrupo todos los pares y los sumo
        var pares = parseInt(cedula.substring(1,2)) + parseInt(cedula.substring(3,4)) + parseInt(cedula.substring(5,6)) + parseInt(cedula.substring(7,8));

        //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        var numero1 = cedula.substring(0,1);
        var numero1 = (numero1 * 2);
        if( numero1 > 9 ){ var numero1 = (numero1 - 9); }

        var numero3 = cedula.substring(2,3);
        var numero3 = (numero3 * 2);
        if( numero3 > 9 ){ var numero3 = (numero3 - 9); }

        var numero5 = cedula.substring(4,5);
        var numero5 = (numero5 * 2);
        if( numero5 > 9 ){ var numero5 = (numero5 - 9); }

        var numero7 = cedula.substring(6,7);
        var numero7 = (numero7 * 2);
        if( numero7 > 9 ){ var numero7 = (numero7 - 9); }

        var numero9 = cedula.substring(8,9);
        var numero9 = (numero9 * 2);
        if( numero9 > 9 ){ var numero9 = (numero9 - 9); }

        var impares = numero1 + numero3 + numero5 + numero7 + numero9;

        //Suma total
        var suma_total = (pares + impares);

        //extraemos el primero digito
        var primer_digito_suma = String(suma_total).substring(0,1);

        //Obtenemos la decena inmediata
        var decena = (parseInt(primer_digito_suma) + 1)  * 10;

        //Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        var digito_validador = decena - suma_total;

        //Si el digito validador es = a 10 toma el valor de 0
        if(digito_validador == 10)
          var digito_validador = 0;

        //Validamos que el digito validador sea igual al de la cedula
        if(digito_validador == ultimo_digito){
          console.log('la cedula:' + cedula + ' es correcta');
          return true;
        }else{
          console.log('la cedula:' + cedula + ' es incorrecta');
          return false;
        }
        
      }else{
        // imprimimos en consola si la region no pertenece
        console.log('Esta cedula no pertenece a ninguna region');
        return false;
      }
   }else{
      //imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      console.log('Esta cedula tiene menos de 10 Digitos');
      return false;
   }    
  }

  function adpp_validarPassword(valor){
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!.%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){6,10}$/; 
   if(regex.test(valor)){
      console.log(valor+" es valido :-) !");
       return true;        
   }else{
      console.log(valor+" NO es valido!");
      return false;        
   }   
 }
  

  function notifyMessage(msg) {
    Alert.alert("Aviso", msg, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  }

  return (
    <View>
      <Gap height={50} />
      <Header onPressBack={() => navigation.navigate("GetStarted")} />
      <View style={styles.wrapperSlogan}>
        <Text style={styles.txtSlogan}>Crear Nuevo Usuario </Text>
      </View>

      <Gap height={60} />

      <TextInput
        placeholder="Cedula"
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

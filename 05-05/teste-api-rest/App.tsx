import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View, FlatList, ListRenderItemInfo } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

interface Contato {
  nome: string;
  telefone: string;
  email: string
}

const ContatoItem = (props: ListRenderItemInfo<Contato>) => {
  return(
    <View style={{backgroundColor:'lightyellow', margin: 10, padding:10, borderColor: "red", borderRadius: 16}}>
      <Text>{props.item.nome}</Text>
      <Text>{props.item.email}</Text>
      <Text>{props.item.telefone}</Text>
    </View>
  )
}

export default function App() {

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")

  const [lista, setLista] = useState<Contato[]>([])

  return (
    <View style={styles.container}>
      <Text>Teste de API REST</Text>
      <TextInput 
        value={nome} 
        onChangeText={setNome}
        placeholder='Nome'
      />
      <TextInput 
        value={telefone} 
        onChangeText={setTelefone}
        placeholder='Telefone'
      />
      <TextInput 
        value={email} 
        onChangeText={setEmail}
        placeholder='Email'
      />
      <StatusBar style="auto" />
      <Button title='Gravar' onPress={() => {
        axios.post(
          "https://teste-api-rest-c9277-default-rtdb.firebaseio.com/contatos.json",
          {
            nome,
            telefone,
            email
          }
        )
        .then(() => {
          ToastAndroid.show("Contato gravado com sucesso", ToastAndroid.LONG);
        })
        .catch((error) => {
          ToastAndroid.show("Erro ao gravar  " + error, ToastAndroid.LONG)
        })
      }}/>
      <Button title='Ler Contatos' onPress={() => {
        axios.get(
          "https://teste-api-rest-c9277-default-rtdb.firebaseio.com/contatos.json"
        )
        .then((info: AxiosResponse<any, any>) => {
          const tempList: Contato[] = [];
          for (const chave in info.data) {
            const contato = info.data[chave];
            tempList.push(contato)
          }
          ToastAndroid.show("Foram lidos " + tempList.length + " contatos", ToastAndroid.LONG)
          setLista(tempList)
        })
        .catch((error) => {
          ToastAndroid.show("Erro ao ler contatos  " + error, ToastAndroid.LONG)
        })
      }}/>
      <FlatList data={lista} renderItem={ContatoItem}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

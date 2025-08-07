import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, ListRenderItemInfo, Pressable, Text, TextInput, ToastAndroid, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Entypo , Feather, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParamListBase } from "@react-navigation/native";

// Interfaces
export interface Jogador { 
    id : number;
    nome : string;
    numeroCamisa: number;
    posicao: string;
    time: string;
}

export interface FormularioProps extends ParamListBase {
    onGravar: (nome: string, time: string, posicao: string, numeroCamisa: number) => void;
    onCarregar: () => void;
}

export interface ListagemProps extends ParamListBase {
    lista: Jogador[];
    onCarregar: () => void;
}

export interface ModuloProps {
    lista: Jogador[];
    inserir: (nome: string, time: string, posicao: string, numeroCamisa: number) => void;
    carregar: () => void;
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
    paddingTop: 50,
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subTitulo: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  pressableBotao: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  pressableTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressableBotaoCarregar: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  jogador_item: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jogador_nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  jogador_info: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});

const { Screen, Navigator } = createDrawerNavigator()
const Tab = createBottomTabNavigator();

function JogadorFormulario(props: FormularioProps): React.ReactElement {
  const [nome, setNome] = useState<string>("");
  const [posicao, setPosicao] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [numeroCamisa, setNumeroCamisa] = useState<string>("");

  const carregarUltimoJogador = async () => {
    try {
      const strJogador = await AsyncStorage.getItem("ULTIMO_JOGADOR");
      if (strJogador != null) {
        const jogador = JSON.parse(strJogador);
        setNome(jogador.nome);
        setPosicao(jogador.posicao);
        setTime(jogador.time);
        setNumeroCamisa(jogador.numeroCamisa.toString());
        ToastAndroid.show("Último jogador carregado com sucesso", ToastAndroid.LONG);
      }
    } catch (erro) {
      ToastAndroid.show("Erro ao carregar o último jogador", ToastAndroid.LONG);
    }
  };

  return (
    <View>
      <Text style={styles.subTitulo}>Formulário de Jogador</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Posição" value={posicao} onChangeText={setPosicao} />
      <TextInput style={styles.input} placeholder="Time" value={time} onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Número na camisa" value={numeroCamisa} onChangeText={setNumeroCamisa} keyboardType="numeric" />
      <Pressable
        style={styles.pressableBotao}
        onPress={() => {
          props.onGravar(nome, posicao, time, Number(numeroCamisa));
          setNome("");
          setPosicao("");
          setTime("");
          setNumeroCamisa("");
        }}
      >
        <Text style={styles.pressableTexto}>Gravar</Text>
      </Pressable>
      <Pressable
        style={styles.pressableBotaoCarregar}
        onPress={carregarUltimoJogador}
      >
        <Text style={styles.pressableTexto}>Carregar Último Jogador</Text>
      </Pressable>
    </View>
  );
}

function JogadorItem(props: ListRenderItemInfo<Jogador>): React.ReactElement {
  return (
    <View style={styles.jogador_item}>
      <Text style={styles.jogador_nome}>{props.item.nome}</Text>
      <Text style={styles.jogador_info}>Time: {props.item.time}</Text>
      <Text style={styles.jogador_info}>Posição: {props.item.posicao}</Text>
    </View>
  );
}

function JogadorListagem(props: ListagemProps): React.ReactElement {
  return (
    <View>
      <Text style={styles.subTitulo}>Jogadores Listagem</Text>
      <Pressable
        style={styles.pressableBotaoCarregar}
        onPress={props.onCarregar}
      >
        <Text style={styles.pressableTexto}>Carregar Lista</Text>
      </Pressable>
      <FlatList data={props.lista} renderItem={JogadorItem} />
    </View>
  )
}

function JogadorModulo(props: ModuloProps): React.ReactElement {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{
        headerShown: false
      }}>
        <Tab.Screen name="jogador-formulario"
          options={{
            title: "Formulário",
            tabBarIcon: ({ color, size, focused }) =>
              <FontAwesome5 name="clipboard" color={color} size={size} />,
          }}>
          {(navProps: any) => <JogadorFormulario {...navProps} onGravar={props.inserir} />}
        </Tab.Screen>
        <Tab.Screen name="jogador-listagem"
          options={{
            title: "Listagem",
            tabBarIcon: ({ color, size }) =>
              <Feather name="list" color={color} size={size} />
          }}>
          {(navProps: any) =>
            <JogadorListagem  {...navProps} lista={props.lista} onCarregar={props.carregar} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  )
}

export default function App() {
  const [lista, setLista] = useState<Jogador[]>([]);

  const carregar = () => {
    AsyncStorage.getItem("LISTA_JOGADORES")
      .then((strLista: string | null) => {
        if (strLista != null) {
          const listaAtual = JSON.parse(strLista);
          setLista(listaAtual);
          ToastAndroid.show(`Foram carregados ${listaAtual.length} jogadores`, ToastAndroid.LONG);
        }
      })
      .catch((erro) => {
        ToastAndroid.show("Erro ao carregar a lista", ToastAndroid.LONG);
      })
  }

  const inserir = (nome: string, posicao: string, time: string, numeroCamisa: number) => {
    const jogador = { id: Date.now(), nome, posicao, time, numeroCamisa };
    
    // Salva o último jogador individualmente
    AsyncStorage.setItem("ULTIMO_JOGADOR", JSON.stringify(jogador))
      .then(() => {
        ToastAndroid.show("Jogador gravado com sucesso", ToastAndroid.LONG);
      })
      .catch(() => {
        ToastAndroid.show("Erro ao gravar o jogador", ToastAndroid.LONG);
      });

    // Atualiza a lista
    setLista((listaAntiga: Jogador[]) => {
      const listaNova = [...listaAntiga, jogador];
      AsyncStorage.setItem("LISTA_JOGADORES", JSON.stringify(listaNova));
      return listaNova;
    });
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Text style={styles.tituloPrincipal}>Cadastro de Jogadores</Text>
        <Navigator>
          <Screen name="jogadores"
            options={{
              title: "Jogadores",
              drawerIcon: ({ size, color }) =>
                <Entypo name="users" size={size} color={color} />
            }}>
            {() => (
              <JogadorModulo
                lista={lista}
                carregar={carregar}
                inserir={inserir}
              />
            )}
          </Screen>
        </Navigator>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}
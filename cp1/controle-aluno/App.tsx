import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ListRenderItemInfo, FlatList } from 'react-native';

const {Screen, Navigator} = createStackNavigator();

interface AlunoType {
  ra: string;
  nome: string;
  nascimento: string;
}

interface FormularioProps extends ParamListBase {
  onGravar: (ra: string, nome: string, nascimento: string) => void
}

interface ListagemProps extends ParamListBase {
  alunos: AlunoType[]
}

function Formulario(props: FormularioProps): React.ReactElement {
  const [ra, setRa] = useState<string>("")
  const [nome, setNome] = useState<string>("")
  const [nascimento, setNascimento] = useState<string>("")

  return (
    <View style={styles.formulario}>
      <View style={styles.campoTexto}>
        <Text style={styles.label}>RA: </Text>
        <TextInput style={styles.input} value={ra} onChangeText={setRa} />
      </View>
      <View style={styles.campoTexto}>
        <Text style={styles.label}>Nome: </Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      </View>
      <View style={styles.campoTexto}>
        <Text style={styles.label}>Nacimento: </Text>
        <TextInput style={styles.input} value={nascimento} onChangeText={setNascimento} />
      </View>
      <Pressable style={styles.botao} onPress={() => {
        props.onGravar(ra, nome, nascimento)
        setRa("")
        setNome("")
        setNascimento("")
      }}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </Pressable>

      <Pressable style={styles.botao} onPress={() => {
        props.navigation.navigate("listagem");
      }}>
        <Text style={styles.botaoTexto}>Ir para o Listagem</Text>
      </Pressable>
    </View>
  );
}

function Aluno(props: ListRenderItemInfo<AlunoType>): React.ReactElement {
  return (
    <View style={styles.aluno}>
      <Text style={styles.cardTitulo}>{props.item.ra}</Text>
      <Text style={styles.cardTexto}>{props.item.nome}</Text>
      <Text style={styles.cardTexto}>{props.item.nascimento}</Text>
    </View>
  )
}

function Listagem(props: ListagemProps): React.ReactElement {
  return (
    <View style={styles.listagem}>
      <FlatList 
        data={props.alunos} 
        renderItem={Aluno}
        keyExtractor={(item: AlunoType) => "aluno_key_" + item.ra}
        style={styles.lista}
      />
      <Pressable style={styles.botao} onPress={() => {
        props.navigation.navigate("formulario");
      }}>
        <Text style={styles.botaoTexto}>Ir para o Formulário</Text>
      </Pressable>
    </View>
  )
}

export default function App() {
  const [alunos, setAlunos] = useState<AlunoType[]>([
    {
      ra: '556128',
      nome: 'Guilherme Akira',
      nascimento: '08-10-2005'
    }
  ])

  const onGravar = (ra: string, nome: string, nascimento: string) => {
    const aluno = { ra, nome, nascimento };
    const novaListaAlunos = [...alunos, aluno];
    setAlunos(novaListaAlunos);
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Controle de Alunos</Text>
        </View>
        <View style={styles.main}>
          <Navigator 
            initialRouteName="formulario"
            screenOptions={{
              headerStyle: {
                backgroundColor: 'lightblue',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Screen
              name="formulario"
              options={{ title: "Formulário" }}
            >
              {props => <Formulario {...props} onGravar={onGravar} />}
            </Screen>
            <Screen
              name="listagem"
              options={{ title: "Listagem de Alunos" }}
            >
              {props => <Listagem {...props} alunos={alunos} />}
            </Screen>
          </Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  cabecalho: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titulo: {
    color: '#fff',
    textAlign: 'center',
    width: '60%',
    fontSize: 30,
    fontWeight: 'bold'
  },
  main: {
    flex: 8,
    backgroundColor: 'lightblue',
  },
  formulario: {
    backgroundColor: 'lightblue',
    flex: 1,
    gap: 20,
    padding: 20
  },
  listagem: {
    backgroundColor: 'lightblue',
    flex: 1,
    padding: 20
  },
  lista: {
    marginBottom: 20
  },
  campoTexto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20
  },
  input: {
    width: '50%',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5
  },
  botao: {
    backgroundColor: 'blue',
    borderRadius: 30,
    padding: 10,
    marginVertical: 10
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center'
  },
  aluno: {
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5
  },
  cardTitulo: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  cardTexto: {
    fontSize: 18,
  }
});
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';

interface Contato {
  email: string;
  telefone: string;
}

function useTheme(temaPadrao: string) {
  const [tema, setTema] = useState(temaPadrao);

  const foregroundColor = tema === 'light' ? 'black' : 'white';
  const backgroundColor = tema === 'light' ? 'white' : 'black';

  return {tema, setTema, foregroundColor, backgroundColor}
}

function useMeuHook() {
  const [valor, setValor] = useState(0);
  const [nome, setNome] = useState('');

  const incrementar = () => {
    setValor ((valorAntigo: number) => valorAntigo + 1);

    return () => {
      console.log('Componente Destruído');
    }
  }

  useEffect(incrementar, [nome]);

  return {valor, incrementar, nome, setNome}
}

function useFormulario() {
  const [campos, setCampos] = useState<Contato>({email: '', telefone: ''});

  const [lista, setLista] = useState<Contato[]>([]);

  const atualizarCampo = (campo: string, valor: string) => {

    const obj = {...campos};
    obj[campo as keyof Contato] = valor;
    setCampos(obj);
  }

  const adicionar = () => {
    setLista([...lista, campos]);
  }

  return {campos, lista, adicionar, setCampos, atualizarCampo}
}

export default function App() {

  const {valor, incrementar, nome, setNome} = useMeuHook();

  const {campos, lista, adicionar, setCampos, atualizarCampo} = useFormulario();

  const colorScheme = useColorScheme();

  const {tema, setTema,foregroundColor, backgroundColor} = useTheme(colorScheme || 'light');

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Text style={{color: foregroundColor}}>Componente atualizado</Text>
      <Text style={{color: foregroundColor}}>{valor}</Text>
      <TextInput style={{color: foregroundColor}}
        placeholder='Digite seu nome'
        value={nome}
        onChangeText={setNome}
      />
      <TextInput style={{color: foregroundColor}}
        placeholder='Digite seu email'
        value={campos.email}
        onChangeText={(texto) => atualizarCampo('email', texto)}
      />
      <TextInput style={{color: foregroundColor}}
        placeholder='Digite seu telefone'
        value={campos.telefone}
        onChangeText={(texto) => atualizarCampo('telefone', texto)}
      />
      <Button title='Adicionar' onPress={adicionar} />
      <Button title='Mudar Tema' onPress={() => setTema(tema === 'light' ? 'dark' : 'light')} />
      <FlatList
        data={lista}
        renderItem={({item}: {item: Contato}) => (
          <Text>{item.email} - {item.telefone}</Text>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { useState } from 'react';
import { FlatList, Image, ImageBackground, ImageSourcePropType, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface RefeicaoType {
  id: number;
  nome: string;
  tipo: string;
  calorias: string;
  nomeImagem: string;
  ingredientes: string;
}

interface FormularioProps {
  gravar: (nome: string, tipo: string, calorias: string, nomeImagem: string, ingredientes: string) => void;
}

interface ListagemProps {
  refeicoes: RefeicaoType[];
}

interface Imagens {
  [key: string]: ImageSourcePropType;
}

const imagens: Imagens = {
  "Torta Holandesa": require("./assets/images/img2.png"),
  "Legumos no Vapor": require("./assets/images/img3.png"),
  "Frapuccino": require("./assets/images/img4.png"),
};

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Bristô-Donte</Text>
      <ImageBackground
        source={require('./assets/images/img1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.imageTitle}>Alimentação Saudável</Text>
      </ImageBackground>
    </View>
  )
}

function Formulario(props: FormularioProps) {
  const [nome, setNome] = useState<string>("")
  const [tipo, setTipo] = useState<string>("")
  const [calorias, setCalorias] = useState<string>("")
  const [nomeImagem, setNomeImagem] = useState<string>("")
  const [ingredientes, setIngredientes] = useState<string>("")

  return (
    <View style={styles.formulario}>
      <Text style={styles.formularioTitle}>Dados do prato</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Refeição"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Tipo (refeição, bebida, sobremesa)"
        value={tipo}
        onChangeText={setTipo}
      />

      <View style={styles.linha}>
        <TextInput
          style={[styles.input, styles.metade]}
          placeholder="Calorias"
          value={calorias}
          onChangeText={setCalorias}
        />
        <TextInput
          style={[styles.input, styles.metade]}
          placeholder="Nome da Imagem"
          value={nomeImagem}
          onChangeText={setNomeImagem}
        />
      </View>
      <TextInput
        style={[styles.input, styles.grande]}
        placeholder="Ingredientes"
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />

      <Pressable style={styles.botao} onPress={() => {
        props.gravar(nome, tipo, calorias, nomeImagem, ingredientes)
      }}>
        <Text style={styles.textoBotao}>Gravar</Text>
      </Pressable>
    </View>
  )

}

function Listagem(props: ListagemProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<RefeicaoType | null>(null);

  const abrirModal = (item: RefeicaoType) => {
    setItemSelecionado(item);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setItemSelecionado(null);
  };

  return (
    <View>
      <FlatList
        data={props.refeicoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => abrirModal(item)}>
            <View style={styles.cardRefeicao}>
              <View style={styles.cardRefeicaoImageContainer}>
                <Image
                  source={imagens[item.nomeImagem]}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitulo}>{item.nome}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      {itemSelecionado && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={fecharModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitulo}>Detalhes do Prato</Text>
              <Image
                source={imagens[itemSelecionado.nomeImagem]}
                style={styles.modalImage}
                resizeMode="cover"
              />
              <Text style={styles.modalTexto}>Nome da Refeição: {itemSelecionado.nome}</Text>
              <Text style={styles.modalTexto}>Tipo da Refeição: {itemSelecionado.tipo}</Text>
              <Text style={styles.modalTexto}>Calorias: {itemSelecionado.calorias}</Text>
              <Text style={styles.modalTexto}>Ingredientes: {itemSelecionado.ingredientes}</Text>
              <Pressable style={styles.modalBotaoFechar} onPress={fecharModal}>
                <Text style={styles.modalFecharBotaoTexto}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default function App() {
  const [refeicoes, setRefeicoes] = useState<RefeicaoType[]>([]);

  const gravar = (nome: string, tipo: string, calorias: string, nomeImagem: string, ingredientes: string) => {
    const obj = { id: refeicoes.length + 1, nome, tipo, calorias, nomeImagem, ingredientes };
    const novaLista = [...refeicoes, obj];
    setRefeicoes(novaLista);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.main}>
        <Formulario gravar={gravar} />
        <Listagem refeicoes={refeicoes} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    backgroundColor: '#efe4e1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: 10,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    color: '#000',
    width: '50%',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  main: {
    flex: 2,
    backgroundColor: '#fff',
  },
  formulario: {
    backgroundColor: '#efe4e1',
  },
  formularioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metade: {
    width: '48%',
  },
  grande: {
    height: 60,
    textAlignVertical: 'top',
  },
  botao: {
    alignSelf: 'center',
    width: '60%',
    backgroundColor: '#C4C4C4',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    fontWeight: 'bold',
  },
  cardRefeicao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9f0e1',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 10,
  },
  cardRefeicaoImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalTexto: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalBotaoFechar: {
    marginTop: 10,
    backgroundColor: '#C4C4C4',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalFecharBotaoTexto: {
    fontWeight: 'bold',
  },
});

import { FC, ReactElement } from 'react';
import {View, Text, TextInput, Button, Modal, ActivityIndicator, StyleSheet, ScrollView, Alert} from 'react-native';
import { useProdutoControl } from '../control/produtoControl';

interface ProdutoViewProps {
}

const ProdutoView: FC<ProdutoViewProps> = (props) => {
    const {
        produtos, 
        produto, 
        loading, 
        erro, 
        modoEdicao,
        salvar, 
        atualizar, 
        remover, 
        buscarTodos,
        handleProduto, 
        limparFormulario, 
        editarProduto, 
        cancelarEdicao 
    } = useProdutoControl();
    
    const confirmarRemocao = (id: number, nome: string) => {
        Alert.alert(
            "Confirmar Remoção",
            `Deseja realmente remover o produto "${nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Remover", style: "destructive", onPress: () => remover(id) }
            ]
        );
    };

    const handleSubmit = () => {
        if (modoEdicao) {
            atualizar();
        } else {
            salvar();
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Controle de Produtos</Text>
            
            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>
                    {modoEdicao ? 'Editar Produto' : 'Novo Produto'}
                </Text>
                
                <Text style={styles.label}>Nome: </Text>
                <TextInput 
                    style={styles.input}
                    value={produto.nome} 
                    onChangeText={(txt: string) => handleProduto(txt, "nome")}
                    placeholder="Digite o nome do produto"
                />
                
                <Text style={styles.label}>Preço: </Text>
                <TextInput 
                    style={styles.input}
                    value={produto.preco.toString()} 
                    onChangeText={(txt: string) => handleProduto(txt, "preco")}
                    placeholder="Digite o preço"
                    keyboardType="numeric"
                />
                
                <Text style={styles.label}>Setor: </Text>
                <TextInput 
                    style={styles.input}
                    value={produto.setor} 
                    onChangeText={(txt: string) => handleProduto(txt, "setor")}
                    placeholder="Digite o setor"
                />
                
                <View style={styles.buttonContainer}>
                    {modoEdicao ? (
                        <>
                            <Button title="Atualizar" onPress={handleSubmit} color="#FF9800"/>
                            <View style={styles.buttonSpacer} />
                            <Button title="Cancelar" onPress={cancelarEdicao} color="#9E9E9E"/>
                        </>
                    ) : (
                        <>
                            <Button title="Salvar" onPress={handleSubmit} color="#4CAF50"/>
                            <View style={styles.buttonSpacer} />
                            <Button title="Limpar" onPress={limparFormulario} color="#9E9E9E"/>
                        </>
                    )}
                </View>
            </View>

            <View style={styles.listContainer}>
                <View style={styles.listHeader}>
                    <Text style={styles.sectionTitle}>Produtos Cadastrados</Text>
                    <Button title="🔄" onPress={buscarTodos} color="#2196F3"/>
                </View>
                
                <ScrollView style={styles.scrollView}>
                    {produtos.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
                    ) : (
                        produtos.map((p) => (
                            <View key={p.id} style={styles.produtoItem}>
                                <View style={styles.produtoInfo}>
                                    <Text style={styles.produtoNome}>{p.nome}</Text>
                                    <Text style={styles.produtoDetalhes}>
                                        Preço: R$ {p.preco.toFixed(2)} | Setor: {p.setor}
                                    </Text>
                                </View>
                                <View style={styles.produtoAcoes}>
                                    <Button 
                                        title="✏️" 
                                        onPress={() => editarProduto(p)} 
                                        color="#FF9800"
                                    />
                                    <View style={styles.buttonSpacer} />
                                    <Button 
                                        title="🗑️" 
                                        onPress={() => confirmarRemocao(p.id, p.nome)} 
                                        color="#F44336"
                                    />
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
            
            {erro && (
                <Text style={[
                    styles.errorText, 
                    { color: erro.includes('Erro') ? 'red' : 'green' }
                ]}>
                    {erro}
                </Text>
            )}
            
            <Modal visible={loading} transparent={false}>
                <View style={styles.modalContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style={styles.loadingText}>Processando...</Text>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333'
    },
    formContainer: {
        padding: 20,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        elevation: 2
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: 'white'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    buttonSpacer: {
        width: 10
    },
    listContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        elevation: 2
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    scrollView: {
        flex: 1
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        marginTop: 20
    },
    produtoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fafafa'
    },
    produtoInfo: {
        flex: 1
    },
    produtoNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    produtoDetalhes: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    produtoAcoes: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    errorText: {
        margin: 15,
        textAlign: 'center',
        fontSize: 14,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f8f8f8'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333'
    }
});

export { ProdutoView };
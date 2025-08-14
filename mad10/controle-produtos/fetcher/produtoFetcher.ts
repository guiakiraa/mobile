import Produto from "../model/Produto";
import axios from 'axios';

const apiBase = axios.create({
    baseURL: "https://tdsph-ad96c-default-rtdb.firebaseio.com"
});

interface SalvarCallback {
    (sucesso: boolean, mensagem: string): void;
}

interface BuscarTodosCallback {
    (sucesso: boolean, produtos: Produto[], mensagem: string): void;
}

interface BuscarPorIdCallback {
    (sucesso: boolean, produto: Produto | null, mensagem: string): void;
}

interface AtualizarCallback {
    (sucesso: boolean, mensagem: string): void;
}

interface RemoverCallback {
    (sucesso: boolean, mensagem: string): void;
}

const produtoFetcherSalvar = (produto: Produto, callback: SalvarCallback): void => {
    apiBase.post("/produtos.json", produto)
        .then(() => callback(true, ""))
        .catch((erro: any) => callback(false, erro))
}

const produtoFetcherBuscarTodos = (callback: BuscarTodosCallback): void => {
    apiBase.get("/produtos.json")
        .then((response) => {
            const produtos = response.data;
            if (!produtos) {
                callback(true, [], "");
                return;
            }
            
            const produtosArray: Produto[] = Object.keys(produtos).map(key => ({
                id: parseInt(key),
                ...produtos[key]
            }));
            callback(true, produtosArray, "");
        })
        .catch((erro: any) => callback(false, [], erro))
}

const produtoFetcherBuscarPorId = (id: string, callback: BuscarPorIdCallback): void => {
    apiBase.get(`/produtos/${id}.json`)
        .then((response) => {
            if (response.data) {
                const produto = { id: parseInt(id), ...response.data };
                callback(true, produto, "");
            } else {
                callback(true, null, "");
            }
        })
        .catch((erro: any) => callback(false, null, erro))
}

const produtoFetcherAtualizar = (id: string, produto: Produto, callback: AtualizarCallback): void => {
    apiBase.put(`/produtos/${id}.json`, produto)
        .then(() => callback(true, ""))
        .catch((erro: any) => callback(false, erro))
}

const produtoFetcherRemover = (id: string, callback: RemoverCallback): void => {
    apiBase.delete(`/produtos/${id}.json`)
        .then(() => callback(true, ""))
        .catch((erro: any) => callback(false, erro))
}

export { 
    produtoFetcherSalvar, 
    produtoFetcherBuscarTodos, 
    produtoFetcherBuscarPorId,
    produtoFetcherAtualizar,
    produtoFetcherRemover,
    SalvarCallback,
    BuscarTodosCallback,
    BuscarPorIdCallback,
    AtualizarCallback,
    RemoverCallback
} 
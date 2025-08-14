import Produto from "../model/Produto";
import { 
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
} from "../fetcher/produtoFetcher";

const produtoServicoSalvar = (produto: Produto, callback: SalvarCallback): void => {
    produtoFetcherSalvar(produto, callback);
}

const produtoServicoBuscarTodos = (callback: BuscarTodosCallback): void => {
    produtoFetcherBuscarTodos(callback);
}

const produtoServicoBuscarPorId = (id: string, callback: BuscarPorIdCallback): void => {
    produtoFetcherBuscarPorId(id, callback);
}

const produtoServicoAtualizar = (id: string, produto: Produto, callback: AtualizarCallback): void => {
    produtoFetcherAtualizar(id, produto, callback);
}

const produtoServicoRemover = (id: string, callback: RemoverCallback): void => {
    produtoFetcherRemover(id, callback);
}

export { 
    produtoServicoSalvar, 
    produtoServicoBuscarTodos, 
    produtoServicoBuscarPorId,
    produtoServicoAtualizar,
    produtoServicoRemover
}
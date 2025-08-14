import { useState, useEffect } from "react";
import Produto from "../model/Produto";
import { 
    produtoServicoSalvar, 
    produtoServicoBuscarTodos, 
    produtoServicoBuscarPorId,
    produtoServicoAtualizar,
    produtoServicoRemover
} from "../service/produtoService";
import { 
    SalvarCallback,
    BuscarTodosCallback,
    BuscarPorIdCallback,
    AtualizarCallback,
    RemoverCallback
} from "../fetcher/produtoFetcher";

interface ProdutoControlHook { 
    produtos: Produto[]
    produto: Produto
    loading: boolean
    erro: string | null
    modoEdicao: boolean
    
    salvar: () => void
    atualizar: () => void
    remover: (id: number) => void
    buscarTodos: () => void
    buscarPorId: (id: number) => void
    
    setProduto: (produto: Produto) => void
    handleProduto: (txt: string, campo: string) => void
    limparFormulario: () => void
    editarProduto: (produto: Produto) => void
    cancelarEdicao: () => void
}

const useProdutoControl = (): ProdutoControlHook => { 
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produto, setProduto] = useState<Produto>({
        id: 0,
        nome: '',
        preco: 0,
        setor: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [modoEdicao, setModoEdicao] = useState<boolean>(false);

    useEffect(() => {
        buscarTodos();
    }, []);

    const buscarTodosCallback: BuscarTodosCallback = (sucesso: boolean, produtosData: Produto[], mensagem: string) => {
        if (sucesso) {
            setProdutos(produtosData);
            setErro(null);
        } else {
            setErro("Erro ao buscar produtos: " + mensagem);
        }
        setLoading(false);
    }

    const buscarPorIdCallback: BuscarPorIdCallback = (sucesso: boolean, produtoData: Produto | null, mensagem: string) => {
        if (sucesso && produtoData) {
            setProduto(produtoData);
            setErro(null);
        } else {
            setErro("Produto não encontrado");
        }
        setLoading(false);
    }

    const salvarCallback: SalvarCallback = (sucesso: boolean, mensagem: string) => {
        if (sucesso) {
            buscarTodos();
            limparFormulario();
            setErro(null);
        } else {
            setErro("Erro ao salvar produto: " + mensagem);
        }
        setLoading(false);
    }

    const atualizarCallback: AtualizarCallback = (sucesso: boolean, mensagem: string) => {
        if (sucesso) {
            buscarTodos();
            limparFormulario();
            setModoEdicao(false);
            setErro(null);
        } else {
            setErro("Erro ao atualizar produto: " + mensagem);
        }
        setLoading(false);
    }

    const removerCallback: RemoverCallback = (sucesso: boolean, mensagem: string) => {
        if (sucesso) {
            buscarTodos();
            setErro(null);
        } else {
            setErro("Erro ao remover produto: " + mensagem);
        }
        setLoading(false);
    }

    const buscarTodos = (): void => {
        setLoading(true);
        produtoServicoBuscarTodos(buscarTodosCallback);
    }

    const buscarPorId = (id: number): void => {
        setLoading(true);
        produtoServicoBuscarPorId(id.toString(), buscarPorIdCallback);
    }

    const salvar = (): void => {
        if (!produto.nome || !produto.setor || produto.preco <= 0) {
            setErro("Preencha todos os campos corretamente");
            return;
        }

        setLoading(true);
        produtoServicoSalvar(produto, salvarCallback);
    }

    const atualizar = (): void => {
        if (!produto.id || !produto.nome || !produto.setor || produto.preco <= 0) {
            setErro("Preencha todos os campos corretamente");
            return;
        }

        setLoading(true);
        produtoServicoAtualizar(produto.id.toString(), produto, atualizarCallback);
    }

    const remover = (id: number): void => {
        setLoading(true);
        produtoServicoRemover(id.toString(), removerCallback);
    }

    const editarProduto = (produtoParaEditar: Produto): void => {
        setProduto(produtoParaEditar);
        setModoEdicao(true);
        setErro(null);
    }

    const cancelarEdicao = (): void => {
        limparFormulario();
        setModoEdicao(false);
        setErro(null);
    }

    const limparFormulario = (): void => {
        setProduto({
            id: 0,
            nome: '',
            preco: 0,
            setor: ''
        });
    }

    const handleProduto = (txt: string, campo: string) => { 
        const obj = {...produto};
        if (campo === 'nome' || campo === 'setor') {
            obj[campo] = txt;
        } else if (campo === 'preco') {
            obj[campo] = parseFloat(txt) || 0;
        }
        setProduto(obj);
    }

    return { 
        produtos, 
        produto, 
        loading, 
        erro, 
        modoEdicao,
        salvar, 
        atualizar, 
        remover, 
        buscarTodos, 
        buscarPorId,
        setProduto, 
        handleProduto, 
        limparFormulario, 
        editarProduto, 
        cancelarEdicao 
    };
}

export { useProdutoControl };
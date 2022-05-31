import axios from 'axios';

const CadastroApi = {
    cadastrar: data => {
        return axios.post(`https://app.professordaniloalves.com.br/api/v1/cadastro`, data)
    },

    atualizar: data => {
        return axios.put(`https://app.professordaniloalves.com.br/api/v1/cadastro`, data)
    },

    getCadastro: cpf => {
        return axios.get(`https://app.professordaniloalves.com.br/api/v1/cadastro/` + cpf)
    },

    deleteCadastro: cpf => {
        return axios.delete(`https://app.professordaniloalves.com.br/api/v1/cadastro/` + cpf)
    }
}

export default CadastroApi;
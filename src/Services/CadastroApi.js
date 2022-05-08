import axios from 'axios';

const CadastroApi = {
    cadastrar: data => {
        return axios.post(`https://app.professordaniloalves.com.br/api/v1/cadastro`, data)
    }
}

export default CadastroApi;
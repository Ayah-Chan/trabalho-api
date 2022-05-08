import { Component, Fragment, React, createRef } from "react";
import EnderecoApi from "../Services/EnderecoApi"; 
import CadastroApi from "../Services/CadastroApi";
import ModalAlert from "../Components/ModalAlert";

class Cadastro extends Component {

    constructor(props) {
        super(props);
        this.modalRef = createRef();
        this.state = {
            listaEstados: [],
                
            formCadastro: {
                aceito: false,
                nomeCompleto: "",
                dataNascimento: "",
                sexo: "",
                cpf: "",
                cep: "",
                logradouro: "",
                numeroLogradouro: "",
                email: "",
                uf: "",
                cidade: "",
                expectativa: "",
            },

            erros: {
                aceito: [],
                nomeCompleto: [],
                dataNascimento: [],
                sexo: [],
                cpf: [],
                cep: [],
                logradouro: [],
                numeroLogradouro: [],
                email: [],
                uf: [],
                cidade: [],
                expectativa: [],
            }
        }
    }

    buscaCep = event => {
        this.escutadorDeInputFormCadastro(event);

        const { value } = event.target;

        if (value.length > 7) {
            EnderecoApi.getEndereco(value).then( resp => {
                this.setState({
                    formCadastro: {...this.state.formCadastro,...{
                        logradouro: resp.data.logradouro,
                        uf: resp.data.uf,
                        cidade: resp.data.localidade
                    }}
                });

            }).catch( (e) =>{
                console.log(e);
            });
        }
    };

    mostrarModal = (title, body) => {
        this.modalRef.current.handleShow({show: true, title, body});
    };

    aceitarTermo =  () => {
         this.setState({
             formCadastro:
            {...this.state.formCadastro,...{aceito : !this.state.formCadastro.aceito}}
        })
    }

    componentDidMount(){
        EnderecoApi.getEstados()
            .then(resp =>  this.setState( {listaEstados: resp.data}) );
    }

    escutadorDeInputFormCadastro = event => {
        const { name, value } = event.target;
        this.setState({
            formCadastro: {...this.state.formCadastro, ...{[name]: value} }
        });
    }

    resetCadastro = () => {
        this.setState({
            formCadastro: {
                aceito: false,
                nomeCompleto: "",
                dataNascimento: "",
                sexo: "",
                cpf: "",
                cep: "",
                logradouro: "",
                numeroLogradouro: "",
                email: "",
                uf: "",
                cidade: "",
                expectativa: "",
            },

            erros: {
                aceito: [],
                nomeCompleto: [],
                dataNascimento: [],
                sexo: [],
                cpf: [],
                cep: [],
                logradouro: [],
                numeroLogradouro: [],
                email: [],
                uf: [],
                cidade: [],
                expectativa: [],
            }
        })
    }

    resetErros = () =>{
        this.setState({ 
            erros: {
                aceito: [],
                nomeCompleto: [],
                dataNascimento: [],
                sexo: [],
                cpf: [],
                cep: [],
                logradouro: [],
                numeroLogradouro: [],
                email: [],
                uf: [],
                cidade: [],
                expectativa: [],
            }
        });
    }

    cadastrar = () => {
        this.resetErros();

        const result = CadastroApi.cadastrar(this.state.formCadastro)
        .then( resp => {
            this.mostrarModal("Cadastro", resp.data.message);
            this.resetCadastro();
        })
        .catch( (e) =>{
            if(e.response && e.response.status === 422){
                let cadastroErros = {};
                Object.entries(e.response.data.errors).forEach((obj, index) => {
                    index === 0 && document.querySelector(`[name=${[obj[0]]}`).focus();
                    cadastroErros = {...cadastroErros, [obj[0]]: [obj[1]]};
                })

                this.setState({ 'erros': {...this.state.erros, ...cadastroErros}});
            }else if(e.response 
                && e.response.data
                 && e.response.data.message){
                    this.mostrarModal("Cadastro", e.response.data.message);
            }else{
                this.mostrarModal("Cadastro", "Ocorreu um erro ao fazer seu cadastro.");
                console.log(e);
            }
        });
    }

    render() {
        const formCadastro = this.state.formCadastro;

        return (
            <Fragment>
                <hr />
                <section className="cadastro" id="sessaoCadastro">
                    <h3 className="display-4 text-center text-info">Cadastro</h3>
                    <span className="texto-formulario">
                        Você quer ter uma <strong>vida saudável</strong>, com muito mais <strong>vigor</strong> e <strong>longevidade</strong>?
                        Preencha o formulário abaixo e um de nossos especialistas entrará em contato com você.
                    </span>
                    <form id="formCadastro" className="mt-5">
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="cadastroNomeCompleto">Nome Completo:</label>
                                <input type="text"
                                   className={"form-control" +  (this.state.erros.nomeCompleto.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroNomeCompleto" 
                                    value={this.state.formCadastro.nomeCompleto}
                                    onChange={this.escutadorDeInputFormCadastro} 
                                    name="nomeCompleto"
                                    placeholder="Nome Completo" />

                                <div className="invalid-feedback">
                                    {this.state.erros.nomeCompleto.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="cadastroEmail">Endereço de email:</label>
                                
                                <input name="email"
                                    onChange={this.escutadorDeInputFormCadastro}
                                    type="email"
                                    value={this.state.formCadastro.email}
                                    className={"form-control" +  (this.state.erros.email.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroEmail"
                                    aria-describedby="emailHelp"
                                    placeholder="Seu email" />
                                
                                <div className="invalid-feedback">
                                    {this.state.erros.email.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                                <small id="emailHelp" className="form-text text-muted">Nunca vamos compartilhar seu email, com ninguém.</small>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="cadastroDataNascimento">Data de Nascimento:</label>
                                <input name="dataNascimento"
                                    onChange={this.escutadorDeInputFormCadastro}
                                    type="date"
                                    value={this.state.formCadastro.dataNascimento}
                                    className={"form-control" +  (this.state.erros.dataNascimento.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroDataNascimento" />
                                
                                <div className="invalid-feedback">
                                    {this.state.erros.dataNascimento.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="row">
                                    <fieldset name="sexo" onChange={this.escutadorDeInputFormCadastro}
                                        className={(this.state.erros.sexo.length > 0 ? "is-invalid"  : "")}>
                                        <legend className="col-form-label col-sm-2 pt-0">Sexo:</legend>
                                        <div className="col-sm-10">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="sexo" id="cadastroFeminino" value="F" checked={this.state.formCadastro.sexo=="F"} />
                                                    <label className="form-check-label" htmlFor="cadastroFeminino">
                                                        Feminino
                                                    </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="sexo" id="cadastroMasculino" value="M" checked={this.state.formCadastro.sexo=="M"} />
                                                    <label className="form-check-label" htmlFor="cadastroMasculino">
                                                        Masculino
                                                    </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="sexo" id="cadastroOutro" value="O" checked={this.state.formCadastro.sexo=="O"} />
                                                    <label className="form-check-label" htmlFor="cadastroOutro">
                                                        Outro
                                                    </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="invalid-feedback">
                                        {this.state.erros.sexo.map( (item, index) => <div key={index} >{item}</div>)}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="cadastroCpf">CPF:</label>
                                <input name="cpf"
                                    onChange={this.escutadorDeInputFormCadastro}
                                    value={this.state.formCadastro.cpf}
                                    type="text"
                                    className={"form-control" +  (this.state.erros.cpf.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroCpf"
                                    placeholder="000.000.000-00"
                                    data-mask="000.000.000-00" />
                                
                                <div className="invalid-feedback">
                                    {this.state.erros.cpf.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="cadastroCep">CEP:</label>
                                <input name="cep"
                                    onChange={this.buscaCep}
                                    value={this.state.formCadastro.cep}
                                    type="text"
                                    className={"form-control" +  (this.state.erros.cep.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroCep"
                                    placeholder="00000-000"
                                    data-mask="00000-000" />

                                <div className="invalid-feedback">
                                    {this.state.erros.cep.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="cadastroLogradouro">Logradouro:</label>

                                <input name="logradouro"
                                    onChange={this.escutadorDeInputFormCadastro}
                                    type="text"
                                    value={this.state.formCadastro.logradouro}
                                    className={"form-control" +  (this.state.erros.logradouro.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroLogradouro"
                                    placeholder="Logradouro" />
                                
                                <div className="invalid-feedback">
                                    {this.state.erros.logradouro.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="cadastroNumeroLogradouro">Número Logradouro:</label>
                                
                                <input name="numeroLogradouro"
                                    onChange={this.escutadorDeInputFormCadastro}
                                    value={this.state.formCadastro.numeroLogradouro}
                                    type="text"
                                    className={"form-control" +  (this.state.erros.numeroLogradouro.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroNumeroLogradouro"
                                    placeholder="Número Logradouro" />
                                
                                <div className="invalid-feedback">
                                    {this.state.erros.numeroLogradouro.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="mr-sm-2" htmlFor="cadastroUf">Estado:</label>
                                
                                <select name="uf"
                                    value={this.state.formCadastro.uf}
                                    onChange={this.escutadorDeInputFormCadastro}
                                    className={"custom-select mr-sm-2 form-control" +  (this.state.erros.uf.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroUf">
                                    
                                    <option value="">Selecione...</option>
                                    {this.state.listaEstados.map( item => <option key={item.uf} value={item.uf}>{item.nome}</option>)}
                                </select>

                                <div className="invalid-feedback">
                                    {this.state.erros.uf.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-8 mb-3">
                                <label htmlFor="cadastroCidade">Cidade:</label>
                                
                                <input name="cidade"
                                    onChange={this.escutadorDeInputFormCadastro}
                                    type="text"
                                    value={this.state.formCadastro.cidade}
                                    className={"form-control" +  (this.state.erros.cidade.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroCidade"
                                    placeholder="Cidade" />
                                
                                <div className="invalid-feedback">
                                    {this.state.erros.cidade.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="cadastroExpectativa">Qual sua expectativa?</label>
                                
                                <textarea name="expectativa"
                                    value={this.state.formCadastro.expectativa}
                                    onChange={this.escutadorDeInputFormCadastro}
                                    className={"form-control" +  (this.state.erros.expectativa.length > 0 ? " is-invalid"  : "")}
                                    id="cadastroExpectativa"
                                    rows="5"></textarea>
                                
                                <div className="invalid-feedback">
                                    {this.state.erros.expectativa.map( (item, index) => <div key={index} >{item}</div>)}
                                </div>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox"
                                    className="form-check-input"
                                    id="cadastroDeAcordo"
                                    checked={this.state.formCadastro.aceito}
                                    onChange={this.aceitarTermo} />
                                <label className="form-check-label" htmlFor="cadastroDeAcordo">Estou de acordo com os termos</label>
                            </div>
                            <div className="col-md-12 mb-3">
                                <button id="btnSubmitCadastro" type="button" className="btn btn-primary" disabled={!this.state.formCadastro.aceito} onClick={this.cadastrar}>Enviar</button>
                            </div>
                        </div>
                    </form>
                    <ModalAlert ref={this.modalRef} />
                </section>
            </Fragment>
        )
    }
    
};

export default Cadastro;
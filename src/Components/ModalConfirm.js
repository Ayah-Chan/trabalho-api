import { Fragment, React, Component } from "react";
import { Button, Modal} from 'react-bootstrap';


class ModalAlert extends Component{

    constructor(props) {
        super(props);
        this.state = {show: false, title: "", body: null, helper: null }
    }

    handleAtualizar = () => {
        this.handleClose("atualizar");
    }

    handleExcluir = () => {
        this.handleClose("excluir");
    }

    handleClose = (res) => {
        this.state.body.retornoModal(res, this.state.helper);
        this.setState({show: false, title: "", body: null, helper: null });
    }

    handleShow = modal => this.setState( modal );

    render() {
        const {show, title} = this.state;

        return (
            <Fragment>
                <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Já foi encontrado um cadastro com esse CPF. Deseja atualizar ou excluir esse cadastro?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleAtualizar}>
                            Atualizar cadastro
                        </Button>
                        <Button variant="secondary" onClick={this.handleExcluir}>
                            Excluir cadastro
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

export default ModalAlert;
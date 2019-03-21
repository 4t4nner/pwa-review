import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
    Button,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'


const InfoModal = ({error,isOpen,message,dispatch}) => {

    const close = () => {
        dispatch({type:'INFO_MODAL_CLOSE'})
    }

    return <Modal
        isOpen={isOpen}
        toggle={close}
        className={'modal_info' + (error ? ' modal_error' : '')}
    >
        <ModalHeader toggle={close}>
            {error ? 'Ошибка' : 'Уведомление'}
        </ModalHeader>
        <ModalBody>
            {message}
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={close}>
                Закрыть
            </Button>
        </ModalFooter>
    </Modal>
}

InfoModal.propTypes = {
    error: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
}


export default connect(({app}) => ({
    error: app.infoModalError,
    isOpen: app.infoModalOpen,
    message: app.infoModalMessage,
}))(InfoModal)

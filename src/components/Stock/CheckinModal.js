import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
    Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle,
    Button,Row,Col,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import {uploadPhoto,closeCheckinModal,cancelEditCheckin} from '../../actions/stock';
import {getCanvasPreview} from '../../services';

const PhotoInfo = connect(({storage}) => ({i:storage.photoInfo})) (
    ({i}) => !i ? null :
        <div className='checkin-modal__info'>
            <p>{i}</p>
            <hr/>
        </div>
)

class CheckinModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            localChanges: false,
            modalOpen: false,
            cameraOpen: false,
            checkinId: false,
            photosChanged:false,
            photos: [],
        };

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.photosChanged){
            this.setState({photosChanged:false});
        }
    }

    /**
     * action: showModal
     * @param nextProps
     * @param prevState
     * @returns {boolean|Object|entities.checkin|{dateSuccess, id, dateCreate, checkinDelay, datePlanned, order}}
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('CheckinModal: getDerivedStateFromProps_0: [nextProps, prevState,other]',[nextProps, prevState]);
        if (!nextProps.checkin) {
            console.log('CheckinModal: getDerivedStateFromProps_1: [nextProps, prevState]',[nextProps, prevState]);
            return null
        }
        if(prevState.localChanges){
            console.log('CheckinModal: getDerivedStateFromProps_localChanges: [nextProps, prevState]',[nextProps, prevState]);
            return {localChanges:false}
        }
        if(nextProps.photoError && prevState.photos.length){
            prevState.photos.pop();
            return {photosChanged:true}
        }

        console.log('CheckinModal: getDerivedStateFromProps_2: [nextProps, prevState]',[nextProps, prevState]);
        return nextProps.modalOpen !== prevState.modalOpen
            ? {
                modalOpen: nextProps.modalOpen,
                ...((nextProps.checkin.id !== prevState.checkinId)
                        ? {photos: [], checkinId: nextProps.checkin.id}
                        : {}
                )
            }
            : null
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        console.log('CheckinModal: shouldComponentUpdate: [nextProps,this.props, nextState,this.state, res]', [
            nextProps,
            this.props,
            nextState,
            this.state,
            nextState.modalOpen !== this.state.modalOpen || nextState.photosChanged
        ])
        return nextState.modalOpen !== this.state.modalOpen
            || nextState.photosChanged
    }

    onModalClose = () => {

        this.setState({modalOpen: false,cameraOpen: false,localChanges:true})
        this.props.closeCheckinModal();

    }
    onModalCancel = () => {
        this.setState({
            modalOpen: false,
            checkinId: false,
            photos: [],
            localChanges:true,
        })
        this.props.cancelEditCheckin();
    }
    onModalSubmit = () => {

    }


    onTakePhoto = async (e) => {
        console.log('onTakePhoto',e.target.files,e.currentTarget.files);
        const file = e.target.files[0];
        this.props.uploadPhoto(file);
        let canvasData = await getCanvasPreview(file);

        this.setState(({photos}) => {
            photos.push({src:canvasData,name:file.name})
            return {localChanges:true,photosChanged: true};
        })

    }
    onDeletePhoto = (num) => {
        this.setState(({photos}) => {
            delete photos[num]
            return {localChanges:true,photosChanged: true};
        })
    }

    render() {

        console.log('CheckinModal: render_1: [this.props,this.state,!this.state.modalOpen]',[this.props,this.state,!this.state.modalOpen]);
        return (
            <div>
                {!this.props.checkin ? null : <Modal
                    isOpen={this.state.modalOpen}
                    toggle={this.onModalClose}
                    className='checkin-photos-modal'
                >

                    <ModalHeader toggle={this.onModalClose}>Check-IN</ModalHeader>
                    <ModalBody>
                        <PhotoInfo/>
                        {!this.props.photoError ? null :
                            <div className='checkin-modal__error'>
                                <p>Не удалось загрузить фото. Попробуйте ещё раз или перезагрузите приложение</p>
                                <hr/>
                            </div>
                        }
                        <Row className={'preview-list'}>
                            {!this.state.photos.length ? null :
                                this.state.photos.map((preview, i) => (
                                    <Col key={i} className='preview-list__item preview-list__item_picture'>
                                        <Card>
                                            <i className='icon-close-times'
                                               onClick={() => this.onDeletePhoto(i)}
                                            />
                                            <CardImg src={preview.src}/>
                                        </Card>
                                    </Col>
                                ))
                            }

                            <Col className='preview-list__item preview-list__item_add-photo'>
                                <Card className='add-photo'>
                                    <input onChange={this.onTakePhoto} type="file" accept="image/jpeg"
                                           capture="camera"/>
                                </Card>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onModalSubmit}>Отправить</Button>{' '}
                        <Button color="secondary" onClick={this.onModalCancel}>Отменить</Button>
                    </ModalFooter>
                </Modal>}
            </div>

        )
    }
}


const mapStateToProps = ({storage}) => {
    console.log('CheckinModal: mapStateToProps: [s.storage]',[storage]);
    return {
        checkin:storage.checkinModal,
        modalOpen:storage.checkinModalOpen,
        photoError:storage.photoError,
    };
}


export default connect(mapStateToProps,{uploadPhoto,closeCheckinModal,cancelEditCheckin})(CheckinModal)

import React from 'react';
import { connect } from 'react-redux';
import RILightbox from 'react-images';
// import {uploadPhoto,closeCheckinModal} from '../../actions/stock';
import {lightboxClose} from '../../actions/components'


class LightBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            currentImage: 0,
        };

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('LightBox: getDerivedStateFromProps_0: [nextProps, prevState]', [nextProps, prevState])
        if (prevState.localChanges) {
            return {localChanges: false}
        }
        return nextProps.isOpen !== prevState.isOpen
            ? {isOpen: nextProps.isOpen}
            : null
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.checkinMd5 !== this.props.checkinMd5
            || nextState.isOpen !== this.state.isOpen
    }

    onClose = () => {
        this.setState(({isOpen}) => ({
            localChanges: true,
            isOpen: !isOpen,
            currentImage: 0,
        }))
        this.props.lightboxClose()
    }

    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }
    gotoNext () {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }
    gotoImage (index) {
        this.setState({
            currentImage: index,
        });
    }
    handleClickImage () {
        if (this.state.currentImage === this.props.images.length - 1) return;

        this.gotoNext();
    }

    render() {
        return <RILightbox
            currentImage={this.state.currentImage}
            onClickImage={this.handleClickImage}
            onClickNext={this.gotoNext}
            onClickPrev={this.gotoPrevious}
            images={this.props.images}
            isOpen={this.state.isOpen}
            onClose={this.onClose}
        />
    }
}

// const mapStateToProps = s => ({
//     checkin: s.storage.checkinModal
// })

const mapStateToProps = s => {
    console.log('LightBox: mapStateToProps: [s.components]',[s.components]);
    return {
        // checkin:s.storage.checkinModal,
        isOpen: s.components.lightbox.isOpen,
        images: s.components.lightbox.images,
        checkinMd5: s.components.lightbox.checkinMd5,
    };
}


export default connect(mapStateToProps,{lightboxClose})(LightBox)

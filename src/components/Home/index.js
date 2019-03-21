// container

import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import StockHome from '../Stock/Home'
import Loading from './Loading'
import {getStock} from '../../actions/stock'

class Home extends React.Component {
    static propTypes = {
        userId: PropTypes.oneOfType([PropTypes.number,PropTypes.bool]),
        role: PropTypes.oneOfType([PropTypes.bool,PropTypes.string]),
        loaded: PropTypes.bool.isRequired,
        getStock: PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);

        this.getRoleComponent = this.getRoleComponent.bind(this);
    }

    getRoleComponent = () => {

        if(!this.props.loaded){
            return <Loading/>
        }

        switch (this.props.role) {
            case 'stockman':
                return <StockHome/>;
            default:
                return (<div>
                    No such role: {this.props.role}
                </div>)
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.role !== this.props.role
            || nextProps.loaded !== this.props.loaded
    }

    componentDidMount() {
        this.props.userId && !this.props.loaded && this.props.getStock()
    }

    render() {
        return this.getRoleComponent()
    }
}


const mapStateToProps = state => {
    return {
        userId: state.app.user.id ? state.app.user.id : false,
        role: state.app.user.role ? state.app.user.role : false,
        loaded: !!state.app.loaded
    }
}

export default connect(mapStateToProps,{getStock})(Home)


import React from 'react'
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types'
import {setFilter} from '../../actions/stock'


import OrderFilter from './OrderFilter'
import OrderList from './OrderList'
import CheckinModal from './CheckinModal'



class StockHome extends React.Component {

    static propTypes = {
        checkinTypes: PropTypes.object.isRequired,
        filter: PropTypes.object.isRequired,
        orders: PropTypes.object.isRequired,
        setFilter: PropTypes.func.isRequired,
    }


    constructor(props) {
        super(props);

        this.changePerformed = false;
    }
    // componentDidMount(){
    //
    // }

    handleFilterChange = (e) => {
        // dispatch new stock state
        let f = Object.assign({}, this.props.filter),
            n = e.currentTarget.name,
            v = e.currentTarget.value

        if (n === 'time') {
            f.from = f.to = (v === 'today')
                ? new Date()
                : ((v === 'tomorrow')
                        ? (new Date()).addDays(1)
                        : false // all
                )
        }
        if (n === 'type' && f.type && f.type === v) {
            v = false
        }

        this.changePerformed && this.props.setFilter(Object.assign(
            {},
            f,
            {[n]: v}
        ))

        this.changePerformed = false

    }


    render() {
        this.changePerformed = true;
        return (
            <div>
                <Container>
                    <section className='content'>
                        <OrderFilter
                            checkinTypes={this.props.checkinTypes}
                            filter={this.props.filter}
                            onChange={this.handleFilterChange}
                        />
                    </section>

                    <OrderList orders={this.props.orders}/>
                </Container>

                <CheckinModal/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    filter: state.storage.filter,
    orders: state.storage.orders,
    checkinTypes: state.storage.checkinTypes,
})

export default connect(mapStateToProps,{setFilter})(StockHome)

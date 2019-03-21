import {UncontrolledCollapse, Collapse as RSCollapse} from 'reactstrap'
import {connect} from 'react-redux'
import {collapseOpen} from '../actions/components'

import React from 'react'
import {omit} from "reactstrap/src/utils"

const omitKeys = ['toggleEvents', 'defaultOpen', 'dispatch', 'collapseOpen', 'openedCollapseId', 'isOtherOpen', 'md5Sum']

class CustomCollapse extends UncontrolledCollapse {
    constructor(props) {
        super(props) // вызов родительского конструктора.

        this.state = {
            isOpen: false,
            ...(!!props.id ? {id: props.id} : {})
        }
    }

    /**
     * при открытии установить флаг justOpened - для getDerivedStateFromProps
     * @param e
     */
    toggle(e) {
        this.setState(({isOpen, id}) => {
            console.log('Collapse: this.setState; isOpen,id,(id && !isOpen): ', [isOpen, id, (id && !isOpen)])

            return {isOpen: !isOpen, justOpened: !isOpen}
        })
        e.preventDefault()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.state.id && this.state.isOpen && this.props.collapseOpen(this.props.id)
    }

    /**
     * обновление стейта при изменении глоб. стора
     *
     * при открытии закрытой: сбросить флаг обновления
     * на остальных - если открывалась не она и она открыта - закрыть
     *
     * @param nextProps
     * @param prevState
     * @returns {*}
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        return prevState.justOpened
            ? {justOpened: false}
            : ((prevState.id
                    && prevState.isOpen
                    && nextProps
                    && nextProps.isOtherOpen
                    && nextProps.openedCollapseId
                    && nextProps.openedCollapseId !== prevState.id // это возможно лишнее
                )
                    ? {isOpen: false}
                    : null
            )
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.md5Sum !== this.props.md5Sum
            || nextState.isOpen !== this.state.isOpen
    }

    /**
     * omitKeys - parent private
     * @returns {*}
     */
    render() {
        return <RSCollapse isOpen={this.state.isOpen} {...omit(this.props, omitKeys)} />
    }

}

const mapStateToProps = s => (
    s.components.Collapse.id
        ? {
            openedCollapseId: s.components.Collapse.id,
            isOtherOpen: s.components.Collapse.isOpen,
        }
        : {}
)

export default connect(mapStateToProps, {collapseOpen})(CustomCollapse)
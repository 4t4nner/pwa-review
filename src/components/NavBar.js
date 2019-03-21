import React from 'react'
import { connect } from 'react-redux';
import { Link,withRouter } from 'react-router-dom'
import {exitAuth,getAuthIfExists} from "../actions/app"
import {init as initSW} from "../actions/sw"
import PropTypes from 'prop-types'
import isEqual from 'deep-equal'

import {
    Container,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

class NavBar extends React.Component {
    static propTypes = {
        getAuthIfExists: PropTypes.func.isRequired,
        exitAuth: PropTypes.func.isRequired,
        initSW: PropTypes.func.isRequired,
        authorized: PropTypes.bool.isRequired,
    }
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
        this.props.initSW();
        this.props.getAuthIfExists();
        if(!this.props.authorized && this.props.history.location.pathname !== '/pwa/auth'){
            console.log('constructor: redirect');
            this.props.history.push('/pwa/auth');
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(!nextProps.authorized && this.props.history.location.pathname !== '/pwa/auth'){
            console.log('NavBar: shouldComponentUpdate: redirect');
            this.props.history.push('/pwa/auth');
            return this.props.authorized !== nextProps.authorized
        }

        return (
            this.props.authorized !== nextProps.authorized
            || !isEqual(this.state, nextState)
        )
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div >
                <Navbar color="primary" dark expand="md">
                    <Container>

                        <NavbarBrand href="/pwa/">Импокар</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Link to="/pwa/" className="nav-link">Home</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/pwa/" className="nav-link">Home</Link>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret >
                                        Options
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>
                                            hello!!
                                        </DropdownItem>
                                        <DropdownItem>
                                            Option 2
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>
                                            Reset
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <NavItem>
                                    <Link to="#"
                                          onClick={() => this.props.exitAuth()}
                                          className="nav-link">Выход</Link>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    authorized: state.app.authorized ? state.app.authorized : false,
})

export default withRouter(
    connect(
        mapStateToProps,
        {exitAuth, getAuthIfExists,initSW}
    )(NavBar)
);

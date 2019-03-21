import equal from 'deep-equal';

import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, FormGroup, Label, Input, FormText, Container } from 'reactstrap';
import {withRouter} from "react-router-dom"
import {connect} from "react-redux"

import {auth} from '../actions/app';

class Auth extends React.Component {
    static propTypes = {
        auth: PropTypes.func.isRequired,
    }

    constructor() {
        super();

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            password: '',
            login: ''
        };
    }

    shouldComponentUpdate(nextProps,nextState) {
        if(nextProps.authorized){
            this.props.history.push('/pwa/');
        }
        return !equal(this.state,nextState);
    }


    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onFormSubmit(e) {
        this.props.auth(this.state.login,this.state.password)
        e.preventDefault();
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.onFormSubmit}
                >
                    <FormGroup>
                        <Label>Email</Label>
                        <Input type="text" name="login" placeholder="login"
                               value={this.state.login}
                               onChange={this.onChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label >Password</Label>
                        <Input type="password" name="password" placeholder="password"
                               onChange={this.onChange}
                               value={this.state.password}
                        />
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    authorized: state.app.authorized,
})

export default withRouter(connect(mapStateToProps, {auth})(Auth));
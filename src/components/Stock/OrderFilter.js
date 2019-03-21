import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Row, Col, Button, Form, FormGroup, Label, Input,} from 'reactstrap'

class OrderFilter extends Component {

    static propTypes = {
        /**
         * from - Date|false
         * to - Date|false
         *
         */
        filter: PropTypes.object,
        checkinTypes: PropTypes.object,
        onChange: PropTypes.func.isRequired
    }

    drawCheckinType = (type) => {
        return <Col xs="12" sm="4" key={type.id}>
            <Button
                color="primary"
                active={false}
                name='type'
                onClick={this.props.onChange}
                className="btn_checkin-type"
                value={type.code}
            >
                {type.name}
                <span>
                    {type.count}
                </span>

            </Button>
        </Col>
    }


    // date: d.m.Y = 01.01.1970

    render() {
        const {from, to, time} = this.props.filter

        return (
            <div>
                <Form>
                    <Row>
                        <Col xs="12" md="6">
                            {
                                ([['all', 'Всё время'], ['today', 'Сегодня'], ['tomorrow', 'Завтра']]).map(t =>
                                    <Button key={t[0]}
                                            color="link"
                                            active={time === t[0]}
                                            name='time'
                                            value={t[0]}
                                            onClick={this.props.onChange}
                                    >{t[1]}</Button>
                                )
                            }
                        </Col>
                        <Col xs="12" md="6" className="_padding-top-1">
                            <FormGroup>
                                <Label>C</Label>
                                <Input type="date" name="from"
                                       value={from && from.toHtml()}
                                       onChange={this.props.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>По</Label>
                                <Input type="date" name="to"
                                       value={to && to.toHtml()}
                                       onChange={this.props.onChange}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>{Object.values(this.props.checkinTypes).map(this.drawCheckinType)}</Row>
                </Form>
            </div>
        )
    }
}


export default OrderFilter
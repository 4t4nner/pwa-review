import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux';
import {onlyUpdateForKeys} from 'recompose'
import {
    Row,
    Col,
    Button,
    ListGroup,
    ListGroupItem,
} from 'reactstrap'
import Collapse from '../Collapse'
import {getShort, getDMYT} from '../../services/moment'
import {openCheckinModal} from '../../actions/stock'
import {lightboxOpen} from '../../actions/components'



const Checkin = connect(null,{openCheckinModal,lightboxOpen})(
    onlyUpdateForKeys(['md5Sum'])(({c,openCheckinModal,lightboxOpen}) => {
        const editable = c.activity,
            checkinStatus = c.dateSuccess ? 'success'
                : (editable
                        ? 'active'
                        : 'inactive'
                )

        return <ListGroup key={c.id} className='checkin-description' flush>

            <ListGroupItem
                className={
                    'checkin-description__item'
                    + ` checkin-description__item_${checkinStatus}`
                }
            >
                <Row>
                    <Col>
                        <p><b>Тип</b></p>
                        <p>{c.type}</p>
                    </Col>

                    {!editable ? null : <Col className='btn-container'>
                        <Button
                            onClick={() => {openCheckinModal(c)}}
                            className='checkin-edit' color='primary'><i className="icon-pencil-alt"></i></Button>
                    </Col>}

                </Row>
            </ListGroupItem>
            {[
                ['Дата и время', getDMYT(c.dateSuccess)],
                ['Ф.И.О.', c.performer.fio],
                ['Комментарий', c.comment],
            ].map((item, i) => (!item[1]) ? null :
                <ListGroupItem key={i}>
                    <Row>
                        <Col><b>{item[0]}</b></Col>
                        <Col>{item[1]}</Col>
                    </Row>
                </ListGroupItem>)

            }
            {!c.photo.length ? null :
                <ListGroupItem>
                    <b><p>Посмотреть фото</p></b>
                    {
                        c.photo.map((photo,i) => <Row key={i}><Col>
                            <a target="_blank" href={photo} className='link_icon'>
                                <i className="icon-image" ></i>
                                В новой вкладке
                            </a>
                        </Col></Row>)
                    }
                </ListGroupItem>
            }
            {!c.damagedPhoto.length ? null :
                <ListGroupItem>
                    <b><p>Посмотреть фото повреждений</p></b>
                    {
                        c.damagedPhoto.map((photo,i) => <Row key={i}><Col>
                            <a target="_blank" href={photo} className='link_icon'>
                                <i className="icon-image" ></i>
                                В новой вкладке
                            </a>
                        </Col></Row>)
                    }
                </ListGroupItem>
            }
            {/*
            {!c.damagedPhoto.length ? null :
                <ListGroupItem>
                    <Row>
                        <Col><Button
                            color='link'
                            onClick={() => {console.log('onClick',c);lightboxOpen(c.damagedPhoto,c.md5Sum + '-d'); }}
                        >
                            Посмотреть фото повреждений
                        </Button></Col>
                    </Row>
                </ListGroupItem>
            }
            */}
        </ListGroup>
    })
)

const getODetail = (detail) =>
    detail && detail.length
        ? (
            <div>
                <hr/>
                <ListGroup flush className='detail'>
                    {detail.map((item, num) => <ListGroupItem key={num} className='detail__item'>
                        <p className='name'>{item[0]}</p>
                        <p className='value'>{item[1]}</p>
                    </ListGroupItem>)}
                </ListGroup>
            </div>
        )
        : null
/**
 *
 * @param {Array} list
 * @returns {null}
 */
const getDocs = (list) =>
    list && list.length
        ? (
            <div>
                <hr/>
                <ListGroup flush className='detail'>
                    {list.map((item, num) => <ListGroupItem key={num} className='detail__item detail__item_doc'>
                        <a className='link' href={item.link}>
                            <i className="icon-file-alt"></i>
                            {item.name}</a>
                    </ListGroupItem>)}
                </ListGroup>
            </div>
        )
        : null

const Order = onlyUpdateForKeys(['md5Sum'])(({o}) => {
    let
        // хз, может баг, но пользователя может не найтись в бд
        user = !(o.owner && o.payer) ? '' : (o.payer.fio + ((o.owner.id !== o.payer.id) && ` (${o.owner.fio})`)),
        arrival = getShort(o.arrival),
        departure = getShort(o.departure)

    return <ListGroupItem className='order order-list-item'>

        <h3 className='order__title'>№{o.name} ({o.tariff})</h3>
        <p className='order__model'>Модель: {o.mark} {o.model}</p>
        <p className='order__owner'>{user}</p>

        <div className='points'>
            <p className='points__item'>
                <span className='point'>{o.from}</span>
                <span className='date'>{arrival}</span>
            </p>
            <p className='points__item'>
                <span className='point'>{o.to}</span>
                <span className='date'>{departure}</span>
            </p>
        </div>

        <Row>
            <Col>
                <Button
                    color="primary" id={'orderDetailToggler-' + o.id} style={{marginBottom: '1rem'}}>Toggle</Button>
            </Col>
        </Row>

        <Collapse
            toggler={'orderDetailToggler-' + o.id}
            id={`order-collapse-${o.id}`}
            className={' order-collapse'}
            md5Sum={o.md5Sum}
        >
            {getODetail([
                ['Марка автомобиля', o.mark],
                ['Модель автомобиля', o.model],
                ['Состояние автомобиля', !o.malfunction
                    ? (!o.crash
                        ? 'Авто на ходу'
                        : 'Поврежден')
                    : 'Самостоятельно не двигается'
                ],
                ['Направление перевозки', `${o.from} - ${o.to}`],
                ['Дата отправки', arrival],
                ['Тариф', o.tariff]
            ])}
            {getODetail(Object.keys(o.serviceList).map(
                id => [
                    o.serviceList[id].name,
                    o.serviceList[id].price + ' рублей'
                ]
            ))}

            {getDocs(Object.values(o.docs))}

            <hr/>
            <h3>Check - IN</h3>
            <div>
                {o.checkinList.map((c, num) => <Checkin c={c} md5Sum={c.md5Sum} key={num}/>)}
            </div>

        </Collapse>
    </ListGroupItem>
})

Order.propTypes = {
    o: PropTypes.object.isRequired,
    md5Sum: PropTypes.string.isRequired,
}


const OrderList = ({orders}) => (
    <section className='content _padding-0'>
        <ListGroup className='order-list'>
            <ListGroupItem>
                <h3 className='order-list__title'>Личный кабинет</h3>
            </ListGroupItem>

            {Object.keys(orders).map(
                orderId => <Order key={orderId} o={orders[orderId]} md5Sum={orders[orderId].md5Sum}/>
            )}

        </ListGroup>
    </section>
)

OrderList.propTypes = {
    orders: PropTypes.object.isRequired
}

export default OrderList

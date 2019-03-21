import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const StorageFilterBtn = (props) => (
    <Button color="primary" className='btn-storage'>
        {props.children}
        <span className="btn-storage__notification">{props.orderCount}</span>
    </Button>
)

StorageFilterBtn.propTypes = {
    orderCount: PropTypes.number.isRequired,
    children: PropTypes.node
}

export default StorageFilterBtn
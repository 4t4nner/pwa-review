
import React from 'react'
import {Spinner} from 'reactstrap'

class Loading extends React.Component {

    render() {
        return (
            <div>
                <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
                <p>
                    Загрузка...
                </p>
            </div>
        )
    }

}


export default Loading;
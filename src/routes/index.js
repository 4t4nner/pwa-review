import React from 'react'
import {Route, Switch} from 'react-router'

import Home from '../components/Home'
import NoMatch from '../components/NoMatch'
import NavBar from '../components/NavBar'
import Auth from '../components/Auth'
import InfoModal from '../components/InfoModal'

const routes = (
    <div>
        <NavBar/>
        <Switch>
            <Route exact path="/pwa/" component={Home}/>
            <Route path="/pwa/auth" component={Auth}/>
            <Route component={NoMatch}/>
        </Switch>
        <InfoModal/>
    </div>
)

export default routes

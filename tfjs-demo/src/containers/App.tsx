import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../store'

import Canvas from './Canvas'
import Header from './Header'

// container component

interface OwnProps {

}

type AppProps = OwnProps

export const AppComponent: React.SFC<AppProps> = (props) => {
    return (
        <div>
            <Header />
            <Canvas />
        </div>
    )
}

// connect

function mapStateToProps(appState: AppState) {
    return { ...appState }
}

function mapDispatchToProps(dispatch: Dispatch<void>) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent)

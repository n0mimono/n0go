import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../store'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

// container component

interface OwnProps {

}

type HeaderProps = OwnProps

export const HeaderComponent: React.SFC<HeaderProps> = (props) => {
    return (
        <AppBar style={{position: 'static'}}>
           <Toolbar>
                <Typography variant="title" color="inherit">
                    TensorFlow.js
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

// connect

function mapStateToProps(appState: AppState) {
    return { }
}

function mapDispatchToProps(dispatch: Dispatch<void>) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
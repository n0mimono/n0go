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

type Props = OwnProps

export const Component: React.SFC<Props> = (props) => {
    return (
        <AppBar style={{position: 'static', background: "#333"}}>
           <Toolbar>
                <Typography variant="title" color="inherit">
                    Demo: TensorFlow.js
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

export default connect(mapStateToProps, mapDispatchToProps)(Component)

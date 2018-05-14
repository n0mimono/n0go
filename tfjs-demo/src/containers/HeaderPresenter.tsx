import * as React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { isSp } from '../modules/utils'

interface HeaderPresenterProps {
}

export const HeaderPresenter: React.SFC<HeaderPresenterProps> = (props) => {
    return (
        <AppBar style={{position: 'static', background: "#333"}}>
           <Toolbar>
                <Typography variant="title" color="inherit"
                    style={isSp() ? { fontSize: "8vw" } : {}}
                >
                    Demo: TensorFlow.js
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

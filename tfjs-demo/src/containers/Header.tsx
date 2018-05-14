import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../store'

import * as p from './HeaderPresenter'

// container component

interface OwnProps {
}

type Props = OwnProps

export const Component: React.SFC<Props> = (props) => {
    return (
        <p.HeaderPresenter />
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

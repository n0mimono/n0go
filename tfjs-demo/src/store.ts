import { createStore, combineReducers } from 'redux'
import * as Canvas from './modules/canvas'

export type AppState = {
    canvas: Canvas.State
}

const store = createStore(
    combineReducers<AppState>({
        canvas: Canvas.Reducer
    })
)

export default store

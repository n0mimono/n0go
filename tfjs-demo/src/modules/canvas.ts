import { actionCreatorFactory } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Action } from 'typescript-fsa';
import { loadModel } from '@tensorflow/tfjs';

import * as tf from '@tensorflow/tfjs'

// constants

export const Width = 300
export const Height = 300
export const Line = 15
export const Color = "#FFF"
export const Back = "#000"
export const InputWidth = 28
export const InputHeight = 28

export interface Predictor {
    canvas: HTMLCanvasElement
    model: tf.Model
}

// actions

const actionCreator = actionCreatorFactory()

export const actions = {
    init: actionCreator<tf.Model>('INIT'),
    reset: actionCreator('RESET'),
    predict: actionCreator<number[]>('PREDICT')
}

export interface Actions {
    init: (canvas: HTMLCanvasElement) => Action<HTMLCanvasElement>
    reset: (canvas: HTMLCanvasElement) => Action<HTMLCanvasElement>
    predict: (predictor: Predictor) => Action<Predictor>
}

// states

export interface State {
    isModelLoaded: boolean
    estimated: number
    scores: number[]
    model: tf.Model | undefined
}

const initState: State = {
    isModelLoaded: false,
    estimated: -1,
    scores: [],
    model: undefined
}

// reducers

export const Reducer = reducerWithInitialState(initState)
    .case(actions.init, (state, model) => {
        return {
            ...state,
            isModelLoaded: true,
            model: model
        }
    })
    .case(actions.reset, (state) => {
        return {
            ...state,
            estimated: -1,
            scores: []
        }
    })
    .case(actions.predict, (state, scores) => {
        return {
            ...state,
            estimated: scores.indexOf(Math.max(...scores)),
            scores: [...scores]
        }
    })

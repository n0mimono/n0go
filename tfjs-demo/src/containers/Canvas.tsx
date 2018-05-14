import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../store'
import * as Canvas from '../modules/canvas'

import * as tf from '@tensorflow/tfjs'

import * as p from './CanvasPresenter'

// container component

interface OwnProps {
}

type Props = OwnProps & Canvas.State & Canvas.Actions

export class Component extends React.Component<Props> {
    canvas: HTMLCanvasElement

    componentDidMount() {
        this.props.init(this.canvas)
        this.props.reset(this.canvas)
    }

    render() {
        let props = this.props
        return (
            <p.CanvasPresenter
                width={Canvas.Width()} height={Canvas.Height()}
                predictDisabled={!props.isModelLoaded}
                onPredict={() => props.predict({ canvas: this.canvas, model: props.model })}
                onReset={() => props.reset(this.canvas)}
                estimated={props.estimated}
                scores={props.scores}
                onRef={c => this.canvas = c}
            />
        )
    }
}

// connect

function mapStateToProps(appState: AppState) {
    return { ...appState.canvas }
}

function mapDispatchToProps(dispatch: Dispatch<void>) {
    return {
        init: (canvas: HTMLCanvasElement) => {
            let ctx = canvas.getContext('2d')

            let onStart = (x: number, y: number) => {
                ctx.beginPath()
                ctx.moveTo(x, y)
            }
            let onMove = (x: number, y: number) => {
                ctx.lineTo(x, y)
                ctx.lineCap = "round"
                ctx.lineWidth = Canvas.Line()
                ctx.strokeStyle = Canvas.Color
                ctx.stroke()
            }
            let onEnd = () => {
            }

            canvas.addEventListener("mousedown", e => {
                e.preventDefault()
                onStart(e.layerX, e.layerY)
            }, false)
            canvas.addEventListener("mousemove", e => {
                if (e.buttons == 1) {
                    onMove(e.layerX, e.layerY)
                }
            }, false)
            canvas.addEventListener("mouseup", e => onEnd(), false)

            canvas.addEventListener("touchstart", e => {
                e.preventDefault()
                let rect = canvas.getBoundingClientRect()
                onStart(e.touches[0].clientX - rect.left, e.touches[0].clientY  - rect.top)
            }, false)
            canvas.addEventListener("touchmove", e => {
                let rect = canvas.getBoundingClientRect()
                onMove(e.touches[0].clientX - rect.left, e.touches[0].clientY  - rect.top)
            }, false)
            canvas.addEventListener("touchend", e => onEnd(), false)

            tf.loadModel('/model/model.json')
                .then(m => dispatch(Canvas.actions.init(m)))
        },
        reset: (canvas: HTMLCanvasElement) => {
            let ctx = canvas.getContext('2d')
            ctx.fillStyle = Canvas.Back
            ctx.fillRect(0, 0, Canvas.Width(), Canvas.Height())

            dispatch(Canvas.actions.reset())
        },
        predict: (predictor: Canvas.Predictor) => {
            let tmpCanvas = document.createElement('canvas').getContext('2d')
            tmpCanvas.drawImage(predictor.canvas, 0, 0, Canvas.InputWidth, Canvas.InputHeight)
            let img = tmpCanvas.getImageData(0, 0, Canvas.InputWidth, Canvas.InputHeight)

            let pred = tf.tidy(() => {
                let input = tf.fromPixels(img, 1)
                input = tf.cast(input, 'float32').div(tf.scalar(255))
                input = input.expandDims()
                return predictor.model.predict(input) as tf.Tensor
            })
            let scores = Array.from(pred.dataSync())

            dispatch(Canvas.actions.predict(scores))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)

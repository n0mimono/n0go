import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../store'
import * as Canvas from '../modules/canvas'

import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'

import * as tf from '@tensorflow/tfjs'

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
            <div style={{ display: "flex" }}>
                <div style={{ padding: "20px" }}>
                    <div>
                        <Drawer width={Canvas.Width} height={Canvas.Height} onRef={c => this.canvas = c} />
                        <div style={{ padding: "10px 0px" }}>
                            <PredictBtn
                                disabled={!props.isModelLoaded}
                                onClick={() => props.predict({ canvas: this.canvas, model: props.model })}
                            />
                            <ResetBtn onClick={() => props.reset(this.canvas)} />
                        </div>
                    </div>
                </div>
                <div style={{ padding: "20px 10px" }}>
                    <Result index={props.estimated} scores={props.scores} />
                </div>
            </div>
        )
    }
}

interface DrawerProps {
    width: number
    height: number
    onRef: (c: HTMLCanvasElement) => void
}

const Drawer: React.SFC<DrawerProps> = (props) => {
    return (
        <canvas
            width={props.width} height={props.height}
            style={{ border: "1px solid #000" }}
            ref={(c: HTMLCanvasElement) => { props.onRef(c) }}
        />
    )
}

interface PredictBtnProps {
    disabled: boolean
    onClick: () => void
}

const PredictBtn: React.SFC<PredictBtnProps> = (props) => {
    return (
        <Button disabled={props.disabled} variant="raised" color="primary" onClick={_ => props.onClick()}>
            {props.disabled ? "Loading.." : "Prediction"}
        </Button>
    )
}

interface ResetBtnProps {
    onClick: () => void
}

const ResetBtn: React.SFC<ResetBtnProps> = (props) => {
    return (
        <Button variant="raised" onClick={_ => props.onClick()}>Reset</Button>
    )
}

interface ResultProps {
    index: number
    scores: number[]
}

const Result: React.SFC<ResultProps> = (props) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
                {(() => {
                    let rows = []
                    for (let i = 0; i < 10; i++) {
                        rows.push(
                            <tr style={props.index == i ? { color: "#F44" } : { color: "#666" }}>
                                <th>{i}</th>
                                <td>{props.scores.length > 0 ? props.scores[i] : "-"}</td>
                            </tr>
                        )
                    }
                    return rows
                })()}
            </tbody>
        </table>
    )
}

// connect

function mapStateToProps(appState: AppState) {
    return { ...appState.canvas }
}

function mapDispatchToProps(dispatch: Dispatch<void>) {
    return {
        init: (canvas: HTMLCanvasElement) => {
            let ctx = canvas.getContext('2d')
            let onStart = (e: MouseEvent) => {
                e.preventDefault()

                ctx.beginPath()
                ctx.moveTo(e.layerX, e.layerY)
            }
            let onMove = (e: MouseEvent) => {
                if (e.buttons == 1) {
                    ctx.lineTo(e.layerX, e.layerY)
                    ctx.lineCap = "round"
                    ctx.lineWidth = Canvas.Line
                    ctx.strokeStyle = Canvas.Color
                    ctx.stroke()
                }
            }
            let onEnd = (e: MouseEvent) => {
            }

            canvas.addEventListener("mousedown", onStart, false)
            canvas.addEventListener("mousemove", onMove, false)
            canvas.addEventListener("mouseup", onEnd, false)

            tf.loadModel('/model/model.json')
                .then(m => dispatch(Canvas.actions.init(m)))
        },
        reset: (canvas: HTMLCanvasElement) => {
            let ctx = canvas.getContext('2d')
            ctx.fillStyle = Canvas.Back
            ctx.fillRect(0, 0, Canvas.Width, Canvas.Height)

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

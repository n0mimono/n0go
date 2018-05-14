import * as React from 'react'

import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'

import { isSp } from '../modules/utils'

interface CanvasPresenterProps {
    width: number
    height: number
    predictDisabled: boolean
    onPredict: () => void
    onReset: () => void
    estimated: number
    scores: number[]
    onRef: (c: HTMLCanvasElement) => void
}

export const CanvasPresenter: React.SFC<CanvasPresenterProps> = (props) => {
    if (isSp()) {
        return (
        <div>
            <div style={{ display: "flex", justifyContent: "center" }} >
                <div>
                    <div style={{ padding: "4vw 2vw" }}>
                        <Drawer width={props.width} height={props.height} onRef={props.onRef} />
                    </div>
                    <div style={{ padding: "0vw 0vw", display: "flex" }}>
                        <div style={{ padding: "0vw 2vw" }}>
                        <PredictBtn
                            disabled={props.predictDisabled}
                            onClick={props.onPredict}
                        />
                        </div>
                        <div style={{ padding: "0vw 2vw" }}>
                        <ResetBtn onClick={props.onReset} />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ padding: "6vw 6.5vw" }}>
                <Result index={props.estimated} scores={props.scores} />
            </div>
        </div>
        )
    } else {
        return (
        <div style={{ display: "flex" }}>
            <div style={{ padding: "20px" }}>
                <div>
                    <Drawer width={props.width} height={props.height} onRef={props.onRef} />
                    <div style={{ padding: "10px 0px" }}>
                        <PredictBtn
                            disabled={props.predictDisabled}
                            onClick={props.onPredict}
                        />
                        <ResetBtn onClick={props.onReset} />
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
        <Button disabled={props.disabled} variant="raised" color="secondary" onClick={_ => props.onClick()}
            style={isSp() ? { fontSize: "5vw", padding: "2vw" } : {}}
        >{props.disabled ? "Loading.." : "Prediction"}
        </Button>
    )
}

interface ResetBtnProps {
    onClick: () => void
}

const ResetBtn: React.SFC<ResetBtnProps> = (props) => {
    return (
        <Button variant="raised" onClick={_ => props.onClick()}
            style={isSp() ? { fontSize: "5vw", padding: "2vw" } : {}}
        >Reset</Button>
    )
}

interface ResultProps {
    index: number
    scores: number[]
}

const Result: React.SFC<ResultProps> = (props) => {
    return (
        <table style={isSp() ? { fontSize: "4vw" } : {}}>
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
                            <tr style={props.index == i ? { color: "#F28" } : { color: "#666" }}>
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
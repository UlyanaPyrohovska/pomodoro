import React, { useState } from "react";
import { Butterfly, Pause, Restart, Start } from "./Icons";
import { CircularProgressbar, CircularProgressbarWithChildren } from "react-circular-progressbar";



function PomodoroTimer() {
    const [mode, setMode] = useState("work")
    const config = {
        workTime: 25,
        breakTime: 5,
        longBreakTime: 30,
        pomodoros: 5
    };
    const modes = ["work", "break", "longBreak"]
    const colorTheme = ["dark", "light"]

    return (
        <div className="timer-wrap">
            <div className="timer-column">
                <div className="timer-buttons">
                    <button className="action-button">Pomodoro</button>
                    <button className="action-button">Short break</button>
                    <button className="action-button">Long break</button>
                    {/* <button>Pomodoro</button> */}
                </div>
                <div style={{ width: 200, height: 200, margin: "auto" }}>
                    <CircularProgressbarWithChildren value={66}>
                        <div style={{ fontSize: 30, marginTop: -30 }}>
                            <strong>25:00</strong>
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
                <div className="timer-buttons">
                    <button className="action-button small-icon-button">
                        <Restart />
                    </button>
                    <button className="action-button small-icon-button">
                        <Start />
                    </button>
                    <button className="action-button small-icon-button">
                        <Pause />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PomodoroTimer
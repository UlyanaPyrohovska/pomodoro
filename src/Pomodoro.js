import React, { useEffect, useRef, useState } from "react";
import { Butterfly, Pause, Restart, Start } from "./Icons";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { DateTime, Duration } from 'luxon';

function PomodoroTimer() {
    const config = {
        workTime: 1,
        breakTime: 1,
        longBreakTime: 30,
        pomodoros: 1
    };
    const intervalRef = useRef();
    const [mode, setMode] = useState("work");
    const [initialDuration, setInitialDuration] = useState(Duration.fromObject({ minutes: config.workTime }));
    const [duration, setDuration] = useState(initialDuration);
    const [isActive, setIsActive] = useState(false);
    const [pomodoroCount, setPomodoroCount] = useState(0);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);
    
    const modes = ["work", "break", "longBreak"]
    const colorTheme = ["dark", "light"]

    const startTimer = () => {
        if (!isActive) {
          setIsActive(true);
          intervalRef.current = setInterval(() => {
            setDuration((prevDuration) => {
              if (prevDuration.as('seconds') > 1) {
                return prevDuration.minus({ seconds: 1 });
              } else {
                clearInterval(intervalRef.current);
                setIsActive(false);
                setNextMode();
                return initialDuration;
              }
            });
          }, 1000);
        }
      };

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
    };

    // Reset the timer
    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
        setDuration(initialDuration);
    };

    const calculatePrecentage = () => {
        return (100 - (duration.as('seconds') / initialDuration.as('seconds')) * 100)
    }

    const setNextMode = () => {
        console.log(mode)
        switch(mode){
            case "work": {
                if(pomodoroCount === config.pomodoros){
                    setInitialDuration(Duration.fromObject({ minutes: config.longBreakTime }));
                    setMode('longBreak');
                    // startTimer();
                } else { 
                    setInitialDuration(Duration.fromObject({ minutes: config.breakTime }));
                    setMode('break');
                    setPomodoroCount(pomodoroCount+1);
                    // startTimer();
                };
                break;
            };
            case "break": {
                setInitialDuration(Duration.fromObject({ minutes: config.workTime }));
                setMode('work');
                setPomodoroCount(pomodoroCount+1);
                // startTimer();
                break;
            };
            case "longBreak": {
                setInitialDuration(Duration.fromObject({ minutes: config.workTime }));
                setMode('work');
                break;
            }
        }
    }
    // const onStartMode = (mode) => {
        
    // }

    return (
        <div className="timer-wrap">
            <div className="timer-column">
                <div className="timer-buttons">
                    <button className={`action-button ${mode === "work" ? "selected-mode" : ""}`} onClick={() => setMode('work')}>Pomodoro</button>
                    <button className={`action-button ${mode === "break" ? "selected-mode" : ""}`} onClick={() => setMode('break')}>Short break</button>
                    <button className={`action-button ${mode === "longBreak" ? "selected-mode" : ""}`} onClick={ () => setMode('longBreak')}>Long break</button>
                    {/* <button>Pomodoro</button> */}
                </div>
                <div style={{ width: 200, height: 200, margin: "auto" }}>
                    <CircularProgressbarWithChildren value={calculatePrecentage()}>
                        <div style={{ fontSize: 30, marginTop: -30 }}>
                            <strong>{duration.toFormat('mm:ss')}</strong>
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
                <div className="timer-buttons">
                    <button className="action-button small-icon-button" onClick={resetTimer}>
                        <Restart color="#fff"/>
                    </button>
                    <button className="action-button small-icon-button" onClick={startTimer}>
                        <Start color="#fff"/>
                    </button>
                    <button className="action-button small-icon-button" onClick={pauseTimer}>
                        <Pause color="#fff"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PomodoroTimer
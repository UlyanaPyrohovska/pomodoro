import React, { useEffect, useRef, useState } from "react";
import { Butterfly, Pause, Restart, Start, Tomato } from "./Icons";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { DateTime, Duration } from 'luxon';
import useSound from 'use-sound';
import dingDong from './ding-dong.mp3';
import { LightenDarkenColor } from 'lighten-darken-color';

const config = {
  work: 2,
  break: 1,
  longBreak: 30,
  pomodoros: 5,
  colorTheme: "black",
  autoStart: false,
  textColor: "#fff",
  buttonColor: "#d8912d"
};
const darkened = LightenDarkenColor(config.buttonColor, -100)
const mystyle = {
  backgroundColor: config.buttonColor,
  color: config.textColor,
};

const selectedStyle = {
  boxShadow: `0 8px 16px 0 ${darkened}, 0 6px 20px 0 ${darkened}`
}
function PomodoroTimer() {
  const intervalRef = useRef();
  const [mode, setMode] = useState("work");
  const [initialDuration, setInitialDuration] = useState(Duration.fromObject({ minutes: config.work }));
  const [duration, setDuration] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [play] = useSound(dingDong);

  const modes = ["work", "break", "longBreak"]
  const colorTheme = ["dark", "light"]
  useEffect(() => {
    if (isActive && duration.as('seconds') === 0) {
      setNextMode();
    }
  }, [duration, isActive]);

  // Timer logic
  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
      intervalRef.current = setInterval(() => {
        setDuration((prevDuration) => {
          if (prevDuration.as('seconds') > 0) {
            return prevDuration.minus({ seconds: 1 });
          } else {
            clearInterval(intervalRef.current);
            setIsActive(false);
            setNextMode();
            return prevDuration; // Return zero duration to avoid negative values
          }
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setDuration(initialDuration);
    setMode('work'); // Reset to initial mode
    setPomodoroCount(0); // Reset pomodoro count
  };

  const calculatePrecentage = () => {
    return (100 - (duration.as('seconds') / initialDuration.as('seconds')) * 100)
  }

  const setNextMode = () => {
    switch (mode) {
      case "work":
        if (pomodoroCount + 1 === config.pomodoros) {
          setInitialDuration(Duration.fromObject({ minutes: config.longBreak }));
          setDuration(Duration.fromObject({ minutes: config.longBreak }));
          setMode('longBreak');
          if (config.autoStart) startTimer();
        } else {
          setInitialDuration(Duration.fromObject({ minutes: config.break }));
          setDuration(Duration.fromObject({ minutes: config.break }));
          setMode('break');
          if (config.autoStart) startTimer();
        }
        setPomodoroCount((prevCount) => prevCount + 1);
        break;
      case "break":
        setInitialDuration(Duration.fromObject({ minutes: config.work }));
        setDuration(Duration.fromObject({ minutes: config.work }));
        setMode('work');
        if (config.autoStart) startTimer();
        break;
      case "longBreak":
        setInitialDuration(Duration.fromObject({ minutes: config.work }));
        setDuration(Duration.fromObject({ minutes: config.work }));
        setMode('work');
        setPomodoroCount(0); // Reset the pomodoro count after a long break
        break;
      default:
        break;
    }
    play();
  };

  const changeMode = (mode) => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setInitialDuration(Duration.fromObject({ minutes: config[mode] }));
    setDuration(Duration.fromObject({ minutes: config[mode] }));
    setMode(mode); // Reset to initial mode
    setPomodoroCount(0); // Reset pomodoro count
  };

  return (
    <div className={`timer-wrap ${config.colorTheme === "black" ? "blackTheme" : ""}`}>
      <div className="timer-column">
        <div className="timer-buttons">
          <button className='action-button' onClick={() => changeMode('work')}
            style={{ ...mystyle, ...(mode === "work" ? selectedStyle : {}) }}>
            Pomodoro
          </button>
          <button className='action-button' onClick={() => changeMode('break')}
            style={{ ...mystyle, ...(mode === "break" ? selectedStyle : {}) }}>Short break</button>
          <button className='action-button' onClick={() => changeMode('longBreak')}
            style={{ ...mystyle, ...(mode === "longBreak" ? selectedStyle : {}) }}>Long break</button>
        </div>
        <div style={{ width: 200, height: 200, margin: "auto" }}>
          <CircularProgressbarWithChildren value={calculatePrecentage()} styles={{
            path: { stroke: config.buttonColor }
          }}>
            <div style={{ fontSize: 30, marginTop: -30 }}>
              <strong>{duration.toFormat('mm:ss')}</strong>
            </div>
          </CircularProgressbarWithChildren>
        </div>
        <div className="tomato"><Tomato color={config.colorTheme === "black" ? "#fff" : "#000"}></Tomato><span>{pomodoroCount}</span></div>
        <div className="timer-buttons">
          <button className="action-button small-icon-button" onClick={resetTimer} style={mystyle}>
            <Restart color={config.textColor} />
          </button>
          {!isActive ? (<button className="action-button small-icon-button" onClick={startTimer} style={mystyle}>
            <Start color={config.textColor} />
          </button>) : (<button className="action-button small-icon-button" onClick={pauseTimer} style={mystyle}>
            <Pause color={config.textColor} />
          </button>)}
        </div>
      </div>
    </div>
  )
}


export default PomodoroTimer
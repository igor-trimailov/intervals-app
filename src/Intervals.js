import React, { useState, useEffect, useRef } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { ProgressBar, Step } from "react-step-progress-bar";
import { PlayCircle } from "react-bootstrap-icons";
import { PauseCircle } from "react-bootstrap-icons";
import { StopCircle } from "react-bootstrap-icons";
import { ArrowRepeat } from "react-bootstrap-icons";
import "react-step-progress-bar/styles.css";
import "./Intervals.css";

const MIN_SETTING = 1;
const MAX_SETTING = 8;
const TOTAL_DURATION = 31;

const data = [
  {
    duration: 5, // 5
    intensity: 4,
  },
  {
    duration: 10, // 15
    intensity: 6,
  },
  {
    duration: 3, // 18
    intensity: 7,
  },
  {
    duration: 2, // 20
    intensity: 6,
  },
  {
    duration: 2, // 22
    intensity: 7,
  },
  {
    duration: 3, // 25
    intensity: 6,
  },
  {
    duration: 3, // 28
    intensity: 5,
  },
  {
    duration: 2, // 30
    intensity: 4,
  },
  {
    duration: 1, // 31
    intensity: 1,
  },
];

const colors = [
  "#007f00",
  "#189000",
  "#35a000",
  "#57af00",
  "#82bf00",
  "#afce00",
  "#ddda00",
  "#efc300",
];

function Intervals() {
  const [value, setValue] = useState(MIN_SETTING);
  const [idx, setIdx] = useState(0);
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [done, setDone] = useState(false);
  const [remainingDuration, setRemainingDuration] = useState(null);
  const [percentageComplete, setPercentageComplete] = useState(0);
  const timerRef = useRef(null);

  const handleReset = () => {
    setValue(MIN_SETTING);
    setIdx(0);
    setStart(null);
    setPause(null);
    setDone(false);
    setPercentageComplete(0);
  };

  useEffect(() => {
    // not started
    if (!start && !pause) {
      return;
    }

    // done
    if (idx >= data?.length) {
      setDone(true);
      return;
    }

    if (pause) {
      clearTimeout(timerRef.current);
      setRemainingDuration(Date.now() - start);
      return;
    }

    const intensity = data?.[idx]?.intensity;
    const duration = data?.[idx]?.duration * 1000 * 60 - remainingDuration;

    if (!value || !duration) {
      return;
    }

    setValue(intensity);

    timerRef.current = setTimeout(() => {
      const percentage = data.reduce((acc, it, i) => {
        return i <= idx
          ? acc + Math.ceil((it.duration * 100) / TOTAL_DURATION)
          : acc;
      }, 0);
      setPercentageComplete(percentage);

      setIdx((prev) => prev + 1);
      setRemainingDuration(0);
    }, duration);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [idx, start, pause, value, remainingDuration]);

  return (
    <div className="App" style={{ backgroundColor: `${colors[value - 1]}` }}>
      {!done && (
        <>
          <div
            className="control-icon"
            onClick={() => {
              if (!start) {
                setStart(Date.now());
                setPause(false);
              }

              // pause
              if (start && !pause) {
                setPause(true);
              }

              // resume
              if (start && pause) {
                setPause(false);
              }
            }}
          >
            {!start || pause ? <PlayCircle /> : <PauseCircle />}
          </div>
          <div className="container">
            <ReactSpeedometer
              value={value}
              minValue={MIN_SETTING}
              maxValue={MAX_SETTING}
              segments={MAX_SETTING}
              needleColor="blue"
              startColor="green"
              endColor="orange"
              currentValueText="Bike Setting"
              height={200}
            />
            <ProgressBar
              percent={percentageComplete}
              filledBackground="linear-gradient(to right, #007f00, #efc300)"
            >
              {Array(4)
                .fill(0)
                .map((_it, idx) => (
                  <Step transition="scale" key={`step_${idx}`}>
                    {({ accomplished }) => (
                      <img
                        alt="pichu"
                        style={{
                          filter: `grayscale(${accomplished ? 0 : 80}%)`,
                        }}
                        width="30"
                        src={process.env.PUBLIC_URL + "/pichu.webp"}
                      />
                    )}
                  </Step>
                ))}
            </ProgressBar>
          </div>
          <div className="control-icon" onClick={handleReset}>
            <StopCircle />
          </div>
        </>
      )}
      {done && (
        <div>
          <h2>WELL DONE!</h2>
          <div className="control-icon" onClick={handleReset}>
            <ArrowRepeat />
          </div>
        </div>
      )}
    </div>
  );
}

export default Intervals;

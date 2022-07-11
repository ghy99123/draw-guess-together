import React, { useEffect } from "react";
import useCountDown from "../../hooks/useCountDown";
import "./style.css";

export default function Countdown() {
  const coutdown = 60;

  const [start, remain] = useCountDown(coutdown);

  useEffect(() => {
    start();
  }, []);

  // console.log("re", remain);

  return (
    <div className="countdown-outer">
      <div
        className="countdown-inner"
        style={{ width: `${(remain / coutdown) * 100}%` }}
      ></div>
    </div>
  );
}

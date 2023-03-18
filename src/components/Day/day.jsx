import React from 'react';
import './day.css';

function Day(props) {
  return (
    <div className="day">
      <h4 className="title">{props.title}</h4>
      <img src={props.icon} alt="" />
      <p className="tempminmax">
        {props.maxTemp}° <span>{props.minTemp}°</span>
      </p>
    </div>
  );
}

export default Day;
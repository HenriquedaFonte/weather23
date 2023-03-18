import React from 'react';
import './stats.css'

function Stats(props) {
  return (
    <div className="stats">
      <img src={props.icon} alt={`${props.title} icon`} />
      <div className="stats-info">
        <p>{props.title}</p>
        <h5>
          {props.value} <span>{props.unit}</span>
        </h5>
      </div>
    </div>
  );
}

export default Stats;
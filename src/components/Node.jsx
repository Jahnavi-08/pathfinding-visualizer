import React from "react";
import "./Node.css";

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const extraClass = isStart
    ? "node-start"
    : isEnd
    ? "node-end"
    : isWall
    ? "node-wall"
    : "";

  return (
    <div
      className={`node ${extraClass}`}
      id={`node-${row}-${col}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    ></div>
  );
};

export default Node;
  

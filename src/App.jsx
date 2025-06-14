import React, { useState, useEffect } from "react";
import Node from "./components/Node";
import "./App.css";
import { dijkstra } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";
import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";

const START_NODE_ROW = 5;
const START_NODE_COL = 5;
const END_NODE_ROW = 15;
const END_NODE_COL = 35;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [algorithm, setAlgorithm] = useState("dijkstra");

  useEffect(() => {
    setGrid(getInitialGrid());
  }, []);

  const getInitialGrid = () => {
    const rows = 20;
    const cols = 50;
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isEnd: row === END_NODE_ROW && col === END_NODE_COL,
          isWall: false,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const handleMouseDown = (row, col) => {
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const toggleWall = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const visualizeAlgorithm = () => {
    const newGrid = grid.slice();
    const startNode = newGrid[START_NODE_ROW][START_NODE_COL];
    const endNode = newGrid[END_NODE_ROW][END_NODE_COL];

    let visitedNodesInOrder;
    switch (algorithm) {
      case "astar":
        visitedNodesInOrder = astar(newGrid, startNode, endNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(newGrid, startNode, endNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(newGrid, startNode, endNode);
        break;
      case "dijkstra":
      default:
        visitedNodesInOrder = dijkstra(newGrid, startNode, endNode);
        break;
    }

    animate(visitedNodesInOrder, endNode);
  };

  const animate = (nodesInOrder, endNode) => {
    for (let i = 0; i <= nodesInOrder.length; i++) {
      if (i === nodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(endNode);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = nodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = (endNode) => {
    const nodesInShortestPath = [];
    let current = endNode;
    while (current !== null) {
      nodesInShortestPath.unshift(current);
      current = current.previousNode;
    }

    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 40 * i);
    }
  };

  const resetGrid = () => {
    const newGrid = getInitialGrid();
    setGrid(newGrid);

    for (let row of newGrid) {
      for (let node of row) {
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (nodeElement) {
          nodeElement.className = "node";
          if (node.isStart) nodeElement.classList.add("node-start");
          if (node.isEnd) nodeElement.classList.add("node-end");
        }
      }
    }
  };

  const clearWalls = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => {
        const newNode = { ...node, isWall: false };
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) {
          el.classList.remove(
            "node-wall",
            "node-visited",
            "node-shortest-path"
          );
          if (newNode.isStart) el.classList.add("node-start");
          else if (newNode.isEnd) el.classList.add("node-end");
          else el.className = "node";
        }
        return newNode;
      })
    );
    setGrid(newGrid);
  };

  const getAlgorithmDescription = (algo) => {
    switch (algo) {
      case "dijkstra":
        return "Dijkstra: Weighted, guarantees shortest path.";
      case "astar":
        return "A*: Weighted, faster using heuristics.";
      case "bfs":
        return "BFS: Unweighted, guarantees shortest path.";
      case "dfs":
        return "DFS: Unweighted, may not give shortest path.";
      default:
        return "";
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h2>Pathfinding Visualizer</h2>
        <p className="description">{getAlgorithmDescription(algorithm)}</p>

        <div className="button-row">
          <button
            className="algo-btn dijkstra"
            onClick={() => setAlgorithm("dijkstra")}
          >
            Dijkstra
          </button>
          <button
            className="algo-btn astar"
            onClick={() => setAlgorithm("astar")}
          >
            A*
          </button>
          <button className="algo-btn bfs" onClick={() => setAlgorithm("bfs")}>
            BFS
          </button>
          <button className="algo-btn dfs" onClick={() => setAlgorithm("dfs")}>
            DFS
          </button>
          <button className="visualize-btn" onClick={visualizeAlgorithm}>
            Visualize {algorithm}
          </button>
        </div>

        <div className="button-row secondary">
          <button className="reset-btn" onClick={resetGrid}>
            Reset Grid
          </button>
          <button className="clear-btn" onClick={clearWalls}>
            Clear Walls
          </button>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="row">
              {row.map((node, nodeIdx) => (
                <Node
                  key={nodeIdx}
                  row={node.row}
                  col={node.col}
                  isStart={node.isStart}
                  isEnd={node.isEnd}
                  isWall={node.isWall}
                  onMouseDown={() => handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                  onMouseUp={handleMouseUp}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

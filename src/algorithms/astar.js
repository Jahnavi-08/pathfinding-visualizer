export function astar(grid, startNode, endNode) {
  const openSet = [startNode];
  startNode.distance = 0;
  startNode.f = heuristic(startNode, endNode);

  const visitedNodesInOrder = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (current.isWall) continue;
    if (current === endNode) return visitedNodesInOrder;

    current.isVisited = true;
    visitedNodesInOrder.push(current);

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const tempG = current.distance + 1;
      if (tempG < neighbor.distance) {
        neighbor.distance = tempG;
        neighbor.f = neighbor.distance + heuristic(neighbor, endNode);
        neighbor.previousNode = current;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

function heuristic(a, b) {
  const dx = Math.abs(a.row - b.row);
  const dy = Math.abs(a.col - b.col);
  return dx + dy;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n.isVisited);
}

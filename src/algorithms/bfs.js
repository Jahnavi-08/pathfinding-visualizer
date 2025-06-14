export function bfs(grid, startNode, endNode) {
  const queue = [startNode];
  startNode.isVisited = true;

  const visitedNodesInOrder = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node.isWall) continue;
    visitedNodesInOrder.push(node);

    if (node === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = node;
        queue.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
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

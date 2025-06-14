export function dfs(grid, startNode, endNode) {
  const stack = [startNode];
  startNode.isVisited = true;

  const visitedNodesInOrder = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.isWall) continue;
    visitedNodesInOrder.push(node);

    if (node === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = node;
        stack.push(neighbor);
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

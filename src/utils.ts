import { Group, IPointObject, IPointTuple } from "./interfaces";
import { staticDataTyped } from "./EurovisionTable/EurovisionTable";

export function getCellForGroup(group: Group) {
  const cell = staticDataTyped.find(cell => compareGroups(group, cell.group));
  if (!cell) {
    // we may return default value here
    throw new Error("Unexpected hole");
  }
  return cell;
}

function compareGroups(groupA: Group, groupB: Group) {
  return groupA[0][1] === groupB[0][1] && groupA[1][1] === groupB[1][1];
}

export function pointTupleToObject([
  x,
  y,
  columnsCount,
  rowsCount
]: IPointTuple): IPointObject {
  return { x, y, columnsCount, rowsCount };
}

export function pointObjectToTuple({
  x,
  y,
  columnsCount,
  rowsCount
}: IPointObject): IPointTuple {
  return [x, y, columnsCount, rowsCount];
}

export function toDataPointSpace(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
): IPointTuple {
  return [x - 1, y - 1, columnsCount - 2, rowsCount - 2];
}

export function isNorthWest(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  const args = [x, y, columnsCount, rowsCount] as const;
  return isColumnHeader(...args) && isRowStarter(...args);
}

export function isNorthEast(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  const args = [x, y, columnsCount, rowsCount] as const;
  return isColumnHeader(...args) && isRowEnder(...args);
}

export function isSouthWest(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  const args = [x, y, columnsCount, rowsCount] as const;
  return isColumnFooter(...args) && isRowStarter(...args);
}

export function isSouthEast(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  const args = [x, y, columnsCount, rowsCount] as const;
  return isColumnFooter(...args) && isRowEnder(...args);
}

export function isColumnHeader(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  return y === 0;
}

export function isColumnFooter(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  return y === rowsCount - 1;
}

export function isRowStarter(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  return x === 0;
}

export function isRowEnder(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  return x === columnsCount - 1;
}

export function isEdgeComponent(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  return (
    isColumnHeader(x, y, columnsCount, rowsCount) ||
    isColumnFooter(x, y, columnsCount, rowsCount) ||
    isRowStarter(x, y, columnsCount, rowsCount) ||
    isRowEnder(x, y, columnsCount, rowsCount)
  );
}

export function isCornerCell(
  x: number,
  y: number,
  columnsCount: number,
  rowsCount: number
) {
  return (
    isNorthWest(x, y, columnsCount, rowsCount) ||
    isNorthEast(x, y, columnsCount, rowsCount) ||
    isSouthWest(x, y, columnsCount, rowsCount) ||
    isSouthEast(x, y, columnsCount, rowsCount)
  );
}

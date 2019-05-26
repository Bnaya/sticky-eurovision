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

export function toDataObjectPointSpace(point: IPointObject): IPointObject {
  return {
    x: point.x - 1,
    y: point.y - 1,
    columnsCount: point.columnsCount - 2,
    rowsCount: point.rowsCount - 2
  };
}

export function isNorthWest(point: IPointObject) {
  return isColumnHeader(point) && isRowStarter(point);
}

export function isNorthEast(point: IPointObject) {
  return isColumnHeader(point) && isRowEnder(point);
}

export function isSouthWest(point: IPointObject) {
  return isColumnFooter(point) && isRowStarter(point);
}

export function isSouthEast(point: IPointObject) {
  return isColumnFooter(point) && isRowEnder(point);
}

export function isColumnHeader(point: IPointObject) {
  return point.y === 0;
}

export function isColumnFooter(point: IPointObject) {
  return point.y === point.rowsCount - 1;
}

export function isRowStarter(point: IPointObject) {
  return point.x === 0;
}

export function isRowEnder(point: IPointObject) {
  return point.x === point.columnsCount - 1;
}

export function isEdgeComponent(point: IPointObject) {
  return (
    isColumnHeader(point) ||
    isColumnFooter(point) ||
    isRowStarter(point) ||
    isRowEnder(point)
  );
}

export function isCornerCell(point: IPointObject) {
  return (
    isNorthWest(point) ||
    isNorthEast(point) ||
    isSouthWest(point) ||
    isSouthEast(point)
  );
}

// function getClassnamesForPoint(...point: IPointTuple): string {
//   if (isNorthWest(...point)) {
//     return style.cellInLeftTopCorner;
//   }

//   if (isNorthEast(...point)) {
//     return style.cellInRightTopCorner;
//   }

//   if (isSouthWest(...point)) {
//     return style.cellInLeftBottomCorner;
//   }

//   if (isSouthEast(...point)) {
//     return style.cellInRightBottomCorner;
//   }

//   return style.regularCell;
// }

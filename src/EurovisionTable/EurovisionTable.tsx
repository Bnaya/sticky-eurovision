import React, { CSSProperties } from "react";
import { hot } from "react-hot-loader/root";
import { IDateEntry, IPointTuple } from "../interfaces";
import staticData from "../staticData.json";
import style from "./EurovisionTable.module.css";
import { countriesList } from "../countriesList";
import {
  isNorthWest,
  isNorthEast,
  isSouthWest,
  isSouthEast,
  getCellForGroup,
  isCornerCell,
  toDataPointSpace,
  isRowEnder,
  isRowStarter,
  isColumnFooter,
  isColumnHeader,
  pointTupleToObject,
  pointObjectToTuple
} from "../utils";

export const staticDataTyped: IDateEntry[] = staticData as IDateEntry[];

export function EurovisionTable() {
  return (
    <div className={style.wrapper}>
      <div
        className={style.grid}
        style={
          {
            // not working?
            // "--row-length": `${countriesList.length}`
          } as CSSProperties
        }
      >
        {renderCells()}
      </div>
    </div>
  );
}

function renderCells() {
  const toReturn: Array<JSX.Element> = [];
  const columnsCounts = countriesList.length + 2;
  const rowsCount = countriesList.length + 2;

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const rowCells: Array<JSX.Element> = [];
    for (let columnIndex = 0; columnIndex < columnsCounts; columnIndex++) {
      rowCells.push(
        cellReactElement(columnIndex, rowIndex, columnsCounts, rowsCount)
      );
    }
    toReturn.push(
      <div key={`row-${rowIndex}`} data-key={`row-${rowIndex}`}>
        {rowCells}
      </div>
    );
  }

  return toReturn;
}

function cellReactElement(...[x, y, columnsCount, rowsCount]: IPointTuple) {
  if (isCornerCell(...([x, y, columnsCount, rowsCount] as const))) {
    return <CornerComponent />;
  }

  const pointInDataCellsSpace = pointTupleToObject(
    toDataPointSpace(...([x, y, columnsCount, rowsCount] as const))
  );

  if (
    isRowEnder(...([x, y, columnsCount, rowsCount] as const)) ||
    isRowStarter(...([x, y, columnsCount, rowsCount] as const))
  ) {
    return (
      <EdgeComponent
        name={countriesList[pointInDataCellsSpace.y].name}
        isoCode={countriesList[pointInDataCellsSpace.y].isoCode}
      />
    );
  }

  if (
    isColumnHeader(...([x, y, columnsCount, rowsCount] as const)) ||
    isColumnFooter(...([x, y, columnsCount, rowsCount] as const))
  ) {
    return (
      <EdgeComponent
        name={countriesList[pointInDataCellsSpace.x].name}
        isoCode={countriesList[pointInDataCellsSpace.x].isoCode}
      />
    );
  }

  // return (
  //   <div className={style.regularCell}>
  //     {x}-{y}
  //   </div>
  // );

  return dataCellReactElement(...pointObjectToTuple(pointInDataCellsSpace));
}

function CornerComponent() {
  return (
    <div className={style.baseHeaderFooterStarterEnder}>
      <span>Score By:</span>
      <span>Score To:</span>
    </div>
  );
}

function EdgeComponent({ name, isoCode }: { name: string; isoCode: string }) {
  return (
    <div
      title={name}
      className={style.baseHeaderFooterStarterEnder}
      style={{
        backgroundImage: `url(https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${isoCode}.svg)`
      }}
    >
      {name}
    </div>
  );
}

function dataCellReactElement(...[x, y, columnsCount, rowsCount]: IPointTuple) {
  const dataCell = getCellForGroup([
    ["receiving", countriesList[y].isoCode],
    ["giving", countriesList[x].isoCode]
  ]);
  return (
    <div data-key={`${x}-${y}`} key={`${x}-${y}`} className={style.regularCell}>
      {dataCell.value}
    </div>
  );
}

function getClassnamesForPoint(...point: IPointTuple): string {
  if (isNorthWest(...point)) {
    return style.cellInLeftTopCorner;
  }

  if (isNorthEast(...point)) {
    return style.cellInRightTopCorner;
  }

  if (isSouthWest(...point)) {
    return style.cellInLeftBottomCorner;
  }

  if (isSouthEast(...point)) {
    return style.cellInRightBottomCorner;
  }

  return style.regularCell;
}

export const EurovisionTableHot = hot(EurovisionTable);

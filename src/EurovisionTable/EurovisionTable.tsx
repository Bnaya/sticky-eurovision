import React, { CSSProperties } from "react";
import { hot } from "react-hot-loader/root";
import { IDateEntry, IPointObject } from "../interfaces";
import staticData from "../staticData.json";
import style from "./EurovisionTable.module.css";
import { countriesList } from "../countriesList";
import {
  // isNorthWest,
  // isNorthEast,
  // isSouthWest,
  // isSouthEast,
  getCellForGroup,
  isCornerCell,
  isRowEnder,
  isRowStarter,
  isColumnFooter,
  isColumnHeader,
  toDataObjectPointSpace
} from "../utils";

export const staticDataTyped: IDateEntry[] = staticData as IDateEntry[];

export function EurovisionTable() {
  return (
    <div className={style.wrapper}>
      <div className={style.grid} style={{} as CSSProperties}>
        {renderCells()}
      </div>
    </div>
  );
}

function renderCells() {
  const toReturn: Array<JSX.Element> = [];
  const columnsCount = countriesList.length + 2;
  const rowsCount = countriesList.length + 2;

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const rowCells: Array<JSX.Element> = [];
    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      rowCells.push(
        cellReactElement({
          x: columnIndex,
          y: rowIndex,
          columnsCount,
          rowsCount
        })
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

function cellReactElement(point: IPointObject) {
  if (isCornerCell(point)) {
    return <CornerComponent />;
  }

  const pointInDataCellsSpace = toDataObjectPointSpace(point);

  if (isRowEnder(point) || isRowStarter(point)) {
    return (
      <EdgeComponent
        name={countriesList[pointInDataCellsSpace.y].name}
        isoCode={countriesList[pointInDataCellsSpace.y].isoCode}
      />
    );
  }

  if (isColumnHeader(point) || isColumnFooter(point)) {
    return (
      <EdgeComponent
        name={countriesList[pointInDataCellsSpace.x].name}
        isoCode={countriesList[pointInDataCellsSpace.x].isoCode}
      />
    );
  }

  return dataCellReactElement(pointInDataCellsSpace);
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

function dataCellReactElement(point: IPointObject) {
  const dataCell = getCellForGroup([
    ["receiving", countriesList[point.y].isoCode],
    ["giving", countriesList[point.x].isoCode]
  ]);
  return (
    <div
      data-key={`${point.x}-${point.y}`}
      key={`${point.x}-${point.y}`}
      className={style.regularCell}
    >
      {dataCell.value}
    </div>
  );
}

export const EurovisionTableHot = hot(EurovisionTable);

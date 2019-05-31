import React, { CSSProperties } from "react";
import { IPointObject, IPointObjectInGlobalSpace } from "../common/interfaces";
import style from "./FullyStickyTable.module.css";
import {
  countriesTheFinal,
  isoCodeToName,
  countriesThatGiveScore
} from "../common/countriesList";
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
  toDataObjectPointSpace,
  isNorthWest,
  isNorthEast,
  isSouthWest,
  isSouthEast
} from "../common/utils";
import classNames from "classnames";

export function FullyStickyTable() {
  return (
    <div className={style.wrapper}>
      <div
        className={style.grid}
        style={
          {
            "--rowsCount": `${countriesTheFinal.length + 2}`,
            "--columnsCount": `${countriesThatGiveScore.length + 2}`,
            "--cellWidthHeight": 100 + "px"
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
  const columnsCount = countriesThatGiveScore.length + 2;
  const rowsCount = countriesTheFinal.length + 2;

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const rowCells: Array<JSX.Element> = [];
    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      rowCells.push(
        cellReactElement({
          space: "global",
          x: columnIndex,
          y: rowIndex,
          columnsCount,
          rowsCount
        })
      );
    }
    toReturn.push(
      <div
        key={`row-${rowIndex}`}
        data-key={`row-${rowIndex}`}
        className={classNames(style.rowWrapper, {
          [style.firstRowWrapper]: rowIndex === 0,
          [style.lastRowWrapper]: rowIndex === rowsCount - 1,
          [style.oddRow]: rowIndex % 2 > 0,
          [style.evenRow]: rowIndex % 2 === 0
        })}
      >
        {rowCells}
      </div>
    );
  }

  return toReturn;
}

function cellReactElement(point: IPointObjectInGlobalSpace) {
  const className = getClassnamesForPoint(point);

  if (isCornerCell(point)) {
    return (
      <CornerComponent key={`${point.x}-${point.x}`} className={className} />
    );
  }

  const pointInDataCellsSpace = toDataObjectPointSpace(point);

  if (isRowEnder(point) || isRowStarter(point)) {
    const isoCode = countriesTheFinal[point.y];
    return (
      <EdgeComponent
        key={`${point.x}-${point.x}`}
        className={className}
        name={isoCodeToName[isoCode]}
        isoCode={isoCode}
      />
    );
  }

  if (isColumnHeader(point) || isColumnFooter(point)) {
    const isoCode = countriesThatGiveScore[pointInDataCellsSpace.x];
    return (
      <EdgeComponent
        key={`${point.x}-${point.x}`}
        className={className}
        name={isoCodeToName[isoCode]}
        isoCode={isoCode}
      />
    );
  }

  return dataCellReactElement(pointInDataCellsSpace);
}

function CornerComponent({ className }: { className: string }) {
  return <div className={className} />;
}

function EdgeComponent({
  name,
  isoCode,
  className
}: {
  name: string;
  isoCode: string;
  className: string;
}) {
  return (
    <div
      title={name}
      className={className}
      style={{
        backgroundImage: `url(https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${isoCode}.svg)`
      }}
    >
      {name}
    </div>
  );
}

function dataCellReactElement(pointInDataSpace: IPointObject) {
  const dataCell = getCellForGroup([
    ["receiving", countriesTheFinal[pointInDataSpace.y]],
    ["giving", countriesThatGiveScore[pointInDataSpace.x]]
  ]);
  return (
    <div
      data-key={`data-cell-${pointInDataSpace.x}-${pointInDataSpace.y}`}
      key={`data-cell-${pointInDataSpace.x}-${pointInDataSpace.y}`}
      className={classNames(style.regularCell, {
        [style.oddRow]: pointInDataSpace.y % 2 > 0,
        [style.evenRow]: pointInDataSpace.y % 2 === 0,
        [style.oddColumn]: pointInDataSpace.x % 2 > 0,
        [style.evenColumn]: pointInDataSpace.x % 2 === 0
      })}
    >
      {dataCell.value}
    </div>
  );
}

function getClassnamesForPoint(pointInGlobalSpace: IPointObject): string {
  if (isNorthWest(pointInGlobalSpace)) {
    return style.cellInLeftTopCorner;
  }

  if (isNorthEast(pointInGlobalSpace)) {
    return style.cellInRightTopCorner;
  }

  if (isSouthWest(pointInGlobalSpace)) {
    return style.cellInLeftBottomCorner;
  }

  if (isSouthEast(pointInGlobalSpace)) {
    return style.cellInRightBottomCorner;
  }

  if (isRowStarter(pointInGlobalSpace)) {
    return style.cellInFirstColumn;
  }

  if (isRowEnder(pointInGlobalSpace)) {
    return style.cellInLastColumn;
  }

  if (isColumnHeader(pointInGlobalSpace)) {
    return style.cellInFirstRow;
  }

  if (isColumnFooter(pointInGlobalSpace)) {
    return style.cellInLastRow;
  }

  return style.regularCell;
}

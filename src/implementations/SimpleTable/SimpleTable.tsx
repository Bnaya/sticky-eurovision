import React, { useCallback } from "react";
import { IPointObject } from "../common/interfaces";
import style from "./SimpleTable.module.scss";
import { isoCodeToName } from "../common/countriesList";
import {
  // isNorthWest,
  // isNorthEast,
  // isSouthWest,
  // isSouthEast,
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
import { useCellData, useEdgeControls, useDataPlot } from "../common/hooks";

export function SimpleTable() {
  return (
    <div className={style.scrollablePart}>
      <table
        className={classNames(style.grid, {
          [style.activateStickiness]: false
        })}
      >
        <tbody>
          <RenderCells />
        </tbody>
      </table>
    </div>
  );
}

function RenderCells() {
  const { countriesGivingScore, countriesInTheFinal } = useDataPlot();
  const toReturn: Array<JSX.Element> = [];
  const columnsCount = countriesGivingScore.length + 2;
  const rowsCount = countriesInTheFinal.length + 2;

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const rowCells: Array<JSX.Element> = [];
    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      rowCells.push(
        <CellOfAnyKind
          key={`${rowIndex}-${columnIndex}`}
          data-key={`${rowIndex}-${columnIndex}`}
          {...{
            x: columnIndex,
            y: rowIndex,
            columnsCount,
            rowsCount
          }}
        />
      );
    }
    toReturn.push(
      <tr
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
      </tr>
    );
  }

  return <>{toReturn}</>;
}

function CellOfAnyKind(point: IPointObject) {
  const className = getClassnamesForPoint(point);
  const { countriesInTheFinal, countriesGivingScore } = useDataPlot();

  if (isCornerCell(point)) {
    return (
      <CornerComponent key={`${point.x}-${point.x}`} className={className} />
    );
  }

  const pointInDataCellsSpace = toDataObjectPointSpace(point);

  if (isRowEnder(point) || isRowStarter(point)) {
    const isoCode = countriesInTheFinal[pointInDataCellsSpace.y];
    return (
      <EdgeComponent
        key={`${point.x}-${point.x}`}
        className={className}
        name={isoCodeToName[isoCode]}
        isoCode={isoCode}
        side={isRowStarter(point) ? "left" : "right"}
      />
    );
  }

  if (isColumnHeader(point) || isColumnFooter(point)) {
    const isoCode = countriesGivingScore[pointInDataCellsSpace.x];
    return (
      <EdgeComponent
        key={`${point.x}-${point.x}`}
        className={className}
        name={isoCodeToName[isoCode]}
        isoCode={isoCode}
        side={isColumnHeader(point) ? "top" : "bottom"}
      />
    );
  }

  return (
    <DataCellComponent
      key={`${point.x}-${point.x}`}
      {...pointInDataCellsSpace}
    />
  );
}

function CornerComponent({ className }: { className: string }) {
  return <td className={className} />;
}

function EdgeComponent({
  name,
  isoCode,
  className,
  side
}: {
  name: string;
  isoCode: string;
  className: string;
  side: "top" | "right" | "bottom" | "left";
}) {
  const {
    toggleSortGivingByReceiver,
    toggleSortReceivingByGiver
  } = useEdgeControls();
  const onClick = useCallback(() => {
    if (side === "top" || side === "bottom") {
      toggleSortReceivingByGiver(isoCode);
    } else {
      toggleSortGivingByReceiver(isoCode);
    }
  }, [isoCode, side, toggleSortGivingByReceiver, toggleSortReceivingByGiver]);
  return (
    <td
      title={name}
      className={className}
      style={{
        backgroundImage: `url(https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${isoCode}.svg)`
      }}
      onClick={onClick}
    >
      {name}
    </td>
  );
}

function DataCellComponent(pointInDataSpace: IPointObject) {
  const dataCell = useCellData(pointInDataSpace.x, pointInDataSpace.y);

  return (
    <td
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
    </td>
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

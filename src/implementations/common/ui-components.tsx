import React from "react";
import style from "./ui-components.module.scss";
import {
  IPointObject,
  IPointObjectInGlobalSpace,
  IPointObjectInDataSpace
} from "./interfaces";
import { useCellData, useDataPlot } from "./hooks";
import { useCallback } from "react";
import classNames from "classnames";
import { isoCodeToName } from "./countriesList";
import {
  isCornerCell,
  toDataObjectPointSpace,
  isRowEnder,
  isRowStarter,
  isColumnHeader,
  isColumnFooter,
  isNorthWest,
  isNorthEast,
  isSouthWest,
  isSouthEast
} from "./utils";

export function keyProviderDataAware(
  point: IPointObjectInGlobalSpace,
  rowsData: string[],
  columnData: string[]
) {
  const maybeTheCorner = isCornerCell(point);

  if (maybeTheCorner) {
    return `corner-${maybeTheCorner}`;
  }

  if (isRowStarter(point)) {
    return `row-starter-${rowsData[point.y]}`;
  }

  if (isRowEnder(point)) {
    return `row-ender-${rowsData[point.y]}`;
  }

  if (isColumnHeader(point)) {
    return `column-header-${columnData[point.x]}`;
  }

  if (isColumnFooter(point)) {
    return `column-footer-${columnData[point.x]}`;
  }

  const pointInDataCellsSpace = toDataObjectPointSpace(point);
  return `cell-${columnData[pointInDataCellsSpace.x]}-${
    rowsData[pointInDataCellsSpace.y]
  }`;
}

export function keyProvider(point: IPointObjectInGlobalSpace) {
  const maybeTheCorner = isCornerCell(point);

  if (maybeTheCorner) {
    return `corner-${maybeTheCorner}`;
  }

  if (isRowStarter(point)) {
    return `row-starter-${point.y}`;
  }

  if (isRowEnder(point)) {
    return `row-ender-${point.y}`;
  }

  if (isColumnHeader(point)) {
    return `column-header-${point.x}`;
  }

  if (isColumnFooter(point)) {
    return `column-footer-${point.x}`;
  }

  const pointInDataCellsSpace = toDataObjectPointSpace(point);
  return `cell-${pointInDataCellsSpace.x}-${pointInDataCellsSpace.y}`;
}

export const CellVisualComponentChooser = React.memo(
  function CellVisualComponentChooser(point: IPointObjectInGlobalSpace) {
    const maybeTheCorner = isCornerCell(point);
    const pointInDataCellsSpace = toDataObjectPointSpace(point);

    if (maybeTheCorner) {
      return <CornerComponent corner={maybeTheCorner} />;
    }

    if (isRowEnder(point) || isRowStarter(point)) {
      return (
        <EdgeComponent
          rowOrColumnIndex={pointInDataCellsSpace.y}
          side={isRowStarter(point) ? "left" : "right"}
        />
      );
    }

    if (isColumnHeader(point) || isColumnFooter(point)) {
      return (
        <EdgeComponent
          rowOrColumnIndex={pointInDataCellsSpace.x}
          side={isColumnHeader(point) ? "top" : "bottom"}
        />
      );
    }

    return <DataCellComponent {...pointInDataCellsSpace} />;
  }
);

export const CornerComponent = React.memo(function CornerComponent({
  corner
}: {
  corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}) {
  return (
    <div
      className={classNames({
        [style.cellInLeftTopCorner]: corner === "topLeft",
        [style.cellInRightTopCorner]: corner === "topRight",
        [style.cellInLeftBottomCorner]: corner === "bottomLeft",
        [style.cellInRightBottomCorner]: corner === "bottomRight"
      })}
    />
  );
});

export const EdgeComponent = React.memo(function EdgeComponent({
  side,
  rowOrColumnIndex
}: {
  side: "top" | "right" | "bottom" | "left";
  rowOrColumnIndex: number;
}) {
  const {
    countriesInTheFinal,
    countriesGivingScore,
    toggleSortGivingByReceiver,
    toggleSortReceivingByGiver,
    sortGivingByReceiver,
    sortReceivingByGiver
  } = useDataPlot();

  const effectiveList =
    side === "top" || side === "bottom"
      ? countriesGivingScore
      : countriesInTheFinal;
  const isoCode = effectiveList[rowOrColumnIndex];
  const name = isoCodeToName[isoCode];

  const onClick = useCallback(() => {
    if (side === "top" || side === "bottom") {
      toggleSortReceivingByGiver(isoCode);
    } else {
      toggleSortGivingByReceiver(isoCode);
    }
  }, [isoCode, side, toggleSortGivingByReceiver, toggleSortReceivingByGiver]);

  return (
    <div
      title={name}
      className={classNames({
        [style.cellInFirstRow]: side === "top",
        [style.cellInLastRow]: side === "bottom",
        [style.cellInFirstColumn]: side === "left",
        [style.cellInLastColumn]: side === "right",
        [style.sort_active]:
          sortReceivingByGiver && sortReceivingByGiver.country === isoCode,
        [style.sort_givingAsc]:
          side === "top" &&
          sortReceivingByGiver &&
          sortReceivingByGiver.country === isoCode &&
          sortReceivingByGiver.direction === "asc",
        [style.sort_givingDesc]:
          side === "top" &&
          sortReceivingByGiver &&
          sortReceivingByGiver.country === isoCode &&
          sortReceivingByGiver.direction === "desc",
        [style.sort_receivingAsc]:
          side === "left" &&
          sortGivingByReceiver &&
          sortGivingByReceiver.country === isoCode &&
          sortGivingByReceiver.direction === "asc",
        [style.sort_receivingDesc]:
          side === "left" &&
          sortGivingByReceiver &&
          sortGivingByReceiver.country === isoCode &&
          sortGivingByReceiver.direction === "desc"
      })}
      style={{
        backgroundImage: `url(https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${isoCode}.svg)`
      }}
      onClick={onClick}
    >
      {name}
    </div>
  );
});

export const DataCellComponent = React.memo(function DataCellComponent(
  pointInDataSpace: IPointObjectInDataSpace
) {
  const dataCell = useCellData(pointInDataSpace.x, pointInDataSpace.y);
  // const key = `${dataCell.group[0][1]}-${dataCell.group[1][1]}`;
  return (
    <div
      className={classNames(style.regularCell, {
        [style.oddRow]: pointInDataSpace.y % 2 > 0,
        [style.evenRow]: pointInDataSpace.y % 2 === 0,
        [style.oddColumn]: pointInDataSpace.x % 2 > 0,
        [style.evenColumn]: pointInDataSpace.x % 2 === 0
      })}
      title={`receiving: ${dataCell.receiving} - giving: ${dataCell.giving}`}
    >
      {dataCell.value}
    </div>
  );
});

export function getSpecialSlugForPoint(
  pointInGlobalSpace: IPointObject
):
  | "cellInLeftTopCorner"
  | "cellInRightTopCorner"
  | "cellInLeftBottomCorner"
  | "cellInRightBottomCorner"
  | "cellInFirstColumn"
  | "cellInLastColumn"
  | "cellInFirstRow"
  | "cellInLastRow"
  | "regularCell" {
  if (isNorthWest(pointInGlobalSpace)) {
    return "cellInLeftTopCorner";
  }

  if (isNorthEast(pointInGlobalSpace)) {
    return "cellInRightTopCorner";
  }

  if (isSouthWest(pointInGlobalSpace)) {
    return "cellInLeftBottomCorner";
  }

  if (isSouthEast(pointInGlobalSpace)) {
    return "cellInRightBottomCorner";
  }

  if (isRowStarter(pointInGlobalSpace)) {
    return "cellInFirstColumn";
  }

  if (isRowEnder(pointInGlobalSpace)) {
    return "cellInLastColumn";
  }

  if (isColumnHeader(pointInGlobalSpace)) {
    return "cellInFirstRow";
  }

  if (isColumnFooter(pointInGlobalSpace)) {
    return "cellInLastRow";
  }

  return "regularCell";
}

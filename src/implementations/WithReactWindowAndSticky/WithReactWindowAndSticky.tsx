import React, { useRef, CSSProperties } from "react";
import style from "./WithReactWindowAndSticky.module.scss";
import { useDataPlot, useBoundingClientRect } from "../common/hooks";
import {
  getSpecialSlugForPoint,
  CellVisualComponentChooser
} from "../common/ui-components";
import { IPointObjectInGlobalSpace } from "../common/interfaces";

// @ts-ignore
import { FixedSizeGrid as FixedSizeGridWithoutTypes } from "sticky-react-window";

import classNames from "classnames";
const FixedSizeGrid: typeof import("react-window").FixedSizeGrid = FixedSizeGridWithoutTypes;

export function WithReactWindowAndSticky() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { countriesGivingScore, countriesInTheFinal } = useDataPlot();
  const rect = useBoundingClientRect(containerRef) || { height: 0, width: 0 };
  return (
    <div
      className={style.gridWrapper}
      style={{
        width: "100%",
        height: "100%",
        // @ts-ignore
        "--rowsCount": countriesInTheFinal.length + 2,
        // @ts-ignore
        "--columnsCount": countriesGivingScore.length + 2
      }}
      ref={containerRef}
    >
      <FixedSizeGrid
        className={classNames("reactWindowElement", style.reactWindowElement)}
        columnCount={countriesGivingScore.length + 2}
        columnWidth={100}
        height={rect.height}
        rowCount={countriesInTheFinal.length + 2}
        rowHeight={100}
        width={rect.width}
        overscanCount={2}
        itemKey={itemKeyProvider}
      >
        {GridCell}
      </FixedSizeGrid>
    </div>
  );
}

function itemKeyProvider(item: {
  rowIndex: number;
  columnIndex: number;
  data: any;
  itemsRenderedCallbackParams?: ItemsRenderedCallbackParams;
}) {
  if (!item.itemsRenderedCallbackParams) {
    throw new Error("Not using react window fork???");
  }

  let rowPart = `${item.rowIndex}`;
  let columnPart = `${item.columnIndex}`;

  if (
    item.rowIndex === item.itemsRenderedCallbackParams.overscanRowStartIndex
  ) {
    rowPart = `first-rendered-row`;
  } else if (
    item.rowIndex === item.itemsRenderedCallbackParams.overscanRowStopIndex
  ) {
    rowPart = `last-rendered-row`;
  }

  if (
    item.columnIndex ===
    item.itemsRenderedCallbackParams.overscanColumnStartIndex
  ) {
    columnPart = `first-rendered-column`;
  } else if (
    item.columnIndex ===
    item.itemsRenderedCallbackParams.overscanColumnStopIndex
  ) {
    columnPart = `last-rendered-column`;
  }

  return `${rowPart}:${columnPart}`;
}

const GridCell = function GridCell(
  props: import("react-window").GridChildComponentProps & {
    itemsRenderedCallbackParams?: ItemsRenderedCallbackParams;
  }
) {
  if (!props.itemsRenderedCallbackParams) {
    throw new Error("Not using react window fork???");
  }

  const plotData = useDataPlot();
  const pointInGlobalSpace: IPointObjectInGlobalSpace = {
    space: "global",
    x: props.columnIndex,
    y: props.rowIndex,
    rowsCount: plotData.countriesInTheFinal.length + 2,
    columnsCount: plotData.countriesGivingScore.length + 2
  };

  const maybeTransformed = transformIfSpecialPoint(
    pointInGlobalSpace,
    props.itemsRenderedCallbackParams
  );

  const cellSlugInGlobalSpace = getSpecialSlugForPoint(maybeTransformed);

  const forGridCss: CSSProperties = {};

  forGridCss.gridArea = `${maybeTransformed.y + 1} / ${maybeTransformed.x +
    1} / ${maybeTransformed.y + 2} / ${maybeTransformed.x + 2}`;

  return (
    <div
      style={forGridCss}
      className={style["layout_" + cellSlugInGlobalSpace]}
    >
      <CellVisualComponentChooser {...maybeTransformed} />
    </div>
  );
};

// itemsRenderedCallbackParams
interface ItemsRenderedCallbackParams {
  overscanColumnStartIndex: number;
  overscanColumnStopIndex: number;
  overscanRowStartIndex: number;
  overscanRowStopIndex: number;
  visibleColumnStartIndex: number;
  visibleColumnStopIndex: number;
  visibleRowStartIndex: number;
  visibleRowStopIndex: number;
}

function transformIfSpecialPoint(
  pointInGlobalSpace: IPointObjectInGlobalSpace,
  itemsRenderedCallbackParams: ItemsRenderedCallbackParams
): IPointObjectInGlobalSpace {
  let x = pointInGlobalSpace.x;
  let y = pointInGlobalSpace.y;

  if (
    pointInGlobalSpace.x ===
    itemsRenderedCallbackParams.overscanColumnStartIndex
  ) {
    x = 0;
  } else if (
    pointInGlobalSpace.x === itemsRenderedCallbackParams.overscanColumnStopIndex
  ) {
    x = pointInGlobalSpace.columnsCount - 1;
  }

  if (
    pointInGlobalSpace.y === itemsRenderedCallbackParams.overscanRowStartIndex
  ) {
    y = 0;
  } else if (
    pointInGlobalSpace.y === itemsRenderedCallbackParams.overscanRowStopIndex
  ) {
    y = pointInGlobalSpace.rowsCount - 1;
  }

  return { ...pointInGlobalSpace, x, y };
}

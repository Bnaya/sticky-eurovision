import React, { useRef, useEffect } from "react";
import { useDataPlot, useBoundingClientRect } from "../common/hooks";
import { CellVisualComponentChooser } from "../common/ui-components";
import { IPointObjectInGlobalSpace } from "../common/interfaces";

import style from "./WithReactWindowDOMReuse.module.scss";

// @ts-ignore
import {
  FixedSizeGrid as FixedSizeGridWithoutTypes,
  areEqual
  // @ts-ignore
} from "sticky-react-window";

const FixedSizeGrid: typeof import("react-window").FixedSizeGrid = FixedSizeGridWithoutTypes;

export function WithReactWindowDomReuse() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { countriesGivingScore, countriesInTheFinal } = useDataPlot();
  const rect = useBoundingClientRect(containerRef) || { height: 0, width: 0 };
  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
      ref={containerRef}
    >
      <FixedSizeGrid
        columnCount={countriesGivingScore.length + 2}
        columnWidth={100}
        height={rect.height}
        rowCount={countriesInTheFinal.length + 2}
        rowHeight={100}
        width={rect.width}
        overscanColumnsCount={2}
        overscanRowsCount={2}
        itemKey={itemKeyProvider}
      >
        {GridCell}
      </FixedSizeGrid>
    </div>
  );
}

const GridCell = React.memo(function GridCell(
  props: import("react-window").GridChildComponentProps
) {
  const plotData = useDataPlot();
  const pointInGlobalSpace: IPointObjectInGlobalSpace = {
    space: "global",
    x: props.columnIndex,
    y: props.rowIndex,
    rowsCount: plotData.countriesInTheFinal.length + 2,
    columnsCount: plotData.countriesGivingScore.length + 2
  };
  useEffect(() => {
    // if (props.columnIndex < 13) {
    //   console.info("Mount", { x: props.columnIndex, y: props.rowIndex });
    // }

    return () => {
      console.info("UnMount", { x: props.columnIndex, y: props.rowIndex });
    };
  }, []);

  return (
    <div style={props.style}>
      <CellVisualComponentChooser {...pointInGlobalSpace} />
    </div>
  );
},
areEqual);

function itemKeyProvider(item: {
  rowIndex: number;
  columnIndex: number;
  data: any;
  itemsRenderedCallbackParams?: ItemsRenderedCallbackParams;
}) {
  if (!item.itemsRenderedCallbackParams) {
    throw new Error("Not using react window fork???");
  }

  const inDOMRowsCount =
    item.itemsRenderedCallbackParams.overscanRowStopIndex -
    item.itemsRenderedCallbackParams.overscanRowStartIndex;

  const inDOMColumnsCount =
    item.itemsRenderedCallbackParams.overscanColumnStopIndex -
    item.itemsRenderedCallbackParams.overscanColumnStartIndex;

  console.log(
    `inDOMRowsCount:${inDOMRowsCount}-inDOMColumnsCount:${inDOMColumnsCount}`
  );

  const reuseRowIndex = (item.rowIndex + 0) % (inDOMRowsCount + 1);
  const reuseColumnIndex = (item.columnIndex + 0) % (inDOMColumnsCount + 1);

  let rowPart = `${reuseRowIndex}`;
  let columnPart = `${reuseColumnIndex}`;

  return `${rowPart}:${columnPart}`;
}

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

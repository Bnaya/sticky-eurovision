import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useDataPlot, useBoundingClientRect } from "../common/hooks";
import {
  CellVisualComponentChooser,
  keyProvider
} from "../common/ui-components";
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
        overscanColumnsCount={1}
        overscanRowsCount={1}
        itemKey={itemKeyProvider}
      >
        {GridCell}
      </FixedSizeGrid>
    </div>
  );
}

const GridCell = function GridCell(
  props: import("react-window").GridChildComponentProps & {
    itemsRenderedCallbackParams?: ItemsRenderedCallbackParams;
  }
) {
  const plotData = useDataPlot();
  const pointInGlobalSpace: IPointObjectInGlobalSpace = {
    space: "global",
    x: props.columnIndex,
    y: props.rowIndex,
    rowsCount: plotData.countriesInTheFinal.length + 2,
    columnsCount: plotData.countriesGivingScore.length + 2
  };

  const [dataId, setDataId] = useState(
    `${props.rowIndex}:${props.columnIndex}`
  );

  if (!props.itemsRenderedCallbackParams) {
    throw new Error("Not using react window fork???");
  }

  useEffect(() => {
    // if (props.columnIndex < 13) {
    //   console.info("Mount", { x: props.columnIndex, y: props.rowIndex });
    // }

    return () => {
      console.info("UnMount key", itemKeyProvider(props));
      // console.info("UnMount", { x: props.columnIndex, y: props.rowIndex });
    };
  }, []);

  useLayoutEffect(() => {
    setDataId(old => {
      console.log("Recycled!", old, `${props.rowIndex}:${props.columnIndex}`);

      return `${props.rowIndex}:${props.columnIndex}`;
    });

    return () => {};
  }, [props.rowIndex, props.columnIndex]);

  useEffect(() => {
    console.log("Recycled-aggregated");
  }, [dataId]);

  return (
    <div style={props.style}>
      <CellVisualComponentChooser {...pointInGlobalSpace} />
    </div>
  );
};

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

  // console.log(
  //   `inDOMRowsCount:${inDOMRowsCount}-inDOMColumnsCount:${inDOMColumnsCount}`
  // );

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

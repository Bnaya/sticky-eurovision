import React, { useRef } from "react";
import style from "./WithReactWindow.module.scss";
import classNames from "classnames";
import { useDataPlot, useBoundingClientRect } from "../common/hooks";
import {
  CellVisualComponentChooser,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyProvider,
  getSpecialSlugForPoint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyProviderDataAware
} from "../common/ui-components";
import { IPointObjectInGlobalSpace } from "../common/interfaces";

import { FixedSizeGrid, GridChildComponentProps } from "react-window";

export function WithReactWindow() {
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
      >
        {Cell}
      </FixedSizeGrid>
    </div>
  );
}

const Cell: React.ComponentType<GridChildComponentProps> = props => {
  const plotData = useDataPlot();
  const pointInGlobalSpace: IPointObjectInGlobalSpace = {
    space: "global",
    x: props.columnIndex,
    y: props.rowIndex,
    rowsCount: plotData.countriesInTheFinal.length + 2,
    columnsCount: plotData.countriesGivingScore.length + 2
  };
  return (
    <div style={props.style}>
      <CellVisualComponentChooser {...pointInGlobalSpace} />
    </div>
  );
};

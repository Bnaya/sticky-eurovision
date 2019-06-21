import React, { useState, useCallback } from "react";
import style from "./SimpleTable.module.scss";
import classNames from "classnames";
import { useDataPlot } from "../common/hooks";
import {
  CellVisualComponentChooser,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyProvider,
  getSpecialSlugForPoint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyProviderDataAware
} from "../common/ui-components";
import { IPointObjectInGlobalSpace } from "../common/interfaces";

export function SimpleTable() {
  const [activateSticky, setActivateSticky] = useState(false);

  const toggleActivateSticky = useCallback(() => {
    setActivateSticky(prev => !prev);
  }, [setActivateSticky]);

  return (
    <div
      style={{
        display: "grid",
        gridAutoRows: "auto 1fr",
        overflow: "hidden",
        height: "100%"
      }}
    >
      <button
        style={{
          justifySelf: "center"
        }}
        onClick={toggleActivateSticky}
      >
        Toggle Sticky
      </button>
      <div
        style={{
          overflow: "hidden"
        }}
      >
        <div className={style.scrollablePart}>
          <table
            className={classNames(style.grid, {
              [style.activateStickiness]: activateSticky
            })}
          >
            <tbody>
              <RenderCells />
            </tbody>
          </table>
        </div>
      </div>
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
      const point: IPointObjectInGlobalSpace = {
        space: "global",
        x: columnIndex,
        y: rowIndex,
        columnsCount,
        rowsCount
      };

      const key = keyProvider(point);

      // Actually very slow.
      // const key = keyProviderDataAware(
      //   point,
      //   countriesInTheFinal,
      //   countriesGivingScore
      // );

      rowCells.push(
        <td
          key={key}
          data-key={key}
          className={style[getSpecialSlugForPoint(point)]}
        >
          <CellVisualComponentChooser {...point} />
        </td>
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

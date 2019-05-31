import React from "react";
import style from "./SimpleTable.module.scss";
import classNames from "classnames";
import { useDataPlot } from "../common/hooks";
import {
  CellVisualComponentChooser,
  keyProvider,
  getSpecialSlugForPoint
} from "../common/ui-components";
import { IPointObjectInGlobalSpace } from "../common/interfaces";

export function SimpleTable() {
  return (
    <div className={style.scrollablePart}>
      <table
        className={classNames(style.grid, {
          [style.activateStickiness]: true
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
      const point: IPointObjectInGlobalSpace = {
        space: "global",
        x: columnIndex,
        y: rowIndex,
        columnsCount,
        rowsCount
      };

      const key = keyProvider(point);
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

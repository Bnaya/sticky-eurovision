import React from "react";
import { useSingletonDataPlot } from "./hooks";
import { ISortState } from "./interfaces";

export const StateContainerContext = React.createContext<
  | {
      toggleSortGivingByReceiver: (receivingCounter: string) => void;
      toggleSortReceivingByGiver: (givingCounter: string) => void;
      countriesInTheFinal: string[];
      countriesGivingScore: string[];
      sortGivingByReceiver: ISortState | undefined;
      sortReceivingByGiver: ISortState | undefined;
    }
  | undefined
>(undefined);

export const StateContainer: React.FC<{}> = ({ children }) => {
  const dataPlot = useSingletonDataPlot();
  return (
    <StateContainerContext.Provider value={dataPlot}>
      {children}
    </StateContainerContext.Provider>
  );
};

import React from "react";
import { useSingletonDataPlot } from "./hooks";

export const StateContainerContext = React.createContext<
  | {
      toggleSortGivingByReceiver: (receivingCounter: string) => void;
      toggleSortReceivingByGiver: (givingCounter: string) => void;
      countriesInTheFinal: string[];
      countriesGivingScore: string[];
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

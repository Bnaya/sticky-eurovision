import { useState, useMemo, useCallback, useContext } from "react";
import { CountryCode } from "./interfaces";
import { countriesTheFinal, countriesThatGiveScore } from "./countriesList";
import { getCellForGroup } from "./utils";
import { StateContainerContext } from "./StateContainer";

export function useCellData(x: number, y: number) {
  const { countriesGivingScore, countriesInTheFinal } =
    useContext(StateContainerContext) ||
    (() => {
      throw new Error("WHERE IS MUH CONTEXT");
    })();

  return useMemo(() => {
    return getCellForGroup([
      ["receiving", countriesInTheFinal[y]],
      ["giving", countriesGivingScore[x]]
    ]);
  }, [countriesGivingScore, countriesInTheFinal, x, y]);
}

export function useEdgeControls() {
  const { toggleSortReceivingByGiver, toggleSortGivingByReceiver } =
    useContext(StateContainerContext) ||
    (() => {
      throw new Error("WHERE IS MUH CONTEXT");
    })();

  return useMemo(
    () => ({ toggleSortReceivingByGiver, toggleSortGivingByReceiver }),
    [toggleSortGivingByReceiver, toggleSortReceivingByGiver]
  );
}

export function useDataPlot() {
  return (
    useContext(StateContainerContext) ||
    (() => {
      throw new Error("WHERE IS MUH CONTEXT");
    })()
  );
}

export function useSingletonDataPlot() {
  const [sortGivingByReceiver, setSortGivingByReceiver] = useState<{
    direction: "asc" | "desc";
    country: CountryCode;
  }>();
  const [sortReceivingByGiver, setSortReceivingByGiver] = useState<{
    direction: "asc" | "desc";
    country: CountryCode;
  }>();

  const countriesInTheFinal = useMemo(() => {
    if (sortReceivingByGiver) {
      return countriesTheFinal.slice().sort((countryA, countryB) => {
        const factor = sortReceivingByGiver.direction === "desc" ? 1 : -1;
        const cellA = getCellForGroup([
          ["receiving", countryA],
          ["giving", sortReceivingByGiver.country]
        ]);
        const cellB = getCellForGroup([
          ["receiving", countryB],
          ["giving", sortReceivingByGiver.country]
        ]);

        if (cellA.value > cellB.value) {
          return -1 * factor;
        } else if (cellA.value < cellB.value) {
          return 1 * factor;
        } else {
          return 0 * factor;
        }
      });
    }

    return countriesTheFinal;
  }, [sortReceivingByGiver]);

  const countriesGivingScore = useMemo(() => {
    if (sortGivingByReceiver) {
      return countriesThatGiveScore.slice().sort((countryA, countryB) => {
        const factor = sortGivingByReceiver.direction === "desc" ? 1 : -1;
        const cellA = getCellForGroup([
          ["receiving", sortGivingByReceiver.country],
          ["giving", countryA]
        ]);
        const cellB = getCellForGroup([
          ["receiving", sortGivingByReceiver.country],
          ["giving", countryB]
        ]);

        if (cellA.value > cellB.value) {
          return -1 * factor;
        } else if (cellA.value < cellB.value) {
          return 1 * factor;
        } else {
          return 0 * factor;
        }
      });
    }

    return countriesThatGiveScore;
  }, [sortGivingByReceiver]);

  const toggleSortGivingByReceiver = useCallback(
    (receivingCounter: CountryCode) => {
      setSortGivingByReceiver(state => {
        if (state && state.country === receivingCounter) {
          if (state.direction === "desc") {
            return {
              country: receivingCounter,
              direction: "asc"
            };
          } else {
            return;
          }
        }

        return {
          country: receivingCounter,
          direction: "desc"
        };
      });
    },
    []
  );

  const toggleSortReceivingByGiver = useCallback(
    (givingCounter: CountryCode) => {
      setSortReceivingByGiver(state => {
        if (state && state.country === givingCounter) {
          if (state.direction === "desc") {
            return {
              country: givingCounter,
              direction: "asc"
            };
          } else {
            return;
          }
        }

        return {
          country: givingCounter,
          direction: "desc"
        };
      });
    },
    []
  );

  return {
    toggleSortGivingByReceiver,
    toggleSortReceivingByGiver,
    countriesInTheFinal,
    countriesGivingScore
  };
}

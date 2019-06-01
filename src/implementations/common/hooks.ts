import {
  useState,
  useMemo,
  useCallback,
  useContext,
  useLayoutEffect,
  MutableRefObject,
  useEffect
} from "react";
import { CountryCode } from "./interfaces";
import {
  countriesTheFinal,
  countriesThatGiveScore,
  isoCodeToName
} from "./countriesList";
import { getCellForGroup } from "./utils";
import { StateContainerContext } from "./StateContainer";

export function useCellData(x: number, y: number) {
  const { countriesGivingScore, countriesInTheFinal } =
    useContext(StateContainerContext) ||
    (() => {
      throw new Error("WHERE IS MUH CONTEXT");
    })();

  return useMemo(() => {
    return {
      ...getCellForGroup([
        ["receiving", countriesInTheFinal[y]],
        ["giving", countriesGivingScore[x]]
      ]),
      receiving: isoCodeToName[countriesInTheFinal[y]],
      giving: isoCodeToName[countriesGivingScore[x]]
    };
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

export function useBoundingClientRect(
  elementRef: MutableRefObject<HTMLElement | null>
) {
  const [rect, setRect] = useState<ClientRect | DOMRect>();
  const windowSize = useWindowSize(window);

  useLayoutEffect(() => {
    if (elementRef.current) {
      const { current } = elementRef;
      setRect(currentRect => {
        const newRect = current.getBoundingClientRect();
        if (!currentRect || !compareRects(currentRect, newRect)) {
          return newRect;
        }

        return currentRect;
      });
    } else {
      setRect(undefined);
    }
  }, [elementRef, windowSize.innerWidth, windowSize.innerHeight]);

  return rect;
}

interface IWindowSize {
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
}

export function useWindowSize(localWindow: Window): IWindowSize {
  // improve pref here?
  const [size, setSize] = useState<IWindowSize>(windowToSize(localWindow));

  useEffect(() => {
    function onResize() {
      setSize(windowToSize(localWindow));
    }

    localWindow.addEventListener("resize", onResize);

    return function cleanup() {
      localWindow.removeEventListener("resize", onResize);
    };
  }, [localWindow]);

  return size;
}

function windowToSize({
  outerHeight,
  outerWidth,
  innerHeight,
  innerWidth
}: Window): IWindowSize {
  return { outerHeight, outerWidth, innerHeight, innerWidth };
}

function compareRects(
  rectA: ClientRect | DOMRect,
  rectB: ClientRect | DOMRect
) {
  const propsToCompare: Array<keyof (ClientRect | DOMRect)> = [
    "bottom",
    "height",
    "left",
    "right",
    "top",
    "width"
  ];

  for (const prop of propsToCompare) {
    if (rectA[prop] !== rectB[prop]) {
      return false;
    }
  }

  return true;
}

/* eslint-disable import/first */

// make online editors happy
// let rhlRoot = (comp: any) => comp;

// try {
//   rhlRoot = require("react-hot-loader/root").hot;
// } catch (e) {
//   console.warn("failed to use HMR?", e);
// }

import React from "react";
import appStyles from "./App.module.css";
import { Link, Router, RouteComponentProps, Redirect } from "@reach/router";
import { StickyWithInlineBlock } from "./implementations/StickyWithInlineBlock/StickyWithInlineBlock";
import { SimpleTable } from "./implementations/SimpleTable/SimpleTable";
import { StateContainer } from "./implementations/common/StateContainer";
import { WithReactWindow } from "./implementations/WithReactWindow/WithReactWindow";
import { WithReactWindowAndSticky } from "./implementations/WithReactWindowAndSticky/WithReactWindowAndSticky";

const App: React.FC = () => {
  return (
    <StateContainer>
      <div className={appStyles.App}>
        <nav className={appStyles.nav}>
          <ul>
            <li>
              <Link to="/simple-table">
                Simple Table - No Frozen Rows Columns
              </Link>
            </li>
            <li>
              <Link to="/sticky-inline-block">
                Using sticky + inline block layout
              </Link>
            </li>
            <li>
              <Link to="/with-react-window">With react-window</Link>
            </li>
            <li>
              <Link to="/with-react-window-and-sticky-shlif">
                With react-window and sticky shlif
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/bvaughn/react-window/compare/master...Bnaya:iterations?expand=1#diff-24a00237a136050a93a551637894b705R283"
                target="for-external-links"
                rel="noopener noreferrer"
              >
                the react-window fork
              </a>
            </li>
            <li>
              <a
                href="https://github.com/bvaughn/react-window/issues/98"
                target="for-external-links"
                rel="noopener noreferrer"
              >
                The Sad Issue :(
              </a>
            </li>
          </ul>
        </nav>
        <Router className={appStyles.content}>
          <Redirect
            path="/"
            from="/"
            to="/with-react-window-and-sticky-shlif"
            noThrow={true}
          />
          <RouterPage routeComponent={SimpleTable} path="/simple-table" />
          <RouterPage
            routeComponent={StickyWithInlineBlock}
            path="/sticky-inline-block"
          />
          <RouterPage
            routeComponent={WithReactWindow}
            path="/with-react-window"
          />
          <RouterPage
            routeComponent={WithReactWindowAndSticky}
            path="/with-react-window-and-sticky-shlif"
          />
        </Router>
      </div>
    </StateContainer>
  );
};

const RouterPage = (
  props: { routeComponent: React.ComponentType<any> } & RouteComponentProps
) => <props.routeComponent />;

// const HotApp: React.ComponentType<any> = rhlRoot(App);

export { App };

import React from "react";
import appStyles from "./App.module.css";
import { Link, Router, RouteComponentProps } from "@reach/router";
import { hot } from "react-hot-loader/root";
import { EurovisionTable } from "./EurovisionTable/EurovisionTable";

const App: React.FC = () => {
  return (
    <div className={appStyles.App}>
      <nav className={appStyles.nav}>
        <ul>
          <li>
            <Link to="no-frozen-rows-columns">No Frozen Rows Columns</Link>
          </li>
          <li>
            <Link to="/sticky-inline-block">
              Using sticky + inline block layout
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
        <RouterPage
          routeComponent={EurovisionTable}
          path="/sticky-inline-block"
        />
      </Router>
    </div>
  );
};

const RouterPage = (
  props: { routeComponent: React.ComponentType<any> } & RouteComponentProps
) => <props.routeComponent />;

const HotApp: React.ComponentType<any> = hot(App);

export { HotApp };

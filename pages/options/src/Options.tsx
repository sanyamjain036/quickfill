import { useState } from "react";
import {
  withErrorBoundary,
  withSuspense,
} from "@chrome-extension-boilerplate/shared";
import Sidebar from "./components/Sidebar";
import Trash from "./components/Trash";
import Overview from "./components/Overview";
import Order from "./components/Order";

const Options = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  return (
    <div className="grid grid-cols-12 h-screen text-bbWhite">
      <div className="col-span-2">
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div className="col-span-10">
        {selectedTab === "overview" ? (
          <Overview />
        ) : selectedTab === "order" ? (
          <Order />
        ) : (
          <Trash />
        )}
      </div>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Options, <div> Loading ... </div>),
  <div> Error Occur </div>
);

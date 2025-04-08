import React from "react";
import ReactPullToRefresh from "react-pull-to-refresh";

interface Props {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefreshWrapper: React.FC<Props> = ({ onRefresh, children }) => {
  return (
    <ReactPullToRefresh
      onRefresh={onRefresh}
      className="pull-to-refresh"
      style={{ textAlign: "center" }}
      icon={<span className="genericon genericon-next" />}
      loading={
        <div className="loading">
          <span className="loading-ptr-1" />
          <span className="loading-ptr-2" />
          <span className="loading-ptr-3" />
        </div>
      }
      resistance={2.5}
    >
      {children}
    </ReactPullToRefresh>
  );
};

export default PullToRefreshWrapper;

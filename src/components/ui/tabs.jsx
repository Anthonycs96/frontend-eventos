import * as React from "react";

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <div className={`tabs ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
}

export function TabsList({ children, className }) {
  return <div className={`tabs-list ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, onValueChange, children, className }) {
  return (
    <button
      className={`tab-trigger ${className} ${
        value === children ? "active" : ""
      }`}
      onClick={() => onValueChange(children)}
    >
      {children}
    </button>
  );
}

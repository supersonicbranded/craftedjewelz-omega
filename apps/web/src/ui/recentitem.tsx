import React from "react";

export default function RecentItem(props: { name: string; updated: string }) {
  return (
    <div className="recent-item">
      <div className="thumb" />
      <div className="meta">
        <div className="name">{props.name}</div>
        <div className="updated">Updated {props.updated}</div>
      </div>
      <div className="spacer" />
      <button className="btn ghost">Open</button>
    </div>
  );
}

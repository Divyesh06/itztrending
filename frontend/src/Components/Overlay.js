import React from "react";

function Overlay(props) {
    return (
        <div className="create-poll-wrapper" onClick={function (e) { if (e.target == e.currentTarget) props.hide() }}>
            <div className="create-poll-overlay">
                {props.children}
            </div>
        </div>
    );
}

export default Overlay
import React from "react";

function Overlay(props) {
    return (
        <div className="overlay-wrapper" onClick={function (e) { if (e.target == e.currentTarget) props.hide() }}>
            <div className="overlay">
                {props.children}
            </div>
        </div>
    );
}

export default Overlay
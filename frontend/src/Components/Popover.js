import {useRef} from "react";

function Popover(props) {

    const ref = useRef(null);
    return (
        <div className="popover" ref={ref}>
            {props.children}
        </div>
    )
}

export default Popover;
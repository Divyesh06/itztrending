import {useRef} from "react";

function Popover(props) {

    const ref = useRef(null);
    return (
        <div className="popover" ref={ref} style={{marginTop: props.top, marginLeft: props.left}}>
            {props.children}
        </div>
    )
}

export default Popover;
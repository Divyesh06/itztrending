import { useState } from "react"
function FloatingLabelInput({ type = 'text', label, value, onChange, icon }) {
    const [input_type, setType] = useState(type)
    const [input_icon, setIcon] = useState(icon)
    function icon_click() {
      if (type == "password") {
        if (input_type == "password") {
          setType("text")
          setIcon("eye-slash")
        } else {
          setType("password")
          setIcon("eye")
        }
      }
    }
    return (
      <div className="floating-label-input">
        <input type={input_type} value={value} onChange={onChange} />
        <label className={value && 'filled'}>
          {label}
        </label>
        {icon && <i className={"bi bi-" + input_icon} onClick={icon_click} style={type == "password" ? {cursor: "pointer"} : {}}/>}
      </div>
    );
  }


export default FloatingLabelInput
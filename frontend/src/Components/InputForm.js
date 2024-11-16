import React from 'react'

function InputForm(props) {

    return (
        <>
        <div class="form-bg-wrapper">
        <div class="form-wrapper">
       
        <form className="form-card" onSubmit={props.handleSubmit}>
            {props.children}
            
        </form>
        
        </div>
        </div>
        </>
    )

    }

export default InputForm
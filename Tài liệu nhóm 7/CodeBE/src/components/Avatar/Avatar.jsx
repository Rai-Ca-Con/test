import React from "react";

const Avatar= ({children,
    backgroundColor,
    px, py,
    borderRadius,
    textAlign,
    color,
    fontSize,
    cursor})=>{

const style={
backgroundColor,
padding:""+py+" "+px,
borderRadius,
textAlign:"center",
color:"white",
fontSize,
cursor:cursor||null,
textDecoration:"none"
}

    return( 
    <div style={style}>
        {children}
    </div>)
}

export default Avatar;
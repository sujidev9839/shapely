import { Button } from "react-bootstrap"

function ButtonComponent(props:any) {
    return (
        <Button variant="dark" disabled={props.disabled} style={props?.style} onClick={props.handleButtonClick} className={props?.className}>{props.loading ? "Please wait..." : props?.buttonText}</Button>
    )
}

export default ButtonComponent
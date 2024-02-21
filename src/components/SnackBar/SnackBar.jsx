import { useEffect } from "react";
import "./SnackBar.css";

const SnackBar = (props) => {

    const animationDuration = 6;

    useEffect(() => {
        callRemoveSnackBar();
    }, [])

    function callRemoveSnackBar() {
        setTimeout(() => {
            props.removeSnackBar();
        }, animationDuration * 1000);
    }

    return(
        <div className="flex-container">
            <div className="snackBar" style={{
                animationDuration: `${animationDuration}s`
            }}>
                <p className="p">Notification</p>
                <div dangerouslySetInnerHTML={{__html: props.message}}></div>
            </div>
        </div>
    );
}

export default SnackBar;
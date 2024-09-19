import { useNavigate } from "react-router-dom";
import { Icon } from "../Icon/Icon";

export function GoBackButton(){
    const navigate = useNavigate();

    function handleGoBack(){
        navigate(-1);
    }

    return(
        <button
            onClick={handleGoBack}
            className="p-2"
        >
            <Icon name='chevronLeft'/>
        </button>
    )
}
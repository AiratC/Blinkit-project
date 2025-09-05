import SummaryApi from "../common/SummaryApi";
import Axios from "./Axios";

const fetchUserDetails = async () => {
    try {
        const response = Axios({
            ...SummaryApi.userDetails
        });

        return response
    } catch (error) {
        console.log(error)
    }
}

export default fetchUserDetails;

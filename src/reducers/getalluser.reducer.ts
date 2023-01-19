import {
    GETALLUSER_FAILED,
    GETALLUSER_FETCHING,
    GETALLUSER_SUCCESS,
} from "@/constants";
import { GetAllUserResult } from "@/types/user.type";
// import { GetAllUserResult } from "@/types/auth-result.type";

export interface GetAllUserState {
    result?: GetAllUserResult;
    isFetching: boolean;
    isError: boolean;
    error?: string;
}

const initialState: GetAllUserState = {
    isFetching: false,
    isError: false,
};

export default (state = initialState, { type, payload }: any): GetAllUserState => {
    switch (type) {
        case GETALLUSER_FETCHING:
            return { ...state, isFetching: true, isError: false };
        case GETALLUSER_SUCCESS:
            return { ...state, isFetching: false, isError: false, result: payload };
        case GETALLUSER_FAILED:
            return { ...state, isFetching: false, isError: true, error: payload };
        default:
            return state;
    }
};

import {
    REGISTER_FAILED,
    REGISTER_FETCHING,
    REGISTER_SUCCESS,
} from "@/constants";
import { RegisterResult } from "@/types/auth-result.type";

export interface RegisterState {
    result?: RegisterResult;
    isFetching: boolean;
    isError: boolean;
    error?: string;
}

const initialState: RegisterState = {
    isFetching: false,
    isError: false,
};

export default (state = initialState, { type, payload }: any): RegisterState => {
    switch (type) {
        case REGISTER_FETCHING:
            return { ...state, isFetching: true, isError: false };
        case REGISTER_SUCCESS:
            return { ...state, isFetching: false, isError: false, result: payload };
        case REGISTER_FAILED:
            return { ...state, isFetching: false, isError: true, error: payload };
        default:
            return state;
    }
};

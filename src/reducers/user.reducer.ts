import {
    USER_FAILED,
    USER_FETCHING,
    USER_SUCCESS,
} from "@/constants";
import { UserResult } from "@/types/user.type";

export interface UserState {
    result?: UserResult;
    isFetching: boolean;
    isError: boolean;
    isSuccess: boolean;
    error?: string;
}

const initialState: UserState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
};

export default (state = initialState, { type, payload }: any): UserState => {
    switch (type) {
        case USER_FETCHING:
            return { ...state, isFetching: true, isError: false };
        case USER_SUCCESS:
            return { ...state, isFetching: false, isError: false,isSuccess: true, result: payload };
        case USER_FAILED:
            return { ...state, isFetching: false, isError: true, error: payload };
        default:
            return state;
    }
};


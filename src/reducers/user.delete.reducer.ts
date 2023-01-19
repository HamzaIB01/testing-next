import {
    USER_DELETE_FAILED,
    USER_DELETE_FETCHING,
    USER_DELETE_SUCCESS,
} from "@/constants";
import { UserResult } from "@/types/user.type";
// import { GetAllUserResult } from "@/types/user.type";
// import { GetAllUserResult } from "@/types/auth-result.type";

export interface UserDeleteState {
    result?: UserResult;
    isFetching: boolean;
    isError: boolean;
    isSuccess: boolean;
    error?: string;
}

const initialState: UserDeleteState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
};

export default (state = initialState, { type, payload }: any): UserDeleteState => {
    switch (type) {
        case USER_DELETE_FETCHING:
            return { ...state, isFetching: true, isError: false };
        case USER_DELETE_SUCCESS:
            return { ...state, isFetching: false, isError: false,isSuccess: true, result: payload };
        case  USER_DELETE_FAILED:
            return { ...state, isFetching: false, isError: true, error: payload };
        default:
            return state;
    }
};


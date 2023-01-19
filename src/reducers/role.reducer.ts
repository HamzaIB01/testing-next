import {
    ROLE_FAILED,
    ROLE_FETCHING,
    ROLE_SUCCESS,
} from "@/constants";
import { GetRoleResult } from "@/types/role.type";
// import { GetAllUserResult } from "@/types/user.type";
// import { GetAllUserResult } from "@/types/auth-result.type";

export interface RoleState {
    result?: GetRoleResult;
    isFetching: boolean;
    isError: boolean;
    error?: string;
}

const initialState: RoleState = {
    isFetching: false,
    isError: false,
};

export default (state = initialState, { type, payload }: any): RoleState => {
    switch (type) {
        case ROLE_FETCHING:
            return { ...state, isFetching: true, isError: false };
        case ROLE_SUCCESS:
            return { ...state, isFetching: false, isError: false, result: payload };
        case ROLE_FAILED:
            return { ...state, isFetching: false, isError: true, error: payload };
        default:
            return state;
    }
};

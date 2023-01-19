
export interface updateStepState {
    result?: number;
    isFetching: boolean;
    isError: boolean;
    error?: string;
}

const initialState: updateStepState = {
    result: 0,
    isFetching: false,
    isError: false,
};

// export default (state, action) => {
export default (state = initialState, { type, payload }: any): updateStepState => {
    switch (type) {
        case "LAST_STEP":
            return { ...state, isFetching: false, isError: false, result: payload };
        default:
            return { ...state, isFetching: false, isError: false, result: 0 };
      }
};

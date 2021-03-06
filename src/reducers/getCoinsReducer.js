import { GET_COINS } from '../actions/types';

const initialState = {
    coins: []
};

export default function (state = initialState, action) {
    switch (action.type){
        case GET_COINS:
            return{
                ...state,
                coins: action.payload
            };
        default:
            return state;
    }
}
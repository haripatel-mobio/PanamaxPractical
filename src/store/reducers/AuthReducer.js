const INITIAL_STATE = {
  isConnected: false,
  serviceList: []
};

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'IS_CONNECTED':
      return {
        ...state,
        isConnected: action.isConnected
      };
    case 'SERVICE_LIST':
      return {
        ...state,
        serviceList: action.serviceList
      }
    default:
      return state;
  }
}

export function saveIsConnected(isConnected) {
  return {
      type: 'IS_CONNECTED',
      isConnected,
  };
}

export function saveServiceList(serviceList) {
  // console.log(`serviceList:`,serviceList)
  return {
      type: 'SERVICE_LIST',
      serviceList,
  };
}
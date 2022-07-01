import { isValueNull } from "../../screens/BaseScreen";

export const API_CALL = async (method, endpoint, param, isConnected, response) => {
  if (!isConnected) {
    return response(null, "Please check your internet connection.")
  }
  let bodyObj = param == null ? '' : JSON.stringify(param);
  await fetch(endpoint, {
    method: method,
    body: bodyObj
  }).then(checkError)
  .then(jsonResponse => {
    returnResponse(jsonResponse, response)
  })
  .catch(error => {
    return response(null, error)
  })
}

function checkError(response) {
  console.log(`checkError > json: ${JSON.stringify(response)}`);
  if (
    response.status >= 200 &&
    response.status <= 500
  ) {
    return response.json();
  } else {
    return null;
  }
}

function returnResponse(jsonResponse, response) {
  if (isValueNull(jsonResponse)) {
    return returnError(response)
  }
  // if (json.status == true) {
  if (!isValueNull(jsonResponse.Result)) {
    return response(jsonResponse, null)
  } else {
    return returnError(response)
  }
}

function returnError(response) {
  return response(null, 'Something went wrong. Please try again.');
}
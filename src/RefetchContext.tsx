import React from 'react'


const refetchFunctionality = {
    refetchMessages: undefined,
  }
  
export default React.createContext(function mergeRefetch(key, method) {
    refetchFunctionality[key] = method
});
  
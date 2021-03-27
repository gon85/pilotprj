import React, {createContext, useContext, useState} from 'react';
import {LoadingComponent} from '../components/LoadingComponents';

export const AppContext = createContext(null);

export function AppProvider({children, client, defaultMessage = 'loading...'}) {
  const [loading, _setLoading] = useState(false);

  const setLoading = (load) => {
    _setLoading(load);
  };
  const context = {setLoading, client};
  return (
    <AppContext.Provider value={context}>
      <div style={{width: '100%', height: '100%'}}>
        {loading && <LoadingComponent loading={loading} />}
        <div style={{width: '100%', height: '100%'}}>{children}</div>
      </div>
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);

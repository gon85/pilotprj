import React from 'react'
import ReactLoading from 'react-loading'

export const LoadingComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        flex: '1 1 auto',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <ReactLoading size={100} type={'spin'} />
    </div>
  )
}

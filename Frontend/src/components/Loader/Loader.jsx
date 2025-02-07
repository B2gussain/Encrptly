import React from 'react'
import "./Loader.css"
const Loader = () => {
  return (
    <div className="card">
      <div className="loader">
        <p>loading</p>
        <div className="words">
          <span className="word">name</span>
          <span className="word">url</span>
          <span className="word">username</span>
          <span className="word">passwords</span>
          <span className="word">details</span>
        </div>
      </div>
    </div>
    
  )
}

export default Loader

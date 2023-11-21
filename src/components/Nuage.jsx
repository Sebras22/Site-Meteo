import React from 'react'
import './Nuage.css'
import Cloud from '../assets/Cloud.png'
import sun from '../assets/suncloud.png'
import plane from '../assets/plane.png'
import rocket from '../assets/rocket.png'

const Nuage = () => {
  return (
    <div className="ciel">
      <img className="cloud cloud1" src={Cloud} alt="" />
      <img className="cloud cloud2" src={Cloud} alt="" />
      <img className="cloud cloud3" src={Cloud} alt="" />
      <img className="cloud cloud4" src={Cloud} alt="" />
      <img className="cloud cloud5" src={Cloud} alt="" />
      <img className="Sun" src={sun} alt="" />
      <img className="plane" src={plane} alt="" />
      <img className="rocket" src={rocket} alt="" />
    </div>
  )
}

export default Nuage

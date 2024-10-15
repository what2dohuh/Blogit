import React, { useState } from 'react';
import '../style/card.css';
import Timeform from '../comonents/timeform';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../config/config_fire';

const CardCom = ({ title, time, img, descr, username, category, postId, initialLikes,uid }) => {
 

  return (
    <div className="maincard">
      <div className="card">
        <img src={img} className="card__image" alt={title} />
        <div className="card__content">
          <span className="card__category">{category}</span>
          <time className="card__date">on <Timeform time={time} /></time>
          <span className="card__title">{title}</span>
          {/* <p className="card__description">{descr.slice(20)}</p>   */}
          <p className='card__description'>...Read More</p>
          <span className="card__username"> by {username}</span>
          <div className="card__footer">
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCom;

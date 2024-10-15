import React from 'react';
import "../style/homemaincard.css"
import Timeform from './timeform';
import { Link } from 'react-router-dom';

const Homemaincard = ({data}) => {
    return (
        <div >
        <div class="container mt-5">
   <div class="row">
     <div class="col-12">
       <article class="blog-card">
         <div class="blog-card__background">
           <div class="card__background--wrapper">
             <div class="card__background--main" style={{backgroundImage: `url(${data.imageUrl})`}}>
               <div class="card__background--layer"></div>
             </div>
           </div>
         </div>
         <div class="blog-card__head">
           <span class="date__box">
             <span class="date__day"><Timeform time={data.timestamp}/></span>
             {/* <span class="date__month">JAN</span> */}
           </span>
         </div>
          <Link style={{textDecoration:"none"}} to={`/post/${data.postid}`}>
         <div class="blog-card__info">
           <h5>{data.heading}</h5>
           <p>
             <a href="#" class="icon-link mr-3"><i class="fa fa-pencil-square-o"></i> {data.user}</a>
             <a href="#" class="icon-link"><i class="fa fa-comments-o"></i> 150</a>
           </p>
           <p  dangerouslySetInnerHTML={{ __html: data.post.slice(0,100) }}></p>
           <a href="#" class="btn btn--with-icon"><i class="btn-icon fa fa-long-arrow-right"></i>READ MORE</a>
         </div>
         </Link>
       </article>
     </div>
   </div>
 </div>
 
 <section class="detail-page">
   <div class="container mt-5">
     
   </div>
 </section>
     </div>
    
    );
}

export default Homemaincard;

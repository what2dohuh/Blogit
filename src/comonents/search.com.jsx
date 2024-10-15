import React from 'react';
import '../style/search.css'

const SearchCom = () => {
    return (
        <div class="container-search">

        <div class="row height d-flex justify-content-center align-items-center">

          <div class="col-md-8">

            <div class="search">
              <i class="fa fa-search"></i>
              <input type="text" class="form-control" placeholder="Search author, post, etc..."/>
              <button class="btnn">Search</button>
            </div>
            
          </div>
          
        </div>
    </div>
    );
}

export default SearchCom;

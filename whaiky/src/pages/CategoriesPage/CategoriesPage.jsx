import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import './CategoriesPage.scss';
import Profile from '../../components/user/profile';
import house from '../../assets/svg/house.svg';


const CategoriesPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='page-container'>
      <div className='page-wrapper'>
        <Profile className='profile' />
        <Navbar className='navbar' />
        <div className='flex-container'>
          <div className='flex-box-wrapper'>
            <div className='flexbox'>


              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>

              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>

              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>

              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>

              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>

              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>

              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>

              <div className='dropdown'>
                <dir className="category-img-wrapper"> 
                 <img className='category-img' src={house} alt="house.svg" />
                </dir>  
                <div className='category-text'>Home Improvement</div>
              </div>
              
              
            </div>
            <div className='flexbox'>{/* Your content here */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

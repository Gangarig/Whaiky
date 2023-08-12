import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Search from '../../components/search/Search';
import Navbar from '../../components/navbar/Navbar';
import './CategoriesPage.scss';
import Profile from '../../components/user/profile';
import { categoriesData } from './categoriesData'; // Import the categoriesData
import { AuthContext } from '../../context/AuthContext';
import Ellipse from '../../assets/svg/ellipse.svg';
const CategoriesPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (categoryId) => {
    if (activeDropdown === categoryId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(categoryId);
    }
  };

  const handleOptionClick = (category, option) => {
    // Navigate to PostsPage with selected category value
    window.location.href = `/posts?category=${category}&option=${option}`;
  };

  return (
            <div className='flexbox'>
              {categoriesData.map((category) => (
                <div
                  className={`dropdown ${activeDropdown === category.id ? 'open' : ''}`}
                  key={category.id}
                  onClick={() => toggleDropdown(category.id)}
                >
                  <div className='category-img-wrapper'>
                    <img className='category-img' src={category.icon} alt={category.text} />
                  </div>
                  <div className='category-text'>
                    {category.text}
                  </div>
                  {activeDropdown === category.id && (
                    <div className='options-container'>
                      <ul className='options-list'>
                        {category.options.map((option) => (
                          <Link to={`/posts/${encodeURIComponent(category)}`} className='option' key={option}>
                            <img src= {Ellipse} alt="Ellipse.svg" />
                            {option}
                          </Link>

                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
  );
};

export default CategoriesPage;

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BiHomeAlt,
  BiUser,
  BiFileBlank,
  BiEdit,
  BiBook,
  BiMessageSquareDetail,
} from 'react-icons/bi';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <ul className="bottom-nav__list">
        <li className="bottom-nav__item">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
            }
          >
            <span className="bottom-nav__icon-wrapper">
              <BiHomeAlt className="bottom-nav__icon" />
            </span>
            <span className="bottom-nav__label">Home</span>
          </NavLink>
        </li>

        <li className="bottom-nav__item">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
            }
          >
            <span className="bottom-nav__icon-wrapper">
              <BiUser className="bottom-nav__icon" />
            </span>
            <span className="bottom-nav__label">About</span>
          </NavLink>
        </li>

        <li className="bottom-nav__item">
          <NavLink
            to="/skills"
            className={({ isActive }) =>
              isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
            }
          >
            <span className="bottom-nav__icon-wrapper">
              <BiFileBlank className="bottom-nav__icon" />
            </span>
            <span className="bottom-nav__label">Skills</span>
          </NavLink>
        </li>

        <li className="bottom-nav__item">
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
            }
          >
            <span className="bottom-nav__icon-wrapper">
              <BiEdit className="bottom-nav__icon" />
            </span>
            <span className="bottom-nav__label">Blogs</span>
          </NavLink>
        </li>

        <li className="bottom-nav__item">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
            }
          >
            <span className="bottom-nav__icon-wrapper">
              <BiBook className="bottom-nav__icon" />
            </span>
            <span className="bottom-nav__label">Books</span>
          </NavLink>
        </li>

        <li className="bottom-nav__item">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
            }
          >
            <span className="bottom-nav__icon-wrapper">
              <BiMessageSquareDetail className="bottom-nav__icon" />
            </span>
            <span className="bottom-nav__label">Contact</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;


import React from "react";
import { NavLink, Nav, NavItem } from "react-bootstrap";
import { IoHomeSharp } from "react-icons/io5";
import { TbBrandFeedly } from "react-icons/tb";
import { GiFarmer } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { CiShop } from "react-icons/ci";
const tabs = [
  {
    route: "/home",
    icon: IoHomeSharp,
    label: "Home",
  },
  {
    route: "/explore",
    icon: TbBrandFeedly,
    label: "Explore",
  },
  {
    route: "/work",
    icon: GiFarmer,
    label: "Work",
  },
  {
    route: "/wallet",
    icon: CiShop,
    label: "Wallet",
  },
  {
    route: "/profile",
    icon: CgProfile,
    label: "Profile",
  },
];

const Navigation = (props) => {
  const location = useLocation();
  const { pathname, search, hash } = location;
  return (
    <div>
      <nav
        className="navbar fixed-bottom navbar-light bg-white p-0"
        role="navigation"
      >
        <Nav className="w-100">
          <div className=" d-flex flex-row justify-content-around w-100 shadow-lg rounded-3">
            {tabs.map((tab, index) => (
              <NavItem key={`tab-${index}`}>
                <Link
                  to={tab.route}
                  className={`nav-link text-secondary ${
                    pathname == tab.route && "nav-active"
                  }`}
                >
                  <div className="row d-flex flex-column justify-content-center align-items-center">
                    <tab.icon />
                    <label className="" style={{ fontSize: "12px" }}>
                      {tab.label}
                    </label>
                  </div>
                </Link>
              </NavItem>
            ))}
          </div>
        </Nav>
      </nav>
    </div>
  );
};

export default Navigation;

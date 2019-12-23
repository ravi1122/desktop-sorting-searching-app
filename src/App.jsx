import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import { isMobile } from "./utils";
import { BASE_URL } from "./constants";

import "./style.scss";

export default class App extends Component {
  constructor(props) {
    super(props);

    const _isMobile = isMobile();
    console.log("--_isMobile-->", _isMobile)

    this.state = {
      user: [],
      currentPageId: 0,
      itemsPerPage: _isMobile ? 2 : 4,
      error: "",
      sortBy: "asc",
      isMobile: _isMobile
    };
  }

  componentDidMount() {
    axios.get(BASE_URL).then(resp => {
      this.setState({
        user: resp.data.results,
        error: ""
      });
    });
  }

  dateDIff = d1 => {
    const date1 = new Date(d1);
    const date2 = new Date();
    const msInYear = 1000 * 60 * 60 * 24 * 365;
    const diffTime = Math.abs(date2 - date1);

    return Math.ceil(diffTime / msInYear);
  };

  onPrev = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ currentPageId: this.state.currentPageId - 1 });
  };

  onNext = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ currentPageId: this.state.currentPageId + 1 });
  };

  searchHandler = e => {
    e.preventDefault();
    const searchTerm = e.currentTarget.searchTerm.value;

    if (searchTerm.length > 0) {
      axios.get(`${BASE_URL}?name=${encodeURI(searchTerm)}`).then(
        resp => {
          this.setState(pS => {
            const { sortBy } = pS;
            const { results } = resp.data;

            return { user: pS === "asc" ? results : results.reverse() };
          });
        },
        error => {
          console.log("error", error);
        }
      );
    }
  };

  onChangeSortBy = e => {
    e.preventDefault();

    const order = e.currentTarget.value;
    const prevOrder = this.state.sortBy;

    if (prevOrder !== order) {
      this.setState(pS => {
        const { sortBy, user } = pS;

        return {
          user: [...user].reverse(),
          currentPageId: 0,
          sortBy: order
        };
      });
    }
  };

  render() {
    const { user, error, currentPageId, itemsPerPage, isMobile } = this.state;
    console.log("---->", isMobile);

    const prevProps = {
      onClick: this.onPrev
    };

    if (currentPageId < 1) prevProps.disabled = "disabled";

    const nextProps = {
      onClick: this.onNext
    };

    const itemStartIndex = currentPageId * itemsPerPage;
    const userList = user.slice(itemStartIndex, itemStartIndex + itemsPerPage);

    if (itemStartIndex + itemsPerPage >= user.length)
      nextProps.disabled = "disabled";

    return (
      <div className={`main-container ${ isMobile ? "mobile" : "desktop" }`}>
        <section className="search-section">
          <div className="w--50 d--ib">
            <p>Search by Name</p>
            <form onSubmit={this.searchHandler}>
              <input
                type="text"
                name="searchTerm"
                className="search"
                placeholder="Type name to search"
              />
              <input type="submit" className="search" value="Search" />
            </form>
          </div>
          <div className="w--50 d--ib">
            <select
              onChange={this.onChangeSortBy}
              className="dropdown"
              defaultValue="Sort by ID"
            >
              <option disabled="disabled">Sort by ID</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </section>
        {userList.length > 0 && (
          <div className="users-list">
            {userList.map(u => (
              <div className="user-card" key={u.id}>
                <div className="user-avatar">
                  <img className="user-avatar__img" src={u.image}></img>
                  <div className="name">
                    <div className="name__name">{u.name}</div>
                    <div className="name__id">{`Id: ${
                      u.id
                    } - created ${this.dateDIff(u.created)} years ago.`}</div>
                  </div>
                </div>
                <div className="user-info">
                  <div className="user-info__row">
                    <span className="left">Status</span>
                    <span className="right">{u.status}</span>
                  </div>
                  <div className="user-info__row">
                    <span className="left">Species</span>
                    <span className="right">{u.species}</span>
                  </div>
                  <div className="user-info__row">
                    <span className="left">Gender</span>
                    <span className="right">{u.gender}</span>
                  </div>
                  <div className="user-info__row">
                    <span className="left">Origin</span>
                    <span className="right">{u.origin.name}</span>
                  </div>
                  <div className="user-info__row">
                    <span className="left">Last Location</span>
                    <span className="right">{u.location.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="actions">
          <button {...prevProps} className="btn-next fl">
            Previous
          </button>
          <button {...nextProps} className="btn-next fr">
            Next
          </button>
        </div>
      </div>
    );
  }
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SingleArticle } from "./SingleArticle";
import Sidebar from "./Navigation/Sidebar";
import Footer from "./Navigation/Footer";
import { useHistory } from "react-router-dom";
import { getUserArticles } from "../store/userArticles";
import { _setFilteredArticlesToStore, _clearSharingId } from "../store/sharing";

export function UserArticles() {
    const articles = useSelector((state) => state.userArticles);
    const filteredTags = useSelector((state) => state.tags.filteredTags);
    const user = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const history = useHistory();

    articles.forEach((element) => {
        const tags = element.taggings.map((item) => item.tag.name);
        element.tags = tags;
    });

    useEffect(() => {
        dispatch(_clearSharingId());
        dispatch(getUserArticles(user.id));
    }, [dispatch]);
    //
    function clickHandlerShare() {
        //use filter validator to build array of filtered articles and pass to share store
        const arrToShare = articles
            .filter((article) => validateFilter(article))
            .map((article) => article.id);
        dispatch(_setFilteredArticlesToStore(arrToShare)),
            history.push("/share/message");
    }

    function clickHandlerTabView() {
        history.push("/home/tab");
    }

    function validateFilter(article) {
        if (filteredTags && filteredTags.length > 0) {
            // filtering through tag array
            const containsTag = article.tags.some((tag) =>
                filteredTags.includes(tag)
            );
            if (containsTag) {
                return true;
            } else {
                // filtering through properties
                const containsKeyValue = filteredTags.every(
                    (key) => article[key] && article[key] !== false
                );
                return containsKeyValue;
            }
        }
        return true;
    }

    if (articles.length === 0) {
        return (
            <div className="no-articles--container">
                <div className="no-articles--div">
                    <h3>You don't have any articles.</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="main-user-article--container">
            <div className="left-side--user-article-container">
                <Sidebar />
            </div>
            <div className="right-side--user-article-container">
                <div className="user-articles-total--username-div">
                    <h4>
                        {user.username[0].toUpperCase() +
                            user.username.slice(1)}
                        's bookmark{articles.length > 1 ? `s` : ``}
                    </h4>
                    <h4>Total bookmarks: {articles.length}</h4>
                </div>
                <div className="display-articles--container pure-g">
                    {articles
                        .filter((article) => validateFilter(article))
                        .map((article) => {
                            return (
                                <div
                                    key={article.id}
                                    className="singleContainer pure-u-1-3"
                                >
                                    <SingleArticle article={article} />
                                </div>
                            );
                        })}
                </div>
                <div className="footer-btns--main-user-article--container">
                    <button
                        onClick={(e) => clickHandlerTabView()}
                        id="tabViewButton"
                        className="button-secondary pure-button show-table-view-btn"
                    >
                        Show me table view
                    </button>
                    <button
                        onClick={(e) => clickHandlerShare()}
                        className="button-secondary pure-button"
                        id="shareButton"
                    >
                        Share list with my friends!
                    </button>
                </div>
            </div>
        </div>
    );
}

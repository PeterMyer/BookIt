import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { previewArticle } from "../store/SingleArticle";
import { markUserArticle, deleteProduct } from "../store/userArticles";

export function SingleArticle(props) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const article = props.article;
    const taggings = article.taggings;
    const tags = article.tags;

    function markAsCompleted() {
        if (article.readAt) {
            article.readAt = null;
        } else {
            article.readAt = new Date().toISOString();
        }
        dispatch(markUserArticle(user.id, article));
    }

    function deleteBookmark() {
        dispatch(deleteProduct(article.id, article));
    }

    return (
        <div className="single-article--container">
            <div className="title-delete--single-article--container">
                <section className="single-article-metadata-container">
                    <img className = "single-article-metadata-img"
                        alt = "original article image"
                        src = {article.article.imageURL}
                    />
                    <strong>{article.article.title}</strong>
                    <div>{article.article.publisher}</div>

                </section>
                <hr/>
                <span className="title-name--single-article">
                    <span className="bold--single-article--container">
                    </span>{" "}
                    <span>{article.name}</span>
                </span>
                <span className="x"></span>
                <span>
                    <button
                        onClick={deleteBookmark}
                        className="pure-button delete-btn--single-article"
                    >
                        x
                    </button>
                </span>
            </div>
            <span className="bold--single-article--container"></span>
            <a href={article.article.url}>
                {" "}
                <span className="article-name--single-article">
                    {article.article.url.slice(0, 30) + "..."}
                </span>
            </a>
            {/* <br />
            <span className="bold--single-article--container">Note</span>:{" "}
            {article.note ? `${article.note}` : "none"}
            <br /> */}
            <span className="bold--single-article--container"></span>
            {taggings.length
                ? taggings
                      .map((tagging, idx) => {
                          return (
                              <div className="single-article-tag-style" key={idx.toString()}>
                                  <span>{tagging.tag.name}</span>
                              </div>
                          );
                      })
                      .reduce((prev, curr) => {
                          return [prev, ", ", curr];
                      })
                : "none"}
            <br />
            <div>
                <div className="footer--single-article--container">
                    {article.readAt ? (
                        <button onClick={markAsCompleted}
                        className="read-btn--single-article read-btn-true"
                        >
                        <i class="fa-solid fa-book-open"></i><i className="read-btn-text"> read </i>
                        </button>
                    ) : (
                        <button
                            onClick={markAsCompleted}
                            className="read-btn--single-article read-btn-false"
                        ><i class="fa-solid fa-book"></i><i className="read-btn-text"> unread </i> </button>
                    )}
                </div>
            </div>
        </div>
    );
}

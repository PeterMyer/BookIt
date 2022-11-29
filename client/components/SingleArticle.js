import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markUserArticle, deleteProduct } from "../store/userArticles";
import { EditBookmark } from './EditBookmark/EditBookmark';


export function SingleArticle(props) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const article = props.article;
    const taggings = article.taggings;

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
            <section className="single-article-metadata-container">
                <a href={article.article.url}>
                    <img className = "single-article-metadata-img"
                        alt = "original article image"
                        src = {article.article.imageURL}
                    />
                    <strong>{article.article.title}</strong>
                </a>
                <div>{article.article.publisher}</div>
            <hr/>
            <div>{article.name}</div>
            </section>
            <div>
                <section>
                    {/* <br />
                    <span className="bold--single-article--container">Note</span>:{" "}
                    {article.note ? `${article.note}` : "none"}
                    <br /> */}
                    <div className = "single-article-tags-container">
                        {taggings.length
                            ? taggings
                                .map((tagging, idx) => {
                                    return (
                                        <div className="single-article-tag-style" key={idx.toString()}>
                                            <span>{tagging.tag.name}</span>
                                        </div>
                                    );
                                })
                            : "none"}
                    </div>
                </section>
                <div>
                    <section className="footer--single-article--container">
                        <div className = "single-article-buttons-container">
                            <div>
                                {article.readAt ? (
                                    <button onClick={markAsCompleted}
                                        className="read-btn--single-article read-btn-true"
                                        ><i class="fa-solid fa-book-open"></i>
                                        <i className="read-btn-text"> read </i>
                                    </button>
                                ) : (
                                    <button
                                        onClick={markAsCompleted}
                                        className="read-btn--single-article read-btn-false"
                                        ><i class="fa-solid fa-book"></i>
                                        <i className="read-btn-text"> unread </i> 
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={deleteBookmark}
                                className="delete-btn--single-article"
                            ><i class="fa-regular fa-trash-can"></i>
                            </button>
                            <button className = "edit-btn--single-article">
                                <EditBookmark data={article}/>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

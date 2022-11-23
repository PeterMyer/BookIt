import React from "react";
import { connect } from "react-redux";
import Topbar from "./Navigation/Topbar";
import { createNewArticle, getUserArticles } from "../store/userArticles";

class CreateArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            url: "",
            // isPrivate: "",
            note: "",
            tags: [""],
            formErrors: { name: "", url: "" },
            nameValid: false,
            urlValid: false,
            formValid: false,
            allBookmarks: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addTagPlaceHolder = this.addTagPlaceHolder.bind(this);
        this.onTagValueChange = this.onTagValueChange.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let userId = this.props.auth.id;
        let article = { ...this.state };
        // article.isPrivate = article.isPrivate === "true";

        // console.log("_CREATE SUBMIT STATE > ", this.state);
        this.props.createNewArticle(article, userId);
        // this.setState({})
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addTagPlaceHolder(e) {
        // e.preventDefault();
        // console.log("CREATE ADD_TAG_ STATE", this.state);
        const { tags } = this.state;
        tags.push("");
        this.setState({ ...this.state, tags });
    }

    onTagValueChange(e, index) {
        const { value } = e.target;
        const { tags } = this.state;
        // console.log("CREATE_ON_TAG_VALUE_CHANGE=> VALUES/TAGS", value, tags);
        tags[index] = value;
        this.setState({ ...this.state, tags });
    }

    cancelButton(event) {
        event.preventDefault();
        this.props.history.push("/home");
    }

    render() {
        const { name, url, note, tags } = this.state;
        // console.log("=> STATE AUTH ID", this.state);
        // console.log("=> PROPS AUTH ID", this.props);

        return (
            <div className="create-new-article-component">
                <form
                    onSubmit={this.handleSubmit}
                    className="pure-form pure-form-stacked"
                >
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Bookmark name:</label>
                            <input
                                name="name"
                                value={name}
                                required
                                placeholder="bookmark name"
                                onChange={this.handleChange}
                            />
                            <span className="pure-form-message-inline">
                                This is a required field.
                            </span>
                        </div>

                        <br />

                        <div className="pure-control-group">
                            <label htmlFor="url">Bookmark url:</label>
                            <input
                                name="url"
                                value={url}
                                required
                                placeholder="bookmark URL"
                                type="text"
                                onChange={this.handleChange}
                            />
                            <span className="pure-form-message-inline">
                                This is a required field.
                            </span>
                        </div>

                        <br />

                        <div className="pure-control-group">
                            <label htmlFor="note">Add a note</label>
                            <input
                                name="note"
                                placeholder="add your note"
                                value={note}
                                onChange={this.handleChange}
                            />
                        </div>

                        <br />
                            {tags.map((tag, index) => {
                                return (
                                    <div key={index} className="pure-control-group">
                                        <label htmlFor="tags">Add tag</label>
                                        <input
                                            name="tags"
                                            placeholder="ex: sport, food, etc"
                                            value={tag}
                                            onChange={(e) =>
                                                this.onTagValueChange(e, index)
                                            }
                                        />
                                    </div>
                                );
                            })}
                            <button
                                type="button"
                                className="button-secondary pure-button"
                                onClick={this.addTagPlaceHolder}
                            >
                                +
                            </button>
                        <br />
                        <div className="btns--create-new-article-component">
                            <button
                                type="submit"
                                className="button-secondary pure-button btns--create-new-article"
                            >
                                Create Article
                            </button>
                            <button
                                onClick={(event) => this.cancelButton(event)}
                                className="button-secondary pure-button btns--create-new-article"
                            >
                                Cancel
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        auth: state.auth,
        userArticles: state.userArticles,
        errors: state.createFormError // streo api errors in createFormError property
    };
};

const mapDispatch = (dispatch, { history }) => {
    return {
        createNewArticle: (article, userId) =>
            dispatch(createNewArticle(article, userId, history)),
        getUserArticles: (id) => dispatch(getUserArticles(id))
    };
};
export default connect(mapState, mapDispatch)(CreateArticle);

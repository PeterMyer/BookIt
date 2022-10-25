import React, { Component } from "react";
import { connect } from "react-redux";
import { createNewUser } from "../store/users";

class NewUser extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            // email: "",
            password: ""
        };

        this.updateHandler = this.updateHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    updateHandler(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    submitHandler(evt) {
        evt.preventDefault();
        this.props.createNewUser({ ...this.state });
        this.setState({
            username: "",
            // email: "",
            password: ""
        });
    }

    render() {
        const { username, email, password } = this.state;
        const { updateHandler, submitHandler } = this;

        return (
            <div className="login-page-container">
                <form
                    onSubmit={submitHandler}
                    className="pure-form pure-form-aligned login--form"
                >
                    <div className="pure-control-group">
                        <label htmlFor="username">
                            <small>Username</small>
                        </label>
                        <input
                            name="username"
                            onChange={updateHandler}
                            value={username}
                        />
                        <span className="pure-form-message-inline">
                            This is a required field.
                        </span>
                    </div>
                    <br />
                    {/* <div className="pure-control-group">
                        <label htmlFor="email">
                            <small>Email</small>
                        </label>
                        <input
                            name="email"
                            onChange={updateHandler}
                            value={email}
                        />
                        <span className="pure-form-message-inline">
                            This is a required field.
                        </span>
                    </div> */}
                    <br />
                    <div className="pure-control-group">
                        <label htmlFor="password">
                            <small>Password</small>
                        </label>
                        <input
                            type="password"
                            name="password"
                            onChange={updateHandler}
                            value={password}
                        />
                        <span className="pure-form-message-inline">
                            This is a required field.
                        </span>
                    </div>
                    <br />
                    <div className="pure-control-group">
                        <button
                            type="submit"
                            className="button-secondary pure-button"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapDispatch = (dispatch, { history }) => {
    return {
        createNewUser: (userObject) =>
            dispatch(createNewUser(userObject, history))
    };
};

export default connect(null, mapDispatch)(NewUser);

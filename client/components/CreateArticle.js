import React, {useEffect} from "react";
import { useForm, Controller } from "react-hook-form";
import { createNewArticle } from "../store/userArticles";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from 'react-select/creatable';
import {getUserTags} from '../store/tag'
import {useHistory} from "react-router-dom"

export default function NewArticleForm(props){
    const dispatch = useDispatch()
    const history = useHistory();
    const user = useSelector((state) => state.auth);
    const tags = useSelector ((state)=>state.tags.tags)
    const { register, handleSubmit,control, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        let userId = user.id;
        let article = {
            name: data.name,
            url: data.url,
            note: data.note,
            tags: data.tags.map((tag)=>tag.value),
        }
        dispatch(createNewArticle(article,userId,history))
    };
    
    const cancelButton=(event)=> {
        event.preventDefault();
        history.push("/home");
    }

    useEffect(()=>{
        dispatch(getUserTags(user.id))
    },[dispatch])

    return(
        <div className ="create-new-article-component" >
            <form
                id = "new-article-form"
                className="pure-form pure-form-stacked"
                onSubmit={handleSubmit(onSubmit)}
            >
                <fieldset>
                    <div  className="pure-control-group create-article-input-section">
                        <label htmlFor="name">Article Name</label>
                        <input
                            {...register("name",{required:true})}
                                placeholder="Name"
                            />
                        <span className="pure-form-message-inline">
                            Required
                        </span>
                    </div>
                    <br />
                    <div className="pure-control-group create-article-input-section">
                        <label htmlFor="url">Article URL</label>
                        <input
                           {...register("url",{required:true})}
                           placeholder="URL"
                           type="text"
                        />
                        <span className="pure-form-message-inline">
                            Required
                        </span>
                    </div>
                    <br />
                    <div className="pure-control-group create-article-input-section">
                        <label htmlFor="note">Notes</label>
                        <input 
                            {...register("note",{required:false})}
                        />
                    </div>
                    <br/>
                    <div className ="create-article-tags-section">
                    <div >
                        <label htmlFor="tags">Tags</label>
                        <Controller
                            render={({field})=>(
                                <CreatableSelect {...field}
                                    placeholder="select or create new"
                                    isMulti
                                    options={
                                        tags.map((tag)=>({
                                        value:tag,
                                        label:tag}))
                                        }
                                />
                                )}
                                control={control}
                                name="tags"
                                defaultValue = {null}
                        />
                        
                    </div>
                    <span className="pure-form-message-inline">
                            You must use at least one tag
                        </span>
                    </div>
                </fieldset>
                <button 
                    id="save-recipe" 
                    className="button-secondary pure-button btns--create-new-article"
                    type="submit" 
                    value="Save Article"
                >
                    Save Recipe
                </button>
                <button
                    onClick={(event) => cancelButton(event)}
                    className="button-secondary pure-button btns--create-new-article"
                >
                    Cancel
                </button>
            </form>
        </div>
    )}
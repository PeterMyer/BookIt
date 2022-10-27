import React from 'react';
import { useSelector } from 'react-redux';

export function UserContent(){
    const userArticles = useSelector((state) => state.userArticles);
    const tags = useSelector ((state)=>state.tags)
    let publisherContent = {}
    let tagContent = {}

    publisherContent = userArticles.reduce((publisherContent, item)=>{
        let publisher = item.article.publisher
        return publisherContent[publisher]? 
            publisherContent[publisher].count+=1 :
            publisherContent[publisher] = {
                'name':publisher,
                'count': 1,
                'logo':item.article.logo},
            publisherContent
        },{})

    tagContent = tags.tags.reduce((tagContent, item)=>{
        let tag = item
        return tagContent[tag]? 
            true :
            tagContent[tag] = tag,
            tagContent
        },{})

    
    return(

    <div className = "tab-content-row">
        <div className = "user-content-container">
            <strong className = "subcategory-title">Favorite Publishers</strong >
            {publisherContent ? Object.entries(publisherContent).slice(0,10).map((publisher, index)=>{
                return(
                <div className = "user-content-publisher-display" key = {index}>
                    {/* <img style={{height: "70px"}} src = {publisher[1].logo} alt="null"></img> */}
                    {publisher[0]} : 
                    <i>{publisher[1].count } {publisher[1].count >1? "Pages": "Page"}</i>
                </div>)
            })
        :
            <div>
                null
            </div>
        }
        </div>
        <div className = "user-content-container">
            <strong className = "subcategory-title">Tags</strong >
            <div className = "user-content-tags-container">
                {tags ? Object.keys(tagContent).map((tag, index)=>{
                    return(
                    <div className = "user-content-tags-display"  key = {index}>
                        {tag}
                    </div>)
                })
            :
                <div>
                    null
                </div>
            }
            </div>
        </div>
    </div>)
}

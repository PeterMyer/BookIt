import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generatedColors } from './GeneratedColors';
import { TimeChart } from './TimeChart';


export function UserContent(){
    const userArticles = useSelector((state) => state.userArticles);
    const tags = useSelector ((state)=>state.tags)
    let publisherContent = {}
    let tagContent = {}

    publisherContent = userArticles.reduce((publisherContent, item)=>{
        let publisher = item.article.publisher
        return publisherContent[publisher]? 
            publisherContent[publisher]+=1 :
            publisherContent[publisher] = 1,
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
    <div>
        <strong>Your Favorite Publishers</strong>
        <div className = "user-content-publisher-container">
            {publisherContent ? Object.entries(publisherContent).slice(0,10).map((publisher, index)=>{
                return(
                <div className = "user-content-publisher-display" key = {index}>
                    {publisher[0]} : {publisher[1] } {publisher[1] >1? "Pages": "Page"}
                </div>)
            })
        :
            <div>
                null
            </div>
        }
        </div>
        <strong>Your Tags</strong>
        <div className = "user-content-tags-container">
            {tags ? Object.keys(tagContent).map((tag, index)=>{
                return(
                    // style={{'border-color':generatedColors[index]}} 
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
    </div>)
}

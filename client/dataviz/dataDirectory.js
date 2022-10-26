import React, { useEffect } from 'react';
import { me } from '../store';
import { getArticles } from '../store/articles';
import { getUserArticles } from '../store/userArticles';
import { useSelector, useDispatch } from 'react-redux';
import { DataTabs } from './DataTabs';

//Use this component to import all needed data once to state and then pass down
//to attached components in UserMetrics.js
export function dataDirectory () {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(me())
        dispatch(getArticles())
        dispatch(getUserArticles(user.id))
    }, [dispatch]);


    return (
      <div>
        <DataTabs/>
        {/* <UserMetrics/> */}
      </div>
    )
}

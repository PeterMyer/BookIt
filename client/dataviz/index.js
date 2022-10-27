import React, { useEffect, useState } from 'react';
import { me } from '../store';
import { getArticles } from '../store/articles';
import { getUserArticles } from '../store/userArticles';
import { useSelector, useDispatch } from 'react-redux';
import { DataTabs } from './DataTabs';
import {getUserTags} from '../store/tag'

export function dataDirectory () {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(me())
        dispatch(getArticles())
        dispatch(getUserArticles(user.id))
        dispatch(getUserTags(user.id))
    }, [dispatch]);

    return (
      <div className = "data-viz-top-container">
        <DataTabs/>
      </div>
    )
}

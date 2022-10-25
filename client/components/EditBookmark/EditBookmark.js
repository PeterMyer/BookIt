import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updBookmark } from '../../store/userArticles';
import { ToastContainer, toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';
import ReactDOM from 'react-dom';

export function EditBookmark(props) {
  console.log(props)
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const bookmark = props.data.url? props.data: props.data.article
  const bookmarks = useSelector((state) => state.userArticles);

  const [isModalOpen, setModal] = useState(false);
  const [id, setId] = useState(bookmark.id);
  const [url, setUrl] = useState(bookmark.url);
  const [bookmarkName, setBookmarkName] = useState(bookmark.name? bookmark.name:props.data.name);
  const [note, setNote] = useState(bookmark.note? bookmark.note:props.data.note);
  const [tags, setTags] = useState(bookmark.tags? bookmark.tags:props.data.tags);
  const [read, setRead] = useState(bookmark.read? bookmark.read:props.data.read);

  console.log(url)
  console.log(bookmarks)



  //creates list of unique tags for the dropdown menu
  const tagOptionsArrDupl = [];
  bookmarks.map((bookmark) =>
    bookmark.taggings.map((tag) => tagOptionsArrDupl.push(tag.tag.name))
  );

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  let tagOptionsArrUnique = tagOptionsArrDupl.filter(onlyUnique);

  let tagOptions = [];
  tagOptionsArrUnique.map((tag) => tagOptions.push({ value: tag, label: tag }));

  //creates list of default tag values for the input
  let tagValues = [];
  tags.map((tag) => tagValues.push({ value: tag, label: tag }));

  //tracks current tags list in local state (tags added or removed by user)
  function handleChange(options) {
    let tagArray = [];
    for (let i = 0; i < options.length; i++) {
      tagArray.push(options[i].value);
    }
    setTags(tagArray);
  }

  //performes actions after submit button is hit
  const submitChanges = useCallback(
    async (event) => {
      event.preventDefault();
      const errCallback = () => toast('Something went wrong!');
      try {
        //compiling tags updated data
        let addedTags = [];
        tags.map((tag) =>
          !bookmark.tags.includes(tag) ? addedTags.push(tag) : 0
        );

        let removedTags = [];
        bookmark.tags.map((tag) =>
          !tags.includes(tag) ? removedTags.push(tag) : 0
        );

        //defining read data
        let readAt = '';

        if (read === 'Yes' && bookmark.read === 'No') {
          readAt = new Date().toISOString();
        }

        if (read === 'No' && bookmark.read === 'Yes') {
          readAt = null;
        }

        let changedBookmark = {
          id,
          name: bookmarkName,
          note: note,
          readAt,
          addedTags,
          removedTags,
        };

        let result = await dispatch(updBookmark(changedBookmark));

        if (result.status === 201 || result.status === 200) {
          toast('Changes Saved!');
        } else {
          errCallback();
        }
      } catch (err) {
        errCallback();
      }
    },
    [id, bookmarkName, note, read, tags]
  );

  return (
    <div>
      {isModalOpen ? (
        ReactDOM.createPortal(
          <div className="page-wrapper font-poppins">
            <div className="wrapper wrapper--w680">
              <div className="card card-4">
                <div className="card-body">
                  <h2 className="title">Edit Bookmark</h2>
                  <form className="form-edit" onSubmit={submitChanges}>
                    <div
                      style={{ margin: '0' }}
                      className="row-modal row-space"
                    >
                      <div className="col-2-modal">
                        <div className="input-modal-group">
                          <label className="label-modal">Bookmark URL:</label>
                          <a href={url}>
                            {' '}
                            {url.length > 70
                              ? url.slice(0, 70) + '...'
                              : url}{' '}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row-modal row-space "
                      style={{ margin: '0' }}
                    >
                      <div className="col-2-modal">
                        <div className="input-modal-group">
                          <label className="label-modal">Bookmark Name:</label>
                          <input
                            className="input-modal--style-4"
                            type="text"
                            name="name"
                            value={bookmarkName}
                            onChange={(e) => setBookmarkName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="row-modal row-space "
                      style={{ margin: '0' }}
                    >
                      <div className="col-2-modal">
                        <div className="input-modal-group">
                          <label className="label-modal">Note:</label>
                          <input
                            className="input-modal--style-4"
                            type="text"
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="row-modal row-space "
                      style={{ margin: '0' }}
                    >
                      <div className="col-2-modal">
                        <div className="input-modal-group">
                          <label className="label-modal">Read:</label>
                          <div>
                            <label className="radio-container m-r-45">
                              Yes
                              <input
                                type="radio"
                                checked={read === 'Yes' ? 'checked' : 0}
                                name="read"
                                onChange={(e) => setRead('Yes')}
                              />
                              <span className="checkmark"></span>
                            </label>
                            <label className="radio-container">
                              No
                              <input
                                type="radio"
                                checked={read === 'Yes' ? 0 : 'checked'}
                                name="read"
                                onChange={(e) => setRead('No')}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <input type="hidden" id="tags" name="tags" value={tags} />
                    <input
                      type="hidden"
                      id="bookmarkId"
                      name="bookmarkId"
                      value={id}
                    />
                    <div
                      className="row-modal row-space "
                      style={{ margin: '0' }}
                    >
                      <div className="col-2-modal">
                        <div className="input-modal-group">
                          <label className="label-modal">Bookmark Tags:</label>
                          <div
                            className="rs-select2 js-select-simple select--no-search"
                            style={{ margin: '0' }}
                          >
                            <div
                              className="mySelect__value-container"
                              style={{ margin: '0' }}
                            >
                              <CreatableSelect
                                style={{ margin: '0' }}
                                id="tagsetter"
                                className="select"
                                isMulti
                                onChange={handleChange}
                                autosize={true}
                                defaultValue={tagValues}
                                options={tagOptions}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="table-btn-container"
                      style={{ marginTop: '25px' }}
                    >
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setModal(false);
                        }}
                        id="cancel"
                      >
                        Cancel
                      </button>
                      <input
                        className="btn btn-primary"
                        type="submit"
                        value="Save Changes"
                      />
                      <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>,

          document.querySelector('#modal')
        )
      ) : (
        <button
          onClick={() => {
            setModal(true);
          }}
        >
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      )}
    </div>
  );
}

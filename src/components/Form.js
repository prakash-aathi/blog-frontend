import React from 'react'

const Form = ({props}) => {
  return (
    <form onSubmit={props.addBlog}>
    <h2>Create new</h2>
    <div>title: <input value={props.newTitle} onChange={props.handleTitleChange} /></div>
    <div>author: <input value={props.newAuthor} onChange={props.handleAuthorChange} /></div>
    <div>url: <input value={props.newUrl} onChange={props.handleUrlChange} /></div>
    <button type="submit">create</button> 
    <br />
    <button onClick={props.handleShowBlog} >cancel</button>
  </form>  )
}

export default Form
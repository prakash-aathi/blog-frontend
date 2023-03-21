import React from 'react'
import blogService from '../services/blogs'

function Blog({ blog,user }) {
  
  const [likes, setLikes] = React.useState(blog.likes)
  const [showDetails, setShowDetails] = React.useState(false)
  console.log(blog, "blog");
  console.log(user, "user");

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  const handleLike = () => { 
    const newBlog = {
      title: blog.title,
      likes: likes + 1,
      author: blog.author,
      url: blog.url,
      user: blog.user[0].id
    }
    blogService.update(blog.id, newBlog).then(response => { 
      setLikes(response.likes)
    }).catch(error => { 
      console.log(error);
    }) 
  }
  
  const handleRemove = () => { 
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) { 
      blogService.remove(blog.id).then(response => {
        console.log(response);
      }).catch(error => {
        console.log(error);
      }).finally(() => { 
        window.location.reload()
      })
    }
  }

  return (
    <div style={blogStyle} key={blog.id}>
      <div>{blog.title} {blog.author}</div>
      <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails ? <div>{blog.url} <br /> {likes} likes
        <button onClick={handleLike} >like</button>
        <br /> added by {blog.user[0].username}
        <br />
        { blog.user[0].id === user.id  && <button onClick={handleRemove} >Remove</button>}
      </div> : null}
    </div> 
  )
}

export default Blog
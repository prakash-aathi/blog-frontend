import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [showAddBlog, setShowAddBlog] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs =>
    {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
      console.log(sortedBlogs)
      }
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log(user);
      blogService.setToken(user.token)
    }
  }, [])
  

  const handleLogin = async (event) => { 
    event.preventDefault()
    try {
      const data = await loginService.login({
        username, password,
      })
      console.log(data);
      blogService.setToken(data.token)
      window.localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      setUsername('')
      setPassword('')
    } catch (exception) { 
      console.log(exception)
      setErrorMessage('wrong credentials')
      setTimeout(() => { 
        setErrorMessage(null)
      }, 5000) 
    }
  }

  const handleChange = (event) => { 
    if (event.target.name === 'username') setUsername(event.target.value)
    if (event.target.name === 'password') setPassword(event.target.value)
  }

  const handleLogout = () => { 
    window.localStorage.removeItem('user')
    setUser(null)
  }
  
  const addBlog = (event) => { 
    event.preventDefault()
    console.log(user);
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    console.log(blogObject);
    blogService.create(blogObject).then(returnedBlog => {
      console.log(returnedBlog, 'returned blog');
      const prevBlogs = blogs
      setBlogs(prevBlogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => { 
        setMessage(null)
      }, 5000)
    }).catch(error => { 
      console.log(error);
      setErrorMessage(error.response.data.error)
      setTimeout(() => { 
        setErrorMessage(null)
      },5000)
    }).finally(() => {
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    })
  }

  const handleTitleChange = (event) => { 
    setNewTitle(event.target.value) 
   }
  const handleAuthorChange = (event) => { 
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => { 
    setNewUrl(event.target.value)
  }

  const handleShowBlog = () => { 
    setShowAddBlog(!showAddBlog)
  }

  if (user === null) {
    return (
      <div>
        <h1>log in to application</h1>  
        {errorMessage && <div>{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div>username <input value={username} onChange={handleChange} name="username" type="text" /></div>
          <div>password <input value={password} onChange={handleChange} name="password" type="password" /></div>
          <button type="submit">login</button>
        </form>
      </div>
      )
  }
  
    return (
      <div>
        <h2>blogs</h2>
        {user.name} logged in <button onClick={handleLogout} >logout</button>
        {message && <div>{message}</div>}
        <br />
        {errorMessage && <div>{errorMessage}</div> }
        <br />
        { showAddBlog ?  <form onSubmit={addBlog}>
          <h2>Create new</h2>
          <div>title: <input value={newTitle} onChange={handleTitleChange} /></div>
          <div>author: <input value={newAuthor} onChange={handleAuthorChange} /></div>
          <div>url: <input value={newUrl} onChange={handleUrlChange} /></div>
          <button type="submit">create</button> 
          <br />
          <button onClick={handleShowBlog} >cancel</button>
        </form> : <button onClick={handleShowBlog}> newNote </button>}
        <br />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} />
        )}
      </div>
    )
 
}

export default App
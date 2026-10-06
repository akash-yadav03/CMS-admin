// App.js
const { useState, useEffect } = React;

function App() {
  const navigate = ReactRouterDOM.useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showContactMessages, setShowContactMessages] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(false);
  const [deletingContactMessageId, setDeletingContactMessageId] = useState(null);
  const [contactMessagesError, setContactMessagesError] = useState('');
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    content: ''
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    link: ''
  });
  const [postMessage, setPostMessage] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [projectMessage, setProjectMessage] = useState('');
  const [aboutData, setAboutData] = useState({ description: '', skills: '' });
  const [aboutMessage, setAboutMessage] = useState('');
  const [aboutLoading, setAboutLoading] = useState(false);
  const [editContent, setEditContent] = useState(null);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/login', { replace: true });
  };

  // Fetch posts on initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!editContent) {
      return;
    }

    const editTitleInput = document.getElementById('edit-post-title');
    editTitleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    editTitleInput?.focus({ preventScroll: true });
  }, [editContent?.id]);

  const fetchPosts = () => {
    axios
      .get('http://127.0.0.1:5000/api/admin/posts')
      .then(response => setPosts(response.data))
      .catch(error =>
        console.error('Error fetching content:', error)
      );
  };

  // Dashboard
  const handleDashboardClick = () => {
    setShowPosts(false);
    setShowProjectForm(false);
    setShowContactMessages(false);
    setShowAbout(false);
    setMenuOpen(false);
  };

  // Posts
  const handlePostsClick = () => {
    fetchPosts();
    setShowPosts(true);
    setShowProjectForm(false);
    setShowContactMessages(false);
    setShowAbout(false);
    setMenuOpen(false);
  };

  const handleAddProjectClick = () => {
    setShowPosts(false);
    setShowProjectForm(true);
    setShowContactMessages(false);
    setShowAbout(false);
    setProjectMessage('');
    setMenuOpen(false);
    fetchProjects();
  };

  const handleAboutClick = () => {
    setShowPosts(false);
    setShowProjectForm(false);
    setShowContactMessages(false);
    setShowAbout(true);
    setEditContent(null);
    setAboutMessage('');
    setMenuOpen(false);
    setAboutLoading(true);

    axios
      .get('http://127.0.0.1:5000/api/about')
      .then(response => {
        setAboutData({
          description: response.data.description || '',
          skills: Array.isArray(response.data.skills)
            ? response.data.skills.join('\n')
            : ''
        });
      })
      .catch(error => {
        console.error('Error fetching About content:', error);
        setAboutMessage('Unable to load About content. You can still edit and save it.');
      })
      .finally(() => setAboutLoading(false));
  };

  const handleSaveAbout = (event) => {
    event.preventDefault();
    setAboutMessage('');

    if (!aboutData.description.trim()) {
      setAboutMessage('Please enter an About description.');
      return;
    }

    const aboutPayload = {
      description: aboutData.description.trim(),
      skills: aboutData.skills
        .split(/\r?\n/)
        .map(skill => skill.trim())
        .filter(Boolean)
    };

    axios
      .post('http://127.0.0.1:5000/api/about', aboutPayload)
      .then(response => {
        setAboutData({
          description: response.data.description,
          skills: response.data.skills.join('\n')
        });
        setAboutMessage('About content saved successfully.');
      })
      .catch(error => {
        console.error('Error saving About content:', error);
        setAboutMessage(
          error.response?.data?.error || 'Unable to save About content. Please try again.'
        );
      });
  };

  const fetchProjects = () => {
    setProjectsLoading(true);
    setProjectsError('');

    axios
      .get('http://127.0.0.1:5000/api/projects')
      .then(response => setProjects(response.data))
      .catch(error => {
        console.error('Error fetching projects:', error);
        setProjectsError('Unable to load saved projects.');
      })
      .finally(() => setProjectsLoading(false));
  };

  const handleDeleteProject = (projectId) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) {
      return;
    }

    setDeletingProjectId(projectId);
    setProjectsError('');

    axios
      .delete(`http://127.0.0.1:5000/api/projects/${projectId}`)
      .then(() => {
        setProjects(previousProjects =>
          previousProjects.filter(project => project.id !== projectId)
        );
      })
      .catch(error => {
        console.error('Error deleting project:', error);
        setProjectsError('Unable to delete project. Please try again.');
      })
      .finally(() => setDeletingProjectId(null));
  };

  const handleContactMessagesClick = () => {
    setShowPosts(false);
    setShowProjectForm(false);
    setShowContactMessages(true);
    setShowAbout(false);
    setMenuOpen(false);
    fetchContactMessages();
  };

  const fetchContactMessages = () => {
    setContactMessagesLoading(true);
    setContactMessagesError('');

    axios
      .get('http://127.0.0.1:5000/api/contact-messages')
      .then(response => setContactMessages(response.data))
      .catch(error => {
        console.error('Error fetching contact messages:', error);
        setContactMessagesError('Unable to load contact messages.');
      })
      .finally(() => setContactMessagesLoading(false));
  };

  const handleDeleteContactMessage = (messageId) => {
    if (!window.confirm('Delete this contact message? This cannot be undone.')) {
      return;
    }

    setDeletingContactMessageId(messageId);
    setContactMessagesError('');

    axios
      .delete(`http://127.0.0.1:5000/api/contact-messages/${messageId}`)
      .then(() => {
        setContactMessages(previousMessages =>
          previousMessages.filter(message => message.id !== messageId)
        );
      })
      .catch(error => {
        console.error('Error deleting contact message:', error);
        setContactMessagesError('Unable to delete contact message. Please try again.');
      })
      .finally(() => setDeletingContactMessageId(null));
  };

  // Portfolio frontend
  const handlePortfolioClick = () => {
    // Change this route if your portfolio frontend uses another route.
    navigate('/portfolio');
    setMenuOpen(false);
  };

  // Approve post
  const handleApprove = (id) => {
    axios
      .post(`http://127.0.0.1:5000/api/posts/${id}/approve`)
      .then(response => {
        console.log(response.data);

        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === id
              ? { ...post, status: 'approved' }
              : post
          )
        );
      })
      .catch(error =>
        console.error('Error approving post:', error)
      );
  };

  // Edit post
  const handleEdit = (post) => {
    setEditMessage('');
    setEditContent({
      id: post.id,
      status: post.status,
      title: post.title || '',
      description: post.description || '',
      content: post.content || ''
    });
  };

  // Save edited post
  const handleSaveEdit = (event) => {
    event.preventDefault();
    setEditMessage('');

    if (
      !editContent.title.trim() ||
      !editContent.description.trim() ||
      !editContent.content.trim()
    ) {
      setEditMessage('Please enter a title, description, and content.');
      return;
    }

    const postData = {
      title: editContent.title,
      description: editContent.description,
      content: editContent.content
    };

    axios
      .put(
        `http://127.0.0.1:5000/api/posts/${editContent.id}`,
        postData
      )
      .then(response => {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === editContent.id
              ? response.data
              : post
          )
        );

        setEditContent(null);
        setEditMessage('');
      })
      .catch(error => {
        console.error('Error saving edit:', error);
        setEditMessage(
          error.response?.data?.error || 'Unable to save the post. Please try again.'
        );
      });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditContent(null);
    setEditMessage('');
  };

  // Add post form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewContent({
      ...newContent,
      [name]: value
    });
  };

  // Edit post form input
  const handleInputChangeEdit = (e) => {
    const { name, value } = e.target;

    setEditContent({
      ...editContent,
      [name]: value
    });
  };

  // Add content
  const handleAddContent = (event) => {
    event.preventDefault();
    setPostMessage('');

    if (
      !newContent.title.trim() ||
      !newContent.description.trim() ||
      !newContent.content.trim()
    ) {
      setPostMessage('Please enter a title, description, and content.');
      return;
    }

    const postData = {
      title: newContent.title,
      description: newContent.description,
      content: newContent.content
    };

    axios
      .post('http://127.0.0.1:5000/api/posts', postData)
      .then(response => {
        setPosts(prevPosts => [
          response.data,
          ...prevPosts
        ]);

        setNewContent({
          title: '',
          description: '',
          content: ''
        });
        setPostMessage('Post submitted successfully.');
      })
      .catch(error => {
        console.error('Error adding content:', error);
        setPostMessage(
          error.response?.data?.error || 'Unable to save the post. Please try again.'
        );
      });
  };

  const handleAddProject = (event) => {
    event.preventDefault();

    let projectUrl;
    try {
      projectUrl = new URL(newProject.link);
    } catch (error) {
      setProjectMessage('Enter a valid project link.');
      return;
    }

    if (!['http:', 'https:'].includes(projectUrl.protocol)) {
      setProjectMessage('Project links must use http or https.');
      return;
    }

    axios
      .post('http://127.0.0.1:5000/api/projects', {
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        link: projectUrl.href
      })
      .then(response => {
        setProjects(previousProjects => [response.data, ...previousProjects]);
        setNewProject({ name: '', description: '', link: '' });
        setProjectMessage('Project submitted successfully.');
      })
      .catch(error => {
        console.error('Error saving project:', error);
        setProjectMessage('Unable to save the project. Please try again.');
      });
  };

  return (
    <div className="cms-dashboard">

      {/* =========================
          TOP NAVBAR
      ========================== */}
      <nav className="dashboard-nav">

        <div className="nav-left">
          <button
            className="hamburger-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="brand">
            Content Management System
          </div>
        </div>
      </nav>

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`sidebar ${
          menuOpen ? 'sidebar-open' : ''
        }`}
      >

        <div className="sidebar-header">
          <h2>Admin Panel</h2>

          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="sidebar-menu">

          <button
            className={!showPosts && !showProjectForm && !showContactMessages && !showAbout ? 'active' : ''}
            onClick={handleDashboardClick}
          >
            <span className="menu-icon">⌂</span>
            Dashboard
          </button>

          <button
            className={showPosts ? 'active' : ''}
            onClick={handlePostsClick}
          >
            <span>▤</span>
            Posts
          </button>

          <button
            className={showAbout ? 'active' : ''}
            onClick={handleAboutClick}
          >
            <span className="menu-icon">ⓘ</span>
            About
          </button>

          <button
            className={showProjectForm ? 'active' : ''}
            onClick={handleAddProjectClick}
          >
            <span className="menu-icon">+</span>
            Project
          </button>

          <button
            className={showContactMessages ? 'active' : ''}
            onClick={handleContactMessagesClick}
          >
            <span className="menu-icon">✉</span>
            Contact
          </button>

          <div className="sidebar-divider"></div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span className="menu-icon">⇥</span>
            Logout
          </button>

        </div>
      </aside>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="dashboard-content">

        {/* Dashboard */}
        {!showPosts && !showProjectForm && !showContactMessages && !showAbout && (
          <section className="dashboard-home">

            <div className="page-heading">
              <div>
                <h1>Dashboard</h1>
                <p>
                  Welcome to your content management system.
                </p>
              </div>
            </div>

            <div className="dashboard-cards">

              <div className="dashboard-card">
                <div className="card-icon">▤</div>
                <div>
                  <h3>{posts.length}</h3>
                  <p>Total Posts</p>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon pending">◷</div>
                <div>
                  <h3>
                    {
                      posts.filter(
                        post => post.status === 'pending'
                      ).length
                    }
                  </h3>
                  <p>Pending Posts</p>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon approved">✓</div>
                <div>
                  <h3>
                    {
                      posts.filter(
                        post => post.status === 'approved'
                      ).length
                    }
                  </h3>
                  <p>Approved Posts</p>
                </div>
              </div>

            </div>

            <div className="quick-actions">

              <h2>Quick Actions</h2>

              <div className="quick-action-buttons">

                <button
                  onClick={handlePostsClick}
                >
                  Manage Posts
                </button>

                <button
                  onClick={handleAddProjectClick}
                >
                  Add Projects
                </button>

              </div>

            </div>

          </section>
        )}

        {showProjectForm && (
          <section className="posts-section project-management-section">
            <div className="page-heading">
              <div>
                <h1>Projects</h1>
                <p>Submit a project to display on your portfolio.</p>
              </div>
            </div>

            <h2 className="project-list-heading">Saved Projects</h2>
            {projectsError && <p className="contact-messages-error" role="alert">{projectsError}</p>}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Link</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsLoading && projects.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">Loading projects...</td>
                    </tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">No projects found.</td>
                    </tr>
                  ) : (
                    projects.map(project => (
                      <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>{project.description}</td>
                        <td><a href={project.link} target="_blank" rel="noopener noreferrer">Visit project</a></td>
                        <td>{new Date(project.created_at).toLocaleString()}</td>
                        <td>
                          <button
                            type="button"
                            className="contact-delete-button"
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deletingProjectId === project.id}
                          >
                            {deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="content-form-section project-form-panel">
              <h2>Add Project Details</h2>
              <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label htmlFor="project-name">Project name</label>
                <input
                  id="project-name"
                  type="text"
                  value={newProject.name}
                  onChange={event => setNewProject({
                    ...newProject,
                    name: event.target.value
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-description">Project description</label>
                <textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={event => setNewProject({
                    ...newProject,
                    description: event.target.value
                  })}
                  rows="4"
                  maxLength="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-link">Project link</label>
                <input
                  id="project-link"
                  type="url"
                  value={newProject.link}
                  onChange={event => setNewProject({
                    ...newProject,
                    link: event.target.value
                  })}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <button type="submit" className="primary-button">
                Submit Project
              </button>
              {projectMessage && <p role="status">{projectMessage}</p>}
              </form>
            </div>
          </section>
        )}

        {showAbout && (
          <section className="content-form-section">
            <div className="page-heading">
              <div>
                <h1>About Me</h1>
                <p>Update the description and skills shown on your portfolio.</p>
              </div>
            </div>

            {aboutLoading && <p role="status">Loading About content...</p>}

            <form onSubmit={handleSaveAbout}>
              <div className="form-group">
                <label htmlFor="about-description">About description</label>
                <textarea
                  id="about-description"
                  value={aboutData.description}
                  onChange={event => setAboutData({
                    ...aboutData,
                    description: event.target.value
                  })}
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="about-skills">Skills</label>
                <textarea
                  id="about-skills"
                  value={aboutData.skills}
                  onChange={event => setAboutData({
                    ...aboutData,
                    skills: event.target.value
                  })}
                  placeholder={'Enter one skill per line, for example:\nHTML\nCSS\nJavaScript'}
                  rows="6"
                />
              </div>

              <button type="submit" className="primary-button">
                Save About
              </button>
              {aboutMessage && <p role="status">{aboutMessage}</p>}
            </form>
          </section>
        )}

        {/* =========================
            POSTS
        ========================== */}
        {showPosts && (
          <section className="posts-section">

            <div className="page-heading">
              <div>
                <h1>Posts</h1>
                <p>
                  Manage and approve your portfolio content.
                </p>
              </div>
            </div>

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {posts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="empty-state"
                      >
                        No posts found.
                      </td>
                    </tr>
                  ) : (
                    posts.map(post => (
                      <tr key={post.id}>

                        <td className="post-title">
                          {post.title}
                        </td>

                        <td>
                          {post.description}
                        </td>

                        <td>
                          <span
                            className={`status ${
                              post.status
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>

                        <td className="actions">

                          {post.status === 'pending' && (
                            <>
                              <button
                                className="approve-btn"
                                onClick={() =>
                                  handleApprove(post.id)
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(post)
                                }
                              >
                                Edit
                              </button>
                            </>
                          )}

                          {post.status === 'approved' && (
                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(post)
                              }
                            >
                              Edit
                            </button>
                          )}

                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {showContactMessages && (
          <section className="posts-section">
            <div className="page-heading">
              <div>
                <h1>Contact Messages</h1>
                <p>Messages submitted through the portfolio contact form.</p>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={fetchContactMessages}
                disabled={contactMessagesLoading}
              >
                {contactMessagesLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {contactMessagesError && (
              <p className="contact-messages-error" role="alert">
                {contactMessagesError}
              </p>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessagesLoading && contactMessages.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        Loading contact messages...
                      </td>
                    </tr>
                  ) : contactMessages.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No contact messages found.
                      </td>
                    </tr>
                  ) : (
                    contactMessages.map(message => (
                      <tr key={message.id}>
                        <td>{message.name}</td>
                        <td><a href={`mailto:${message.email}`}>{message.email}</a></td>
                        <td className="contact-message-text">{message.message}</td>
                        <td>{new Date(message.created_at).toLocaleString()}</td>
                        <td>
                          <button
                            type="button"
                            className="contact-delete-button"
                            onClick={() => handleDeleteContactMessage(message.id)}
                            disabled={deletingContactMessageId === message.id}
                          >
                            {deletingContactMessageId === message.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* =========================
            ADD CONTENT
        ========================== */}
        {!showProjectForm && !showContactMessages && !showAbout && !editContent && <section className="content-form-section">

          <h2>Add New Content</h2>

          <form onSubmit={handleAddContent}>

            <div className="form-group">
              <label htmlFor="new-post-title">Title</label>

              <input
                id="new-post-title"
                type="text"
                name="title"
                placeholder="Enter post title"
                value={newContent.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-post-description">Description</label>

              <textarea
                id="new-post-description"
                name="description"
                placeholder="Enter post description"
                value={newContent.description}
                onChange={handleInputChange}
                maxLength="100"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-post-content">Content</label>
              <textarea
                id="new-post-content"
                name="content"
                placeholder="Write your blog post..."
                value={newContent.content}
                onChange={handleInputChange}
                rows="15"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              + Add Content
            </button>
            {postMessage && <p role="status">{postMessage}</p>}

          </form>
        </section>}

        {/* =========================
            EDIT CONTENT
        ========================== */}
        {editContent && (
          <section className="content-form-section edit-section">

            <div className="form-header">
              <div>
                <h2>Edit Content</h2>
                <p>Update your existing post.</p>
              </div>

              <button
                className="close-edit"
                onClick={handleCancelEdit}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>

              <div className="form-group">
                <label htmlFor="edit-post-title">Title</label>

                <input
                  id="edit-post-title"
                  type="text"
                  name="title"
                  value={editContent.title}
                  onChange={handleInputChangeEdit}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-post-description">Description</label>

                <textarea
                  id="edit-post-description"
                  name="description"
                  value={editContent.description}
                  onChange={handleInputChangeEdit}
                  maxLength="100"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-post-content">Content</label>
                <textarea
                  id="edit-post-content"
                  name="content"
                  value={editContent.content}
                  onChange={handleInputChangeEdit}
                  rows="15"
                  required
                />
              </div>

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-button"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>

              </div>
              {editMessage && <p role="alert">{editMessage}</p>}

            </form>

          </section>
        )}

      </main>

    </div>
  );
}
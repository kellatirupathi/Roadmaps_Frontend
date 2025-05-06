// client/src/components/TechStackTable/TechStackTable.jsx
import { useState } from 'react';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import { updateTechStack, deleteRoadmapItem, addRoadmapItem, deleteTechStack } from '../../services/techStackService';
import './TechStackTable.css';

const TechStackTable = ({ techStackData, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [roadmapItems, setRoadmapItems] = useState(techStackData.roadmapItems || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    topic: '',
    subTopics: [{ name: '' }],
    projects: [{ name: '' }],
    completionStatus: 'Yet to Start'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  
  // Get custom headers from techStackData or use defaults
  const headers = techStackData.headers || {
    topic: "Topic",
    subTopics: "Sub-Topics",
    projects: "Projects",
    status: "Status"
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset roadmapItems when canceling edit
    if (editMode) {
      setRoadmapItems(techStackData.roadmapItems || []);
      setShowAddForm(false);
      setSearchTerm('');
    }
  };

  // Toggle add form
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (showAddForm) {
      // Reset the new item form when closing
      setNewItem({
        topic: '',
        subTopics: [{ name: '' }],
        projects: [{ name: '' }],
        completionStatus: 'Yet to Start'
      });
    }
  };

  // Handle input change for roadmap items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...roadmapItems];
    updatedItems[index][field] = value;
    setRoadmapItems(updatedItems);
  };

  // Handle input change for subtopics
  const handleSubtopicChange = (itemIndex, subtopicIndex, value) => {
    const updatedItems = [...roadmapItems];
    updatedItems[itemIndex].subTopics[subtopicIndex].name = value;
    setRoadmapItems(updatedItems);
  };

  // Handle input change for projects
  const handleProjectChange = (itemIndex, projectIndex, value) => {
    const updatedItems = [...roadmapItems];
    updatedItems[itemIndex].projects[projectIndex].name = value;
    setRoadmapItems(updatedItems);
  };

  // Add subtopic field to a roadmap item
  const addSubtopic = (itemIndex) => {
    const updatedItems = [...roadmapItems];
    updatedItems[itemIndex].subTopics.push({ name: '' });
    setRoadmapItems(updatedItems);
  };

  // Add project field to a roadmap item
  const addProject = (itemIndex) => {
    const updatedItems = [...roadmapItems];
    updatedItems[itemIndex].projects.push({ name: '' });
    setRoadmapItems(updatedItems);
  };

  // Remove subtopic field from a roadmap item
  const removeSubtopic = (itemIndex, subtopicIndex) => {
    const updatedItems = [...roadmapItems];
    updatedItems[itemIndex].subTopics.splice(subtopicIndex, 1);
    setRoadmapItems(updatedItems);
  };

  // Remove project field from a roadmap item
  const removeProject = (itemIndex, projectIndex) => {
    const updatedItems = [...roadmapItems];
    updatedItems[itemIndex].projects.splice(projectIndex, 1);
    setRoadmapItems(updatedItems);
  };

  // Delete a roadmap item
  const handleDeleteItem = async (itemId) => {
    try {
      setLoading(true);
      await deleteRoadmapItem(techStackData._id, itemId);
      
      // Update the local state after successful deletion
      const updatedItems = roadmapItems.filter(item => item._id !== itemId);
      setRoadmapItems(updatedItems);
      
      // Update the parent component
      onUpdate({
        ...techStackData,
        roadmapItems: updatedItems
      });
      
      setLoading(false);
      setSuccess('Item deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete item');
      setLoading(false);
    }
  };

  // Delete entire tech stack
  const handleDeleteTechStack = async () => {
    try {
      setLoading(true);
      await deleteTechStack(techStackData._id);
      
      setLoading(false);
      setSuccess('Tech stack deleted successfully');
      
      // Notify parent component about deletion
      if (onDelete) {
        onDelete(techStackData._id);
      }
    } catch (err) {
      setError('Failed to delete tech stack');
      setLoading(false);
    }
  };

  // Save updated roadmap items
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      // Update the tech stack with the modified roadmap items
      // Keep the headers the same
      const updatedTechStack = await updateTechStack(techStackData._id, {
        roadmapItems: roadmapItems,
        headers: techStackData.headers
      });
      
      // Update the parent component
      onUpdate(updatedTechStack.data);
      
      setLoading(false);
      setEditMode(false);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to save changes');
      setLoading(false);
    }
  };

  // Handle new item input change
  const handleNewItemChange = (field, value) => {
    setNewItem({
      ...newItem,
      [field]: value
    });
  };

  // Handle new item subtopic change
  const handleNewItemSubtopicChange = (index, value) => {
    const updatedSubtopics = [...newItem.subTopics];
    updatedSubtopics[index].name = value;
    setNewItem({
      ...newItem,
      subTopics: updatedSubtopics
    });
  };

  // Handle new item project change
  const handleNewItemProjectChange = (index, value) => {
    const updatedProjects = [...newItem.projects];
    updatedProjects[index].name = value;
    setNewItem({
      ...newItem,
      projects: updatedProjects
    });
  };

  // Add subtopic to new item
  const addNewItemSubtopic = () => {
    setNewItem({
      ...newItem,
      subTopics: [...newItem.subTopics, { name: '' }]
    });
  };

  // Add project to new item
  const addNewItemProject = () => {
    setNewItem({
      ...newItem,
      projects: [...newItem.projects, { name: '' }]
    });
  };

  // Remove subtopic from new item
  const removeNewItemSubtopic = (index) => {
    const updatedSubtopics = [...newItem.subTopics];
    updatedSubtopics.splice(index, 1);
    setNewItem({
      ...newItem,
      subTopics: updatedSubtopics
    });
  };

  // Remove project from new item
  const removeNewItemProject = (index) => {
    const updatedProjects = [...newItem.projects];
    updatedProjects.splice(index, 1);
    setNewItem({
      ...newItem,
      projects: updatedProjects
    });
  };

  // Add a new roadmap item
  const handleAddItem = async () => {
    // Validate that at least topic is filled
    if (!newItem.topic) {
      setError('Topic is required');
      return;
    }

    try {
      setLoading(true);
      
      // Add the new item to the tech stack
      const result = await addRoadmapItem(techStackData._id, newItem);
      
      // Update the local state
      setRoadmapItems([...roadmapItems, result.data.roadmapItems[result.data.roadmapItems.length - 1]]);
      
      // Update the parent component
      onUpdate(result.data);
      
      // Reset the new item form
      setNewItem({
        topic: '',
        subTopics: [{ name: '' }],
        projects: [{ name: '' }],
        completionStatus: 'Yet to Start'
      });
      
      setLoading(false);
      setShowAddForm(false);
      setSuccess('New item added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add new item');
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter roadmap items based on search term
  const filteredRoadmapItems = roadmapItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search in topic
    if (item.topic.toLowerCase().includes(searchLower)) return true;
    
    // Search in subtopics
    if (item.subTopics.some(sub => sub.name.toLowerCase().includes(searchLower))) return true;
    
    // Search in projects
    if (item.projects.some(proj => proj.name.toLowerCase().includes(searchLower))) return true;
    
    // Search in status
    if (item.completionStatus.toLowerCase().includes(searchLower)) return true;
    
    return false;
  });

  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <div className="roadmap-header-left">
          <h2 className="roadmap-title">{techStackData.name}</h2>
        </div>
        
        <div className="roadmap-header-actions">
          {!editMode && !showAddForm && (
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder={`Search ${headers.topic.toLowerCase()}, ${headers.projects.toLowerCase()}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="search-clear" 
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          )}
          
          <Button 
            variant={editMode ? "outline-primary" : "primary"}
            onClick={toggleEditMode}
            disabled={loading}
            className="edit-button"
            title={editMode ? "Cancel editing" : "Edit roadmap"}
          >
            <i className={`fas ${editMode ? "fa-times" : "fa-edit"}`}></i>
            <span className="button-text"></span>
          </Button>
          
          {/* Add delete button for the entire tech stack */}
          {onDelete && !editMode && (
            <Button 
              variant="danger"
              onClick={() => setDeleteConfirmation(true)}
              disabled={loading}
              className="delete-button"
              title="Delete tech stack"
            >
              <i className="fas fa-trash"></i>
            </Button>
          )}
        </div>
      </div>
      
      {/* Delete confirmation */}
      {deleteConfirmation && (
        <Alert variant="danger" className="delete-confirmation">
          <div className="confirmation-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Are you sure you want to delete this tech stack? This action cannot be undone.</span>
          </div>
          <div className="confirmation-actions">
            <Button 
              variant="outline-secondary" 
              onClick={() => setDeleteConfirmation(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteTechStack}
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Deleting...</span>
                </>
              ) : (
                'Confirm Delete'
              )}
            </Button>
          </div>
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="alert-slim">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible className="alert-slim">
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}
      
      {editMode && showAddForm && (
        <div className="add-form-container">
          <div className="form-grid">
            <div className="form-group">
              <Form.Label>{headers.topic} <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={newItem.topic}
                onChange={(e) => handleNewItemChange('topic', e.target.value)}
                placeholder={`Enter ${headers.topic.toLowerCase()}`}
                className="form-control-sm"
              />
            </div>
            
            <div className="form-group">
              <Form.Label>{headers.subTopics}</Form.Label>
              <div className="field-list">
                {newItem.subTopics.map((subtopic, index) => (
                  <div key={index} className="field-item">
                    <Form.Control
                      type="text"
                      value={subtopic.name}
                      onChange={(e) => handleNewItemSubtopicChange(index, e.target.value)}
                      placeholder={`Enter ${headers.subTopics.toLowerCase()}`}
                      className="form-control-sm"
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="remove-btn"
                      onClick={() => removeNewItemSubtopic(index)}
                      disabled={newItem.subTopics.length <= 1}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                ))}
                <Button
                  variant="link"
                  className="add-link"
                  onClick={addNewItemSubtopic}
                >
                  <i className="fas fa-plus"></i> Add {headers.subTopics.replace(/s$/, '')}
                </Button>
              </div>
            </div>
            
            <div className="form-group">
              <Form.Label>{headers.projects}</Form.Label>
              <div className="field-list">
                {newItem.projects.map((project, index) => (
                  <div key={index} className="field-item">
                    <Form.Control
                      type="text"
                      value={project.name}
                      onChange={(e) => handleNewItemProjectChange(index, e.target.value)}
                      placeholder={`Enter ${headers.projects.toLowerCase()}`}
                      className="form-control-sm"
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="remove-btn"
                      onClick={() => removeNewItemProject(index)}
                      disabled={newItem.projects.length <= 1}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                ))}
                <Button
                  variant="link"
                  className="add-link"
                  onClick={addNewItemProject}
                >
                  <i className="fas fa-plus"></i> Add {headers.projects.replace(/s$/, '')}
                </Button>
              </div>
            </div>
            
            <div className="form-group">
              <Form.Label>{headers.status}</Form.Label>
              <Form.Select
                value={newItem.completionStatus}
                onChange={(e) => handleNewItemChange('completionStatus', e.target.value)}
                className="form-select-sm status-select"
              >
                <option value="Yet to Start">Yet to Start</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
              
              <div className="form-actions">
                <Button
                  variant="outline-secondary"
                  onClick={toggleAddForm}
                  className="btn-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddItem}
                  disabled={loading || !newItem.topic}
                  className="btn-sm"
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-1">Adding...</span>
                    </>
                  ) : (
                    'Add Item'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="table-responsive roadmap-table-container">
        <table className="roadmap-table">
          <thead>
            <tr>
              <th className="th-topic">{headers.topic.toUpperCase()}</th>
              <th className="th-subtopics">{headers.subTopics.toUpperCase()}</th>
              <th className="th-projects">{headers.projects.toUpperCase()}</th>
              <th className="th-status">{headers.status.toUpperCase()}</th>
              {editMode && <th className="th-actions">ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRoadmapItems.length > 0 ? (
              filteredRoadmapItems.map((item, index) => (
                <tr key={index}>
                  <td className="topic-col">
                    {item.topic}
                  </td>
                  <td>
                    {editMode ? (
                      <div className="edit-list">
                        {item.subTopics.map((subtopic, subtopicIndex) => (
                          <div key={subtopicIndex} className="field-item">
                            <Form.Control
                              type="text"
                              value={subtopic.name}
                              onChange={(e) => handleSubtopicChange(index, subtopicIndex, e.target.value)}
                              className="form-control-sm"
                            />
                            {item.subTopics.length > 1 && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="remove-btn"
                                onClick={() => removeSubtopic(index, subtopicIndex)}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="link"
                          className="add-link"
                          onClick={() => addSubtopic(index)}
                        >
                          <i className="fas fa-plus"></i> Add
                        </Button>
                      </div>
                    ) : (
                      <div className="subtopics-list">
                        {item.subTopics.map((subtopic, i) => (
                          subtopic.name && (
                            <span key={i} className="subtopic-item">
                              {subtopic.name}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <div className="edit-list">
                        {item.projects.map((project, projectIndex) => (
                          <div key={projectIndex} className="field-item">
                            <Form.Control
                              type="text"
                              value={project.name}
                              onChange={(e) => handleProjectChange(index, projectIndex, e.target.value)}
                              className="form-control-sm"
                            />
                            {item.projects.length > 1 && (
                                <Button
                                variant="outline-danger"
                                size="sm"
                                className="remove-btn"
                                onClick={() => removeProject(index, projectIndex)}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="link"
                          className="add-link"
                          onClick={() => addProject(index)}
                        >
                          <i className="fas fa-plus"></i> Add
                        </Button>
                      </div>
                    ) : (
                      <div className="projects-list">
                        {item.projects.map((project, i) => (
                          project.name && (
                            <span key={i} className="project-item">
                              {project.name}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <Form.Select
                        value={item.completionStatus}
                        onChange={(e) => handleItemChange(index, 'completionStatus', e.target.value)}
                        className="form-select-sm status-select"
                      >
                        <option value="Yet to Start">Yet to Start</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </Form.Select>
                    ) : (
                      <span className={`status-badge ${item.completionStatus.toLowerCase().replace(' ', '-')}`}>
                        {item.completionStatus}
                      </span>
                    )}
                  </td>
                  {editMode && (
                    <td className="actions-col">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteItem(item._id)}
                        className="delete-btn"
                        title="Delete item"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={editMode ? 5 : 4} className="empty-message">
                  {searchTerm ? (
                    <>
                      <i className="fas fa-search fa-lg mb-2"></i>
                      <p>No matching {headers.topic.toLowerCase()} found</p>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => setSearchTerm('')}
                      >
                        Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-clipboard-list fa-lg mb-2"></i>
                      <p>No {headers.topic.toLowerCase()} added yet</p>
                      {editMode && (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={toggleAddForm}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add {headers.topic}
                        </Button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {editMode && (
        <div className="edit-actions">
          {roadmapItems.length > 0 && !showAddForm && (
            <Button
              variant="outline-primary"
              onClick={toggleAddForm}
              disabled={loading}
              className="me-2"
            >
              <i className="fas fa-plus me-1"></i>
              Add {headers.topic}
            </Button>
          )}
          
          {roadmapItems.length > 0 && (
            <Button
              variant="primary"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TechStackTable;
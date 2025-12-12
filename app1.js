import React, { useState } from 'react';
import { 
  Trash2, Plus, ChevronDown, ChevronUp, Edit, Save, X,
  Users, Code, Calendar, FileText, Globe,
  Briefcase, Search, Home, BarChart,
  Database, Layers, User, Hash, Eye,
  Building, Cpu, Clock, Copy, Check,
  ExternalLink, Circle, Tag
} from 'lucide-react';

export default function SalesFormCRUD() {
  const [masterData, setMasterData] = useState({
    reqId: '',
    businessUnit: '',
    platform: '',
    clientName: '',
    status: 'Active'
  });

  const [techStacks, setTechStacks] = useState([
    {
      id: Date.now(),
      techStack: '',
      experience: '',
      jobDescription: '',
      engineersNeeded: ''
    }
  ]);

  const [submissions, setSubmissions] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [copiedId, setCopiedId] = useState(null);

  const getNextSNo = () => {
    if (submissions.length === 0) return '001';
    const lastSNo = parseInt(submissions[submissions.length - 1].sNo);
    return (lastSNo + 1).toString().padStart(3, '0');
  };

  const stats = {
    totalRequirements: submissions.length,
    totalEngineers: submissions.reduce((sum, sub) => 
      sum + sub.techStacks.reduce((techSum, tech) => 
        techSum + parseInt(tech.engineersNeeded || 0), 0), 0
    ),
    techStacksUsed: [...new Set(submissions.flatMap(sub => 
      sub.techStacks.flatMap(tech => tech.techStack.split(',').map(t => t.trim()))
    ))].length,
    activeClients: [...new Set(submissions.map(sub => sub.clientName))].length,
    totalBusinessUnits: [...new Set(submissions.map(sub => sub.businessUnit))].length
  };

  const handleMasterChange = (e) => {
    setMasterData({
      ...masterData,
      [e.target.name]: e.target.value
    });
  };

  const handleTechChange = (id, field, value) => {
    setTechStacks(techStacks.map(tech => 
      tech.id === id ? { ...tech, [field]: value } : tech
    ));
  };

  const addTechStack = () => {
    const newId = Date.now();
    setTechStacks([
      ...techStacks,
      {
        id: newId,
        techStack: '',
        experience: '',
        jobDescription: '',
        engineersNeeded: ''
      }
    ]);
  };

  const removeTechStack = (id) => {
    if (techStacks.length > 1) {
      setTechStacks(techStacks.filter(tech => tech.id !== id));
    }
  };

  const handleSubmit = () => {
    const isValid = masterData.reqId && masterData.businessUnit && 
                    masterData.platform && masterData.clientName &&
                    techStacks.every(tech => 
                      tech.techStack && tech.experience && 
                      tech.jobDescription && tech.engineersNeeded
                    );

    if (!isValid) {
      alert('Please fill all required fields marked with *');
      return;
    }

    const newSubmission = {
      id: Date.now(),
      sNo: getNextSNo(),
      submittedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: masterData.status,
      priority: 'Medium',
      ...masterData,
      techStacks: techStacks.map(tech => ({ ...tech }))
    };

    setSubmissions(prev => [...prev, newSubmission]);
    resetForm();
    setActiveView('view');
    alert('Requirement submitted successfully!');
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startEdit = (submission) => {
    setEditingId(submission.id);
    setEditData({
      ...submission,
      techStacks: submission.techStacks.map(tech => ({ ...tech }))
    });
    setActiveView('add');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
    resetForm();
    setActiveView('view');
  };

  const saveEdit = () => {
    if (!editData) {
      alert('No edit data found!');
      return;
    }

    const isValid = editData.reqId && editData.businessUnit && 
                    editData.platform && editData.clientName &&
                    editData.techStacks.every(tech => 
                      tech.techStack && tech.experience && 
                      tech.jobDescription && tech.engineersNeeded
                    );

    if (!isValid) {
      alert('Please fill all required fields!');
      return;
    }

    const updatedSubmission = {
      ...editData,
      submittedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setSubmissions(prev => prev.map(sub => 
      sub.id === editingId ? updatedSubmission : sub
    ));
    
    setEditingId(null);
    setEditData(null);
    resetForm();
    setActiveView('view');
    alert('Requirement updated successfully!');
  };

  const handleEditMasterChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditTechChange = (id, field, value) => {
    setEditData({
      ...editData,
      techStacks: editData.techStacks.map(tech =>
        tech.id === id ? { ...tech, [field]: value } : tech
      )
    });
  };

  const addEditTechStack = () => {
    if (!editData || !editData.techStacks) return;
    
    const newId = Date.now();
    
    setEditData({
      ...editData,
      techStacks: [
        ...editData.techStacks,
        {
          id: newId,
          techStack: '',
          experience: '',
          jobDescription: '',
          engineersNeeded: ''
        }
      ]
    });
  };

  const removeEditTechStack = (id) => {
    if (!editData || !editData.techStacks || editData.techStacks.length <= 1) return;
    
    setEditData({
      ...editData,
      techStacks: editData.techStacks.filter(tech => tech.id !== id)
    });
  };

  const deleteSubmission = (id) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      
      setExpandedRows(prev => {
        const newExpanded = { ...prev };
        delete newExpanded[id];
        return newExpanded;
      });
      
      alert('Requirement deleted successfully!');
    }
  };

  const resetForm = () => {
    setMasterData({
      reqId: '',
      businessUnit: '',
      platform: '',
      clientName: '',
      status: 'Active'
    });
    setTechStacks([{
      id: Date.now(),
      techStack: '',
      experience: '',
      jobDescription: '',
      engineersNeeded: ''
    }]);
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      sub.sNo?.toLowerCase().includes(searchLower) ||
      sub.reqId?.toLowerCase().includes(searchLower) ||
      sub.businessUnit?.toLowerCase().includes(searchLower) ||
      sub.platform?.toLowerCase().includes(searchLower) ||
      sub.clientName?.toLowerCase().includes(searchLower) ||
      sub.techStacks?.some(tech => 
        tech.techStack?.toLowerCase().includes(searchLower)
      )
    );
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to get business unit color
  const getBusinessUnitColor = (businessUnit) => {
    // Generate a consistent color based on business unit name
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
      { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
    ];
    
    // Create a simple hash from business unit name
    const hash = businessUnit.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const renderForm = () => {
    const currentData = editingId ? editData : masterData;
    const currentTechStacks = editingId ? editData?.techStacks || [] : techStacks;
    const handleChange = editingId ? handleEditMasterChange : handleMasterChange;
    const handleTechChangeFunc = editingId ? handleEditTechChange : handleTechChange;
    const handleAddTechStack = editingId ? addEditTechStack : addTechStack;
    const handleRemoveTechStack = editingId ? removeEditTechStack : removeTechStack;
    const handleSubmitFunc = editingId ? saveEdit : handleSubmit;
    const handleCancelFunc = editingId ? cancelEdit : () => setActiveView('view');

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingId ? 'Edit Requirement' : 'Add New Requirement'}
          </h2>
          <button
            onClick={handleCancelFunc}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Layers size={18} />
                Project Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirement ID *
                </label>
                <input
                  type="text"
                  name="reqId"
                  value={currentData.reqId || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="REQ-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Unit *
                </label>
                <input
                  type="text"
                  name="businessUnit"
                  value={currentData.businessUnit || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter business unit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <input
                  type="text"
                  name="platform"
                  value={currentData.platform || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={currentData.clientName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={currentData.status || 'Active'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Building size={18} />
                Technology Requirements
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Code size={18} />
                    Technology Requirements *
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddTechStack}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Plus size={16} />
                    Add Stack
                  </button>
                </div>

                {currentTechStacks.map((tech, index) => (
                  <div key={tech.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Tech Stack #{index + 1}</span>
                        {currentTechStacks.length > 1 && (
                          <button
                            onClick={() => handleRemoveTechStack(tech.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Technology Stack *
                        </label>
                        <input
                          type="text"
                          value={tech.techStack || ''}
                          onChange={(e) => handleTechChangeFunc(tech.id, 'techStack', e.target.value)}
                          placeholder="React, Node.js, MongoDB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experience *
                          </label>
                          <input
                            type="text"
                            value={tech.experience || ''}
                            onChange={(e) => handleTechChangeFunc(tech.id, 'experience', e.target.value)}
                            placeholder="3-5 years"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Engineers *
                          </label>
                          <input
                            type="number"
                            value={tech.engineersNeeded || ''}
                            onChange={(e) => handleTechChangeFunc(tech.id, 'engineersNeeded', e.target.value)}
                            placeholder="5"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Description *
                        </label>
                        <textarea
                          value={tech.jobDescription || ''}
                          onChange={(e) => handleTechChangeFunc(tech.id, 'jobDescription', e.target.value)}
                          placeholder="Describe responsibilities and requirements..."
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={resetForm}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Clear Form
          </button>
          <button
            onClick={handleSubmitFunc}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
          >
            {editingId ? 'Update Requirement' : 'Submit Requirement'}
          </button>
        </div>
      </div>
    );
  };

  const renderRequirementsTable = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Requirements</h2>
              <p className="text-gray-600 text-sm mt-1">
                {filteredSubmissions.length} requirements • {stats.totalEngineers} engineers needed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-64"
                />
              </div>
              <button
                onClick={() => setActiveView('add')}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus size={18} />
                Add Requirement
              </button>
            </div>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No requirements found</h3>
            <p className="text-gray-500 mb-6">Create your first requirement</p>
            <button
              onClick={() => setActiveView('add')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Create First Requirement
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Req ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Client Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Platform</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Business Unit</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tech Stacks</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Engineers</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => {
                  const buColor = getBusinessUnitColor(submission.businessUnit);
                  return (
                    <React.Fragment key={submission.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{submission.sNo}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Calendar size={12} />
                            {submission.submittedAt}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-gray-900">{submission.reqId}</div>
                            <button
                              onClick={() => copyToClipboard(submission.reqId)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy Req ID"
                            >
                              {copiedId === submission.reqId ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{submission.clientName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Globe size={16} className="text-gray-400" />
                            <span className="font-medium">{submission.platform}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${buColor.bg} ${buColor.text} ${buColor.border}`}>
                            <Tag size={12} className="mr-1" />
                            {submission.businessUnit}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {submission.techStacks.slice(0, 2).map((tech, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  <Cpu size={10} className="mr-1" />
                                  {tech.techStack.split(',')[0].trim()}
                                </span>
                              ))}
                              {submission.techStacks.length > 2 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800">
                                  +{submission.techStacks.length - 2} more
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => toggleRow(submission.id)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              {expandedRows[submission.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              {submission.techStacks.length} tech stack{submission.techStacks.length > 1 ? 's' : ''}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-gray-400" />
                            <div>
                              <div className="font-bold text-gray-900">
                                {submission.techStacks.reduce((sum, tech) => sum + parseInt(tech.engineersNeeded || 0), 0)}
                              </div>
                              <div className="text-xs text-gray-500">engineers</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}>
                              <Circle size={10} className="mr-1" />
                              {submission.status}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(submission.priority)}`}>
                              {submission.priority}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(submission)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => toggleRow(submission.id)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => deleteSubmission(submission.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {expandedRows[submission.id] && (
                        <tr>
                          <td colSpan="9" className="bg-gray-50 px-6 py-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-800">Technical Requirements Details</h4>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEdit(submission)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                  >
                                    <Edit size={16} />
                                    Edit Requirement
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {submission.techStacks.map((tech, techIdx) => (
                                  <div key={techIdx} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                                            Stack #{techIdx + 1}
                                          </div>
                                        </div>
                                        <h5 className="font-semibold text-gray-900">{tech.techStack}</h5>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">Experience</div>
                                        <div className="font-medium">{tech.experience}</div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">Engineers Needed</div>
                                        <div className="flex items-center gap-2">
                                          <Users size={14} className="text-gray-400" />
                                          <span className="font-bold">{tech.engineersNeeded}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-600 mb-1">Job Description</div>
                                        <p className="text-sm text-gray-700">{tech.jobDescription}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Tech Staffing Portal</h1>
                <p className="text-xs text-gray-500">Manage staffing requirements efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === 'dashboard' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('view')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === 'view' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText size={18} />
                View Requirements
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome to Tech Staffing Portal</h1>
                  <p className="text-indigo-100 text-lg">Efficiently manage your staffing requirements</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveView('add')}
                    className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-md"
                  >
                    <Plus size={20} />
                    Add Requirement
                  </button>
                  <button
                    onClick={() => setActiveView('view')}
                    className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
                  >
                    <FileText size={20} />
                    View Requirements
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Requirements</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRequirements}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Engineers Needed</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEngineers}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Tech Stacks</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.techStacksUsed}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Code className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Active Clients</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeClients}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Building className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT REQUIREMENTS TABLE - MADE MORE ATTRACTIVE */}
            {submissions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Recent Requirements</h2>
                    <button
                      onClick={() => setActiveView('view')}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                    >
                      View All <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">S.No</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Req ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Client Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Platform</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Business Unit</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tech Stacks</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {submissions.slice(0, 5).map((submission) => {
                        const buColor = getBusinessUnitColor(submission.businessUnit);
                        return (
                          <tr key={submission.id} className="hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center">
                                  <span className="font-bold text-indigo-700">{submission.sNo}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  <Calendar size={10} className="inline mr-1" />
                                  {submission.submittedAt}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-gray-900">{submission.reqId}</div>
                                <button
                                  onClick={() => copyToClipboard(submission.reqId)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Copy Req ID"
                                >
                                  {copiedId === submission.reqId ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{submission.clientName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                                <Globe size={14} className="text-gray-500" />
                                <span className="font-medium">{submission.platform}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border shadow-sm ${buColor.bg} ${buColor.text} ${buColor.border}`}>
                                <Tag size={12} className="mr-2" />
                                {submission.businessUnit}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {submission.techStacks.slice(0, 2).map((tech, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 shadow-sm">
                                    <Cpu size={10} className="mr-1" />
                                    {tech.techStack.split(',')[0].trim()}
                                  </span>
                                ))}
                                {submission.techStacks.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 border border-gray-300 shadow-sm">
                                    +{submission.techStacks.length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border shadow-sm ${getStatusColor(submission.status)}`}>
                                <Circle size={10} className="mr-2" />
                                {submission.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      Showing {Math.min(submissions.length, 5)} of {submissions.length} requirements
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Active: {submissions.filter(s => s.status === 'Active').length}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Pending: {submissions.filter(s => s.status === 'Pending').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'add' && renderForm()}

        {activeView === 'view' && renderRequirementsTable()}
      </main>
    </div>
  );
}

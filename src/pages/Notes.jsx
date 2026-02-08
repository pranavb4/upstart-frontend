import { useState, useEffect } from 'react';
import API from '../api';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getFileURL } from '../utils/urlHelper';

const Notes = () => {
  // Data State
  const [notes, setNotes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter/Search State
  const [filters, setFilters] = useState({ 
    search: '', 
    branch: '', 
    semester: '', 
    page: 1 
  });

  // Upload State
  const [formData, setFormData] = useState({ title: '', subject: '', branch: 'CS', semester: 'SEM I' });
  const [file, setFile] = useState(null);

  // Re-fetch when filters change
  useEffect(() => {
    fetchNotes();
  }, [filters]); // Dependency array triggers update

  const fetchNotes = async () => {
    try {
      // Convert state to query string: ?page=1&search=math&branch=CS
      const query = new URLSearchParams(filters).toString();
      const { data } = await API.get(`/notes?${query}`);
      
      setNotes(data.notes);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 }); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('subject', formData.subject);
    data.append('branch', formData.branch);
    data.append('semester', formData.semester);

    try {
      await API.post('/notes', data);
      alert('Note Uploaded! +50 XP');
      fetchNotes();
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="dashboard">
      <h2>Academic Notes 📚</h2>
      
      {/* 1. SEARCH & FILTER BAR */}
      <div className="auth-box" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 2, minWidth: '200px' }}>
          <FaSearch style={{ position: 'absolute', top: '12px', left: '10px', color: '#aaa' }} />
          <input 
            name="search"
            placeholder="Search notes by title or subject..." 
            onChange={handleFilterChange}
            style={{ paddingLeft: '35px', margin: 0 }}
          />
        </div>
        
        <select name="branch" onChange={handleFilterChange} style={{ flex: 1, margin: 0 }}>
          <option value="">All Branches</option>
          <option value="CS">Computer Science</option>
          <option value="IT">Information Tech</option>
          <option value="Mech">Mechanical</option>
        </select>

        <select name="semester" onChange={handleFilterChange} style={{ flex: 1, margin: 0 }}>
          <option value="">All Semesters</option>
          <option value="SEM I">Sem I</option>
          <option value="SEM II">Sem II</option>
          <option value="SEM III">Sem III</option>
        </select>
      </div>

      {/* 2. NOTES GRID */}
      <div className="notes-grid">
        {notes.length === 0 ? <p>No notes found matching your criteria.</p> : notes.map((note) => (
          <div key={note._id} className="note-card">
            <h4>{note.title}</h4>
            <p style={{color: '#aaa', fontSize: '0.9rem'}}>{note.subject} • {note.branch}</p>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
              <span>By: {note.uploadedBy?.username}</span>
              <a href={getFileURL(note.fileUrl)} target="_blank" rel="noopener noreferrer" style={{color: '#9C27B0'}}>Download</a>
            </div>
          </div>
        ))}
      </div>

      {/* 3. PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={() => handlePageChange(filters.page - 1)} 
            disabled={filters.page === 1}
            style={{ width: 'auto', padding: '10px 15px', opacity: filters.page === 1 ? 0.5 : 1 }}
          >
            <FaChevronLeft /> Prev
          </button>
          
          <span>Page {filters.page} of {totalPages}</span>
          
          <button 
            onClick={() => handlePageChange(filters.page + 1)} 
            disabled={filters.page === totalPages}
            style={{ width: 'auto', padding: '10px 15px', opacity: filters.page === totalPages ? 0.5 : 1 }}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* 4. UPLOAD SECTION (Collapsible logic could be added here, kept simple for now) */}
      <div className="auth-box" style={{width: '100%', boxSizing: 'border-box', marginTop: '40px'}}>
        <h3>Upload New Note</h3>
        <form onSubmit={handleUpload} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
          <input placeholder="Title" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <input placeholder="Subject" onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
          <select onChange={(e) => setFormData({...formData, branch: e.target.value})}>
            <option value="CS">Computer Science</option>
            <option value="IT">Information Tech</option>
          </select>
          <select onChange={(e) => setFormData({...formData, semester: e.target.value})}>
            <option value="SEM I">Sem I</option>
            <option value="SEM II">Sem II</option>
          </select>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          <button type="submit" style={{gridColumn: 'span 2'}}>Upload Note</button>
        </form>
      </div>
    </div>
  );
};

export default Notes;
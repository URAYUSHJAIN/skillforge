import React, { useState } from 'react';

const API_BASE = 'http://localhost:4000';

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    marginTop: '80px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#1e293b',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  section: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#475569',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  imagePreview: {
    width: '200px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '0.5rem',
    backgroundColor: '#e2e8f0',
  },
  lectureCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
  },
  lectureHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  chapterCard: {
    backgroundColor: '#fff',
    borderRadius: '6px',
    padding: '0.75rem',
    marginTop: '0.5rem',
    border: '1px solid #e2e8f0',
  },
  btn: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
  },
  btnPrimary: {
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  btnSecondary: {
    backgroundColor: '#64748b',
    color: '#fff',
  },
  btnDanger: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
  },
  btnSmall: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    color: '#ef4444',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
  },
  success: {
    color: '#16a34a',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
  },
};

const AddPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher: '',
    category: '',
    level: 'Beginner',
    pricingType: 'free',
    originalPrice: '',
    salePrice: '',
    language: 'English',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addLecture = () => {
    setLectures([...lectures, {
      id: Date.now(),
      title: '',
      description: '',
      chapters: [],
    }]);
  };

  const updateLecture = (lectureId, field, value) => {
    setLectures(lectures.map(lec => 
      lec.id === lectureId ? { ...lec, [field]: value } : lec
    ));
  };

  const removeLecture = (lectureId) => {
    setLectures(lectures.filter(lec => lec.id !== lectureId));
  };

  const addChapter = (lectureId) => {
    setLectures(lectures.map(lec => {
      if (lec.id === lectureId) {
        return {
          ...lec,
          chapters: [...lec.chapters, {
            id: Date.now(),
            title: '',
            videoUrl: '',
            duration: { hours: 0, minutes: 0 },
            isPreview: false,
          }]
        };
      }
      return lec;
    }));
  };

  const updateChapter = (lectureId, chapterId, field, value) => {
    setLectures(lectures.map(lec => {
      if (lec.id === lectureId) {
        return {
          ...lec,
          chapters: lec.chapters.map(ch =>
            ch.id === chapterId ? { ...ch, [field]: value } : ch
          )
        };
      }
      return lec;
    }));
  };

  const removeChapter = (lectureId, chapterId) => {
    setLectures(lectures.map(lec => {
      if (lec.id === lectureId) {
        return {
          ...lec,
          chapters: lec.chapters.filter(ch => ch.id !== chapterId)
        };
      }
      return lec;
    }));
  };

  const calculateTotals = () => {
    let totalLectures = lectures.length;
    let totalChapters = 0;
    let totalHours = 0;
    let totalMinutes = 0;

    lectures.forEach(lec => {
      totalChapters += lec.chapters.length;
      lec.chapters.forEach(ch => {
        totalHours += parseInt(ch.duration.hours) || 0;
        totalMinutes += parseInt(ch.duration.minutes) || 0;
      });
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return { totalLectures, totalChapters, totalHours, totalMinutes };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const totals = calculateTotals();
      
      const courseData = {
        name: formData.name,
        description: formData.description,
        teacher: formData.teacher,
        category: formData.category,
        level: formData.level,
        language: formData.language,
        pricingType: formData.pricingType,
        price: {
          original: formData.pricingType === 'paid' ? Number(formData.originalPrice) : 0,
          sale: formData.pricingType === 'paid' ? Number(formData.salePrice) : 0,
        },
        totalLectures: totals.totalLectures,
        totalDuration: {
          hours: totals.totalHours,
          minutes: totals.totalMinutes,
        },
        lectures: lectures.map(lec => ({
          title: lec.title,
          description: lec.description,
          chapters: lec.chapters.map(ch => ({
            title: ch.title,
            videoUrl: ch.videoUrl,
            duration: ch.duration,
            isPreview: ch.isPreview,
          })),
        })),
      };

      const formDataToSend = new FormData();
      formDataToSend.append('courseData', JSON.stringify(courseData));
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const res = await fetch(`${API_BASE}/api/course`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Course created successfully!');
        // Reset form
        setFormData({
          name: '',
          description: '',
          teacher: '',
          category: '',
          level: 'Beginner',
          pricingType: 'free',
          originalPrice: '',
          salePrice: '',
          language: 'English',
        });
        setImageFile(null);
        setImagePreview('');
        setLectures([]);
      } else {
        setError(data.message || 'Failed to create course');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Error creating course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Course</h1>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <form style={styles.form} onSubmit={handleSubmit}>
        {/* Basic Info Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📝 Basic Information</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Course Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter course name"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Enter course description"
              required
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Teacher Name *</label>
              <input
                type="text"
                name="teacher"
                value={formData.teacher}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Instructor name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="e.g., Programming, Design"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="e.g., English, Hindi"
              />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🖼️ Course Image</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.input}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 Pricing</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Pricing Type</label>
            <select
              name="pricingType"
              value={formData.pricingType}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {formData.pricingType === 'paid' && (
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Original Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sale Price (₹)</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Lectures Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📚 Lectures & Chapters</h2>
          
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <strong>Course Summary:</strong> {totals.totalLectures} lectures, {totals.totalChapters} chapters, 
            {totals.totalHours}h {totals.totalMinutes}m total
          </div>

          {lectures.map((lecture, lectureIndex) => (
            <div key={lecture.id} style={styles.lectureCard}>
              <div style={styles.lectureHeader}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Lecture {lectureIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeLecture(lecture.id)}
                  style={{ ...styles.btn, ...styles.btnDanger }}
                >
                  Remove
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Lecture Title</label>
                <input
                  type="text"
                  value={lecture.title}
                  onChange={(e) => updateLecture(lecture.id, 'title', e.target.value)}
                  style={styles.input}
                  placeholder="Enter lecture title"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Lecture Description</label>
                <textarea
                  value={lecture.description}
                  onChange={(e) => updateLecture(lecture.id, 'description', e.target.value)}
                  style={{ ...styles.textarea, minHeight: '60px' }}
                  placeholder="Brief description"
                />
              </div>

              {/* Chapters */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ ...styles.label, marginBottom: 0 }}>Chapters ({lecture.chapters.length})</label>
                  <button
                    type="button"
                    onClick={() => addChapter(lecture.id)}
                    style={{ ...styles.btn, ...styles.btnSecondary, ...styles.btnSmall }}
                  >
                    + Add Chapter
                  </button>
                </div>

                {lecture.chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} style={styles.chapterCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#475569' }}>Chapter {chapterIndex + 1}</strong>
                      <button
                        type="button"
                        onClick={() => removeChapter(lecture.id, chapter.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ ...styles.row, marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(lecture.id, chapter.id, 'title', e.target.value)}
                        style={styles.input}
                        placeholder="Chapter title"
                      />
                      <input
                        type="text"
                        value={chapter.videoUrl}
                        onChange={(e) => updateChapter(lecture.id, chapter.id, 'videoUrl', e.target.value)}
                        style={styles.input}
                        placeholder="Video URL"
                      />
                    </div>

                    <div style={{ ...styles.row, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="number"
                          value={chapter.duration.hours}
                          onChange={(e) => updateChapter(lecture.id, chapter.id, 'duration', { ...chapter.duration, hours: e.target.value })}
                          style={{ ...styles.input, width: '60px' }}
                          min="0"
                          placeholder="H"
                        />
                        <span>h</span>
                        <input
                          type="number"
                          value={chapter.duration.minutes}
                          onChange={(e) => updateChapter(lecture.id, chapter.id, 'duration', { ...chapter.duration, minutes: e.target.value })}
                          style={{ ...styles.input, width: '60px' }}
                          min="0"
                          max="59"
                          placeholder="M"
                        />
                        <span>m</span>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={chapter.isPreview}
                          onChange={(e) => updateChapter(lecture.id, chapter.id, 'isPreview', e.target.checked)}
                        />
                        Free Preview
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLecture}
            style={{ ...styles.btn, ...styles.btnPrimary }}
          >
            + Add Lecture
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Creating Course...' : '🚀 Create Course'}
        </button>
      </form>
    </div>
  );
};

export default AddPage;

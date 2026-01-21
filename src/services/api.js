// Mock API Service Layer
// This simulates backend API calls. In production, replace with actual API endpoints.

// ==================== STORAGE UTILITIES ====================
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }
};

// ==================== INITIALIZE MOCK DATA ====================
const initializeMockData = () => {
  // Online Classes
  if (!storage.get('onlineClasses')) {
    storage.set('onlineClasses', [
      {
        id: 1,
        title: 'Introduction to Digital Art',
        description: 'Learn the fundamentals of digital art using modern tools and techniques.',
        date: '2026-01-20',
        time: '10:00 AM',
        duration: '2 hours',
        instructor: 'Priya Sharma',
        instructorId: 1,
        meetingLink: 'https://zoom.us/j/123456789',
        platform: 'Zoom',
        type: 'regular',
        classId: 5,
        className: 'Digital Art',
        maxStudents: 30,
        enrolledStudents: [1, 2, 3, 4, 5],
        status: 'scheduled',
        materials: ['Digital tablet recommended', 'Software: Adobe Photoshop or Procreate'],
        createdAt: '2026-01-10T10:00:00Z'
      },
      {
        id: 2,
        title: 'Watercolor Techniques Live Session',
        description: 'Advanced watercolor blending and layering techniques demonstrated live.',
        date: '2026-01-22',
        time: '2:00 PM',
        duration: '1.5 hours',
        instructor: 'Raj Kumar',
        instructorId: 2,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        platform: 'Google Meet',
        type: 'regular',
        classId: 2,
        className: 'Watercolor Painting',
        maxStudents: 25,
        enrolledStudents: [1, 3, 6, 7],
        status: 'scheduled',
        materials: ['Watercolor set', 'Watercolor paper', 'Brushes set'],
        createdAt: '2026-01-12T14:00:00Z'
      },
      {
        id: 3,
        title: 'Portrait Drawing Workshop',
        description: 'Master portrait proportions and facial features in this intensive workshop.',
        date: '2026-01-25',
        time: '11:00 AM',
        duration: '3 hours',
        instructor: 'Ananya Desai',
        instructorId: 3,
        meetingLink: 'https://zoom.us/j/987654321',
        platform: 'Zoom',
        type: 'regular',
        classId: 8,
        className: 'Portrait Drawing',
        maxStudents: 20,
        enrolledStudents: [2, 4, 5, 8],
        status: 'scheduled',
        materials: ['Graphite pencils (2B, 4B, 6B)', 'Drawing paper', 'Eraser'],
        createdAt: '2026-01-13T09:00:00Z'
      }
    ]);
  }

  //  Classes
  if (!storage.get('Classes')) {
    storage.set('Classes', [
      {
        id: 1,
        studentId: 1,
        studentName: 'Alice Johnson',
        missedClassId: 1,
        missedClassName: 'Beginner Drawing',
        missedDate: '2026-01-15',
        reason: 'Sick leave',
        ClassId: 2,
        Title: 'Watercolor Techniques Live Session',
        Date: '2026-01-22',
        Time: '2:00 PM',
        status: 'assigned',
        assignedBy: 'Admin',
        assignedAt: '2026-01-16T10:00:00Z'
      }
    ]);
  }

  // Attendance Records
  if (!storage.get('attendanceRecords')) {
    storage.set('attendanceRecords', [
      {
        id: 1,
        studentId: 1,
        studentName: 'Alice Johnson',
        classId: 1,
        className: 'Beginner Drawing',
        classType: 'regular',
        date: '2026-01-10',
        time: '4:00 PM',
        status: 'present',
        markedBy: 'Priya Sharma',
        markedAt: '2026-01-10T16:05:00Z',
        notes: ''
      },
      {
        id: 2,
        studentId: 2,
        studentName: 'Bob Smith',
        classId: 1,
        className: 'Beginner Drawing',
        classType: 'regular',
        date: '2026-01-10',
        time: '4:00 PM',
        status: 'present',
        markedBy: 'Priya Sharma',
        markedAt: '2026-01-10T16:05:00Z',
        notes: ''
      },
      {
        id: 3,
        studentId: 1,
        studentName: 'Alice Johnson',
        classId: 1,
        className: 'Beginner Drawing',
        classType: 'regular',
        date: '2026-01-15',
        time: '4:00 PM',
        status: 'absent',
        markedBy: 'Priya Sharma',
        markedAt: '2026-01-15T16:05:00Z',
        notes: 'Sick leave'
      },
      {
        id: 4,
        studentId: 3,
        studentName: 'Charlie Brown',
        classId: 2,
        className: 'Oil Painting',
        classType: 'regular',
        date: '2026-01-12',
        time: '4:00 PM',
        status: 'late',
        markedBy: 'Jane Smith',
        markedAt: '2026-01-12T16:15:00Z',
        notes: 'Arrived 15 minutes late'
      }
    ]);
  }
  // Attendance Summary (computed from records)
  if (!storage.get('attendanceSummary')) {
    storage.set('attendanceSummary', {});
  }
};

// Initialize on load
initializeMockData();

// ==================== ONLINE CLASSES API ====================

export const onlineClassesAPI = {
  // Get all online classes
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    let classes = storage.get('onlineClasses') || [];
    
    // Apply filters
    if (filters.date) {
      classes = classes.filter(c => c.date === filters.date);
    }
    if (filters.instructor) {
      classes = classes.filter(c => c.instructor === filters.instructor);
    }
    if (filters.type) {
      classes = classes.filter(c => c.type === filters.type);
    }
    if (filters.status) {
      classes = classes.filter(c => c.status === filters.status);
    }
    
    return { success: true, data: classes };
  },

  // Get single online class
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const classes = storage.get('onlineClasses') || [];
    const classItem = classes.find(c => c.id === parseInt(id));
    
    if (classItem) {
      return { success: true, data: classItem };
    }
    return { success: false, error: 'Class not found' };
  },

  // Get classes for a specific student
  getByStudent: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classes = storage.get('onlineClasses') || [];
    const studentClasses = classes.filter(c => 
      c.enrolledStudents.includes(parseInt(studentId))
    );
    return { success: true, data: studentClasses };
  },

  // Create new online class
  create: async (classData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const classes = storage.get('onlineClasses') || [];
    const newClass = {
      ...classData,
      id: Date.now(),
      enrolledStudents: [],
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    classes.push(newClass);
    storage.set('onlineClasses', classes);
    return { success: true, data: newClass };
  },

  // Update online class
  update: async (id, classData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const classes = storage.get('onlineClasses') || [];
    const index = classes.findIndex(c => c.id === parseInt(id));
    
    if (index !== -1) {
      classes[index] = { ...classes[index], ...classData };
      storage.set('onlineClasses', classes);
      return { success: true, data: classes[index] };
    }
    return { success: false, error: 'Class not found' };
  },

  // Delete online class
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classes = storage.get('onlineClasses') || [];
    const filtered = classes.filter(c => c.id !== parseInt(id));
    storage.set('onlineClasses', filtered);
    return { success: true };
  },

  // Enroll student in online class
  enrollStudent: async (classId, studentId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classes = storage.get('onlineClasses') || [];
    const classItem = classes.find(c => c.id === parseInt(classId));
    
    if (classItem && !classItem.enrolledStudents.includes(studentId)) {
      classItem.enrolledStudents.push(studentId);
      storage.set('onlineClasses', classes);
      return { success: true, data: classItem };
    }
    return { success: false, error: 'Unable to enroll student' };
  }
};

// ====================  CLASSES API ====================

export const ClassesAPI = {
  // Get all  classes
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let s = storage.get('Classes') || [];
    
    if (filters.studentId) {
      s = s.filter(c => c.studentId === parseInt(filters.studentId));
    }
    if (filters.status) {
      s = s.filter(c => c.status === filters.status);
    }
    
    return { success: true, data: s };
  },

  // Get  classes for a student
  getByStudent: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const s = storage.get('Classes') || [];
    const students = s.filter(c => 
      c.studentId === parseInt(studentId)
    );
    return { success: true, data: students };
  },

  // Assign  class
  assign: async (Data) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const s = storage.get('Classes') || [];
    const newClass = {
      ...Data,
      id: Date.now(),
      status: 'assigned',
      assignedAt: new Date().toISOString()
    };
    s.push(newClass);
    storage.set('Classes', s);
    return { success: true, data: newClass };
  },

  // Update  class
  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const s = storage.get('Classes') || [];
    const index = s.findIndex(c => c.id === parseInt(id));
    
    if (index !== -1) {
      s[index] = { ...s[index], ...data };
      storage.set('Classes', s);
      return { success: true, data: s[index] };
    }
    return { success: false, error: ' class not found' };
  },

  // Delete  class
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const s = storage.get('Classes') || [];
    const filtered = s.filter(c => c.id !== parseInt(id));
    storage.set('Classes', filtered);
    return { success: true };
  }
};

// ==================== ATTENDANCE API ====================

export const attendanceAPI = {
  // Get all attendance records
  getAll: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let records = storage.get('attendanceRecords') || [];
    
    if (filters.date) {
      records = records.filter(r => r.date === filters.date);
    }
    if (filters.classId) {
      records = records.filter(r => r.classId === parseInt(filters.classId));
    }
    if (filters.studentId) {
      records = records.filter(r => r.studentId === parseInt(filters.studentId));
    }
    if (filters.status) {
      records = records.filter(r => r.status === filters.status);
    }
    if (filters.classType) {
      records = records.filter(r => r.classType === filters.classType);
    }
    
    return { success: true, data: records };
  },

  // Get attendance for a specific student
  getByStudent: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const records = storage.get('attendanceRecords') || [];
    const studentRecords = records.filter(r => r.studentId === parseInt(studentId));
    return { success: true, data: studentRecords };
  },

  // Get attendance summary for a student
  getSummary: async (studentId, filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const records = storage.get('attendanceRecords') || [];
    let studentRecords = records.filter(r => r.studentId === parseInt(studentId));
    
    // Apply filters
    if (filters.classId) {
      studentRecords = studentRecords.filter(r => r.classId === parseInt(filters.classId));
    }
    if (filters.startDate && filters.endDate) {
      studentRecords = studentRecords.filter(r => 
        r.date >= filters.startDate && r.date <= filters.endDate
      );
    }
    
    const total = studentRecords.length;
    const present = studentRecords.filter(r => r.status === 'present').length;
    const absent = studentRecords.filter(r => r.status === 'absent').length;
    const late = studentRecords.filter(r => r.status === 'late').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return {
      success: true,
      data: {
        total,
        present,
        absent,
        late,
        percentage,
        records: studentRecords
      }
    };
  },

  // Mark attendance for a student
  mark: async (attendanceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const records = storage.get('attendanceRecords') || [];
    
    // Check if attendance already exists for this student, class, and date
    const existingIndex = records.findIndex(r =>
      r.studentId === attendanceData.studentId &&
      r.classId === attendanceData.classId &&
      r.date === attendanceData.date
    );
    
    if (existingIndex !== -1) {
      // Update existing record
      records[existingIndex] = {
        ...records[existingIndex],
        ...attendanceData,
        markedAt: new Date().toISOString()
      };
    } else {
      // Create new record
      const newRecord = {
        ...attendanceData,
        id: Date.now(),
        markedAt: new Date().toISOString()
      };
      records.push(newRecord);
    }
    
    storage.set('attendanceRecords', records);
    return { success: true, data: records[existingIndex] || records[records.length - 1] };
  },

  // Bulk mark attendance
  bulkMark: async (attendanceList) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const records = storage.get('attendanceRecords') || [];
    
    attendanceList.forEach(attendanceData => {
      const existingIndex = records.findIndex(r =>
        r.studentId === attendanceData.studentId &&
        r.classId === attendanceData.classId &&
        r.date === attendanceData.date
      );
      
      if (existingIndex !== -1) {
        records[existingIndex] = {
          ...records[existingIndex],
          ...attendanceData,
          markedAt: new Date().toISOString()
        };
      } else {
        records.push({
          ...attendanceData,
          id: Date.now() + Math.random(),
          markedAt: new Date().toISOString()
        });
      }
    });
    
    storage.set('attendanceRecords', records);
    return { success: true, data: records };
  },

  // Delete attendance record
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const records = storage.get('attendanceRecords') || [];
    const filtered = records.filter(r => r.id !== parseInt(id));
    storage.set('attendanceRecords', filtered);
    return { success: true };
  }
};

// ==================== ENROLLMENTS/STUDENTS API ====================

export const enrollmentsAPI = {
  // Get all enrolled students
  getEnrolledStudents: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock enrolled students data
    let students = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', enrolledClasses: [1, 2, 5], status: 'active' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', enrolledClasses: [1, 3], status: 'active' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', enrolledClasses: [1, 4], status: 'active' },
      { id: 4, name: 'Diana Prince', email: 'diana@example.com', enrolledClasses: [2, 3], status: 'active' },
      { id: 5, name: 'Emma Watson', email: 'emma@example.com', enrolledClasses: [1, 2], status: 'active' },
      { id: 6, name: 'Frank Miller', email: 'frank@example.com', enrolledClasses: [2, 4], status: 'active' },
      { id: 7, name: 'Grace Lee', email: 'grace@example.com', enrolledClasses: [2, 5], status: 'active' },
      { id: 8, name: 'Henry Wilson', email: 'henry@example.com', enrolledClasses: [3], status: 'active' }
    ];
    
    // Filter by class if provided
    if (filters.classId) {
      students = students.filter(s => s.enrolledClasses.includes(parseInt(filters.classId)));
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      students = students.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower)
      );
    }
    
    return { success: true, data: students };
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const response = await enrollmentsAPI.getEnrolledStudents();
    const student = response.data.find(s => s.id === parseInt(studentId));
    
    if (student) {
      return { success: true, data: student };
    }
    return { success: false, error: 'Student not found' };
  }
};

// Export default object with all APIs
export default {
  onlineClasses: onlineClassesAPI,
  Classes: ClassesAPI,
  attendance: attendanceAPI,
  enrollments: enrollmentsAPI
};

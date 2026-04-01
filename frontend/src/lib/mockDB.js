// This file simulates a Database with LocalStorage to persist data for the Viva Demo
// It encompasses all 6 requested Intelligence Types.

const DB_KEY = 'smart_mentorship_db_v8';

const initialData = {
  // 1️⃣ USER TABLES (Base Layer)
  users: [
    { id: 'u1', name: 'Newton', email: 'newton@student.com', role: 'student', password: 'password123', created_at: new Date().toISOString() },
    { id: 'u2', name: 'Senthil Kumar', email: 'senthil@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u3', name: 'Dr. Prakash', email: 'prakash@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u4', name: 'Dr. MMK Venamoorthy', email: 'venamoorthy@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u5', name: 'Mr. Tiwari', email: 'tiwari@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u6', name: 'Dr. Geetha S.', email: 'geetha@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u7', name: 'Dr. Mohit', email: 'mohit@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u8', name: 'Mr. Karan Kumar', email: 'karan@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u9', name: 'Dr. Kshama Trivedi', email: 'kshama@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u10', name: 'Krish Patel', email: 'krish@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u11', name: 'Kaushik Murudkar', email: 'kaushik@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u12', name: 'Kunal Vasdani', email: 'kunal@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() },
    { id: 'u13', name: 'Vraj Shah', email: 'vraj@mentor.com', role: 'mentor', password: 'password', created_at: new Date().toISOString() }
  ],
  student_profile: [
    { user_id: 'u1', college: 'Tech University', branch: 'Computer Science', target_role: 'Machine Learning Engineer' }
  ],
  mentor_profile: [
    { user_id: 'u2', experience_years: 7, bio: 'Machine Learning Specialist focusing on Advanced AI', availability_status: 'available', avg_rating: 4.8 },
    { user_id: 'u3', experience_years: 3, bio: 'Teaching foundations of Machine Learning', availability_status: 'available', avg_rating: 4.5 },
    { user_id: 'u4', experience_years: 5, bio: 'Web Development Intermediate Architect', availability_status: 'available', avg_rating: 4.7 },
    { user_id: 'u5', experience_years: 2, bio: 'Web Technologies basics instructor', availability_status: 'available', avg_rating: 4.4 },
    { user_id: 'u6', experience_years: 6, bio: 'Cyber Security Consultant and Auditor', availability_status: 'available', avg_rating: 4.9 },
    { user_id: 'u7', experience_years: 1, bio: 'Cyber Security Awareness and Basics', availability_status: 'available', avg_rating: 4.2 },
    { user_id: 'u8', experience_years: 2, bio: 'Mobile App fundamentals using Flutter', availability_status: 'available', avg_rating: 4.3 },
    { user_id: 'u9', experience_years: 8, bio: 'Senior Mobile Apps Developer natively in Swift/Kotlin', availability_status: 'available', avg_rating: 4.9 },
    { user_id: 'u10', experience_years: 5, bio: 'Data Scientist at BigTech', availability_status: 'available', avg_rating: 4.8 },
    { user_id: 'u11', experience_years: 4, bio: 'Web Development Lead', availability_status: 'available', avg_rating: 4.6 },
    { user_id: 'u12', experience_years: 12, bio: 'Chief Security Officer', availability_status: 'available', avg_rating: 5.0 },
    { user_id: 'u13', experience_years: 8, bio: 'Senior Mobile App Developer', availability_status: 'available', avg_rating: 4.9 }
  ],

  // 2️⃣ NLP MODULE DATA (Query Understanding)
  queries: [
    { id: 'q1', student_id: 'u1', title: 'How to start machine learning as a beginner?', description: 'I know Python but no math.', domain: 'Machine Learning', created_at: new Date().toISOString(), status: 'pending' }
  ],
  query_embeddings: [
    { query_id: 'q1', embedding_vector: [0.12, 0.45, 0.88, 0.32] } // Mock embedding
  ],
  mentor_expertise: [
    { mentor_id: 'u2', domain: 'Machine Learning', skills_text: 'Machine Learning, Deep Learning, Neural Networks', level: 'Advanced' },
    { mentor_id: 'u3', domain: 'Machine Learning', skills_text: 'Python, Basics of ML, Pandas, Regression', level: 'Beginner' },
    { mentor_id: 'u4', domain: 'Web Development', skills_text: 'React, Node.js, Express, Full-stack', level: 'Intermediate' },
    { mentor_id: 'u5', domain: 'Web Development', skills_text: 'HTML, CSS, JavaScript Basics', level: 'Beginner' },
    { mentor_id: 'u6', domain: 'Cyber Security', skills_text: 'Penetration Testing, Cryptography, Networks', level: 'Intermediate' },
    { mentor_id: 'u7', domain: 'Cyber Security', skills_text: 'Basic IT Security, Firewalls setup', level: 'Beginner' },
    { mentor_id: 'u8', domain: 'Mobile Development', skills_text: 'Flutter Basics, React Native Hooks', level: 'Beginner' },
    { mentor_id: 'u9', domain: 'Mobile Development', skills_text: 'Swift, Kotlin, Native App Architecture', level: 'Intermediate' },
    { mentor_id: 'u10', domain: 'Machine Learning', skills_text: 'Machine Learning, Python, Data Science, Pandas', level: 'Intermediate' },
    { mentor_id: 'u11', domain: 'Web Development', skills_text: 'React, Node.js, HTML, CSS, JavaScript', level: 'Advanced' },
    { mentor_id: 'u12', domain: 'Cyber Security', skills_text: 'Network Security, Penetration Testing, Cryptography', level: 'Expert' },
    { mentor_id: 'u13', domain: 'Mobile Development', skills_text: 'React Native, Flutter, Swift, Kotlin, Mobile App Development', level: 'Expert' }
  ],
  mentor_embeddings: [
    { mentor_id: 'u2', embedding_vector: [0.1] },
    { mentor_id: 'u3', embedding_vector: [0.1] },
    { mentor_id: 'u4', embedding_vector: [0.1] },
    { mentor_id: 'u5', embedding_vector: [0.1] },
    { mentor_id: 'u6', embedding_vector: [0.1] },
    { mentor_id: 'u7', embedding_vector: [0.1] },
    { mentor_id: 'u8', embedding_vector: [0.1] },
    { mentor_id: 'u9', embedding_vector: [0.1] },
    { mentor_id: 'u10', embedding_vector: [0.1] },
    { mentor_id: 'u11', embedding_vector: [0.1] },
    { mentor_id: 'u12', embedding_vector: [0.1] },
    { mentor_id: 'u13', embedding_vector: [0.1] }
  ],

  // 3️⃣ SKILL ASSESSMENT MODULE
  quizzes: [],
  quiz_questions: [],
  student_quiz_attempts: [],
  student_skill_profile: [
    { student_id: 'u1', domain: 'Machine Learning', level: 'Beginner', avg_score: 45, improvement_rate: 0.1, confidence_score: 0.6, last_updated: new Date().toISOString() },
    { student_id: 'u1', domain: 'Python', level: 'Intermediate', avg_score: 75, improvement_rate: 0.5, confidence_score: 0.8, last_updated: new Date().toISOString() }
  ],
  student_topic_performance: [
    { student_id: 'u1', domain: 'Machine Learning', topic: 'Neural Networks', total_attempts: 2, correct_answers: 0, last_updated: new Date().toISOString() },
    { student_id: 'u1', domain: 'Python', topic: 'List Comprehension', total_attempts: 2, correct_answers: 2, last_updated: new Date().toISOString() }
  ],

  // 4️⃣ INTERACTION DATA (For Recommendation)
  mentor_assignments: [],
  chat_messages: [],
  feedback: [],
  mentor_performance: [
    { mentor_id: 'u2', avg_rating: 4.8, total_sessions: 50, success_rate: 95, avg_response_time: 10 },
    { mentor_id: 'u3', avg_rating: 4.5, total_sessions: 20, success_rate: 85, avg_response_time: 25 },
    { mentor_id: 'u4', avg_rating: 4.7, total_sessions: 40, success_rate: 90, avg_response_time: 15 },
    { mentor_id: 'u5', avg_rating: 4.4, total_sessions: 10, success_rate: 80, avg_response_time: 30 },
    { mentor_id: 'u6', avg_rating: 4.9, total_sessions: 60, success_rate: 98, avg_response_time: 5 },
    { mentor_id: 'u7', avg_rating: 4.2, total_sessions: 5, success_rate: 75, avg_response_time: 40 },
    { mentor_id: 'u8', avg_rating: 4.3, total_sessions: 15, success_rate: 85, avg_response_time: 20 },
    { mentor_id: 'u9', avg_rating: 4.9, total_sessions: 45, success_rate: 95, avg_response_time: 12 },
    { mentor_id: 'u10', avg_rating: 4.8, total_sessions: 24, success_rate: 95, avg_response_time: 15 },
    { mentor_id: 'u11', avg_rating: 4.6, total_sessions: 15, success_rate: 90, avg_response_time: 25 },
    { mentor_id: 'u12', avg_rating: 5.0, total_sessions: 80, success_rate: 100, avg_response_time: 5 },
    { mentor_id: 'u13', avg_rating: 4.9, total_sessions: 40, success_rate: 98, avg_response_time: 10 }
  ],

  // 5️⃣ HYBRID RECOMMENDATION (CONVERGENCE POINT)
  recommendation_logs: [],

  // 6️⃣ GEMINI AI (Assistant Layer)
  ai_interactions: []
};

// Initialize DB if not present
export const initDB = () => {
  const existingData = localStorage.getItem(DB_KEY);
  if (!existingData) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  } else {
    // Migrate old profiles that lack a password
    try {
      const parsed = JSON.parse(existingData);
      let needsMigration = false;
      // Auto-inject missing structural mentors into cache safely
      initialData.users.forEach(initItem => {
          if (!parsed.users.find(u => u.id === initItem.id)) {
              parsed.users.push(initItem);
              needsMigration = true;
          }
      });
      initialData.mentor_profile.forEach(initItem => {
          if (!parsed.mentor_profile.find(m => m.user_id === initItem.user_id)) parsed.mentor_profile.push(initItem);
      });
      initialData.mentor_expertise.forEach(initItem => {
          if (!parsed.mentor_expertise.find(m => m.mentor_id === initItem.mentor_id)) parsed.mentor_expertise.push(initItem);
      });
      initialData.mentor_embeddings.forEach(initItem => {
          if (!parsed.mentor_embeddings.find(m => m.mentor_id === initItem.mentor_id)) parsed.mentor_embeddings.push(initItem);
      });
      initialData.mentor_performance.forEach(initItem => {
          if (!parsed.mentor_performance.find(m => m.mentor_id === initItem.mentor_id)) parsed.mentor_performance.push(initItem);
      });

      if (parsed.users) {
        const prevLen = parsed.users.length;
        parsed.users = parsed.users.filter(u => initialData.users.some(initU => initU.id === u.id));
        if (parsed.mentor_profile) parsed.mentor_profile = parsed.mentor_profile.filter(m => initialData.mentor_profile.some(initM => initM.user_id === m.user_id));
        if (parsed.mentor_expertise) parsed.mentor_expertise = parsed.mentor_expertise.filter(m => initialData.mentor_expertise.some(initM => initM.mentor_id === m.mentor_id));
        if (parsed.mentor_embeddings) parsed.mentor_embeddings = parsed.mentor_embeddings.filter(m => initialData.mentor_embeddings.some(initM => initM.mentor_id === m.mentor_id));
        if (parsed.mentor_performance) parsed.mentor_performance = parsed.mentor_performance.filter(m => initialData.mentor_performance.some(initM => initM.mentor_id === m.mentor_id));
        if (parsed.users.length !== prevLen) needsMigration = true;

        parsed.users.forEach(u => {
          if (!u.password) {
            u.password = 'password123';
            needsMigration = true;
          }
        });
      }
      if (needsMigration) {
        localStorage.setItem(DB_KEY, JSON.stringify(parsed));
      }
    } catch (e) {
      console.error('Failed to migrate mock DB', e);
    }
  }
};

const readDB = () => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : initialData;
};

const writeDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- MOCK DATABASE API METHODS ---

export const getTable = (tableName) => {
  const db = readDB();
  return db[tableName] || [];
};

export const insertIntoTable = (tableName, record) => {
  const db = readDB();
  if (!db[tableName]) db[tableName] = [];
  db[tableName].push(record);
  writeDB(db);
  return record;
};

import { generateEmbedding } from './embeddingService';

export const updateInTable = (tableName, predicate, updates) => {
  const db = readDB();
  const index = (db[tableName] || []).findIndex(predicate);
  if (index !== -1) {
    db[tableName][index] = { ...db[tableName][index], ...updates };
    writeDB(db);
  }
};

export const generateMockEmbedding = async (text) => {
  return await generateEmbedding(text);
};

// Cosine similarity mock
export const calculateSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const findBestMentorForQuery = async (queryId) => {
  const db = readDB();
  const query = db.queries.find(q => q.id === queryId);
  if (!query) return null;

  const queryEmb = db.query_embeddings.find(qe => qe.query_id === queryId)?.embedding_vector;
  const studentSkills = db.student_skill_profile.filter(s => s.student_id === query.student_id);
  const studentDomainSkill = studentSkills.find(s => s.domain === query.domain);
  
  let bestMatch = null;
  let highestScore = -1;

  for (const mentor of db.mentor_profile) {
    // STRICT DOMAIN FILTER: ONLY MENTORS EXPERT IN THIS DOMAIN CAN ANSWER!
    const expertise = db.mentor_expertise.find(me => me.mentor_id === mentor.user_id);
    if (!expertise || expertise.domain !== query.domain) {
        continue; // Hard reject. This mentor cannot see or answer this query.
    }

    // 1. Text Intelligence (Query Similarity)
    let mentorEmbRow = db.mentor_embeddings.find(me => me.mentor_id === mentor.user_id);
    let mentorEmb = mentorEmbRow?.embedding_vector;

    // LAZY REAL EMBEDDING GENERATION
    // Since initialData is mock 4 dim array, we lazy evaluate true 384 dim arrays to prevent browser blocking
    if (mentorEmb && mentorEmb.length < 10) {
        const skillsText = expertise.skills_text + " " + expertise.domain + " " + mentor.bio;
        mentorEmb = await generateEmbedding(skillsText);
        // Update it in the local state so the rest of the app doesn't refetch
        if (mentorEmbRow) {
            mentorEmbRow.embedding_vector = mentorEmb;
            writeDB(db); // persist
        }
    }

    // Since generateEmbedding creates true vectors mapped mathematically via huggingface
    const similarityScore = calculateSimilarity(queryEmb, mentorEmb) || 0;
    
    // 2. User Intelligence (Skill match verified)
    const levelValues = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    const studentLevelVal = studentDomainSkill ? (levelValues[studentDomainSkill.level] || 1) : 1;
    const mentorLevelVal = levelValues[expertise.level] || 3;

    let skillMatchScore = 0;
    // PERFECT MATCH if the mentor is specifically mapped to teach the student's exact current skill bracket
    if (mentorLevelVal === studentLevelVal) {
        skillMatchScore = 1.0;
    } else if (mentorLevelVal > studentLevelVal) {
        // Mentor is higher level, still an okay fit but maybe overqualified 
        if (mentorLevelVal - studentLevelVal === 1) skillMatchScore = 0.8;
        else skillMatchScore = 0.6; 
    } else {
        // Mentor is assigned to a lower level than the student's competence
        skillMatchScore = 0.2;
    }

    // 3. Interaction Intelligence (Mentor Performance)
    const mentorPerf = db.mentor_performance.find(mp => mp.mentor_id === mentor.user_id);
    const ratingScore = mentorPerf ? (mentorPerf.avg_rating / 5) * 1.0 : 0.5; // normalized to 0-1

    // Hybrid Formula: 40% Text Match, 30% Rating Performance, 30% Assigned Skill Score Gap Match
    const finalScore = (similarityScore * 0.4) + (ratingScore * 0.3) + (skillMatchScore * 0.3);

    // Logging this evaluation for Viva
    const logId = 'log_' + Date.now() + Math.random().toString(36).substr(2, 5);
    const logData = {
      id: logId,
      query_id: queryId,
      student_id: query.student_id,
      mentor_id: mentor.user_id,
      query_similarity_score: similarityScore.toFixed(3),
      skill_match_score: skillMatchScore.toFixed(3),
      rating_score: ratingScore.toFixed(3),
      final_score: finalScore.toFixed(3),
      selected: false,
      created_at: new Date().toISOString()
    };
    
    db.recommendation_logs.push(logData);

    if (finalScore > highestScore) {
      highestScore = finalScore;
      bestMatch = { mentor, logData };
    }
  }

  // Mark the best one as selected
  if (bestMatch) {
    const logIndex = db.recommendation_logs.findIndex(l => l.id === bestMatch.logData.id);
    if (logIndex !== -1) {
      db.recommendation_logs[logIndex].selected = true;
    }
    
    // Auto-assign
    db.mentor_assignments.push({
      id: 'assign_' + Date.now(),
      query_id: queryId,
      mentor_id: bestMatch.mentor.user_id,
      assigned_at: new Date().toISOString(),
      accepted: 'no' // pending
    });
  }

  writeDB(db);
  return bestMatch;
};

// --- MOCK FEEDBACK ENGINE ---
export const submitFeedback = (queryId, studentId, rating, comment) => {
  const db = readDB();
  
  const query = db.queries.find(q => q.id === queryId);
  if (!query) return false;
  
  // Find the mentor who successfully accepted the query
  const assignment = db.mentor_assignments.find(a => a.query_id === queryId && a.accepted === 'yes');
  if (!assignment) return false;
  
  const mentorId = assignment.mentor_id;

  // Insert feedback
  db.feedback.push({
      id: 'fb_' + Date.now(),
      query_id: queryId,
      student_id: studentId,
      mentor_id: mentorId,
      rating: rating,
      comment: comment,
      created_at: new Date().toISOString()
  });

  // Calculate new mentor rating and increment total sessions realistically mapped to resolved queries
  const mentorPerfIndex = db.mentor_performance.findIndex(mp => mp.mentor_id === mentorId);
  if (mentorPerfIndex !== -1) {
      const perf = db.mentor_performance[mentorPerfIndex];
      const newTotalSessions = perf.total_sessions + 1;
      const newAvgRating = ((perf.avg_rating * perf.total_sessions) + rating) / newTotalSessions;
      
      db.mentor_performance[mentorPerfIndex] = {
          ...perf,
          total_sessions: newTotalSessions,
          avg_rating: Number(newAvgRating.toFixed(1))
      };
      
      // Also update the mentor_profile rating value which serves basic views
      const profileIndex = db.mentor_profile.findIndex(mp => mp.user_id === mentorId);
      if (profileIndex !== -1) {
          db.mentor_profile[profileIndex] = {
              ...db.mentor_profile[profileIndex],
              avg_rating: Number(newAvgRating.toFixed(1))
          };
      }
  }

  writeDB(db);
  return true;
};

import { redirect } from 'next/navigation';
import { getUser } from '@/actions/auth';
import { createSundaySchool, createHeadMaster, createTeacher, createStudent, bulkUploadTeachers, bulkUploadStudents } from '@/actions/admin';
import db from '@/lib/db';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const user = await getUser();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const sundaySchools = db.prepare('SELECT * FROM sunday_schools').all() as { id: number, name: string }[];
  const users = db.prepare(`
    SELECT u.*, 
      ss.name as ss_name, 
      hm.name as hm_name, 
      t.name as t_name, 
      c.name as class_name
    FROM users u
    LEFT JOIN sunday_schools ss ON u.sunday_school_id = ss.id
    LEFT JOIN users hm ON u.headmaster_id = hm.id
    LEFT JOIN users t ON u.teacher_id = t.id
    LEFT JOIN classes c ON u.class_id = c.id
  `).all() as any[];
  
  const classes = db.prepare('SELECT * FROM classes').all() as { id: number, name: string }[];

  const headMasters = users.filter(u => u.role === 'head_master');
  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Hierarchical Dashboard</h1>
        <p className={styles.subtitle}>Manage schools, head masters, teachers, and students.</p>
      </header>

      <div className={styles.grid}>
        
        {/* 1. Add Sunday School */}
        <div className="glass-card">
          <h2>1. Add Sunday School</h2>
          <form action={createSundaySchool} className={styles.form}>
            <div className="form-group">
              <label className="form-label">School Name</label>
              <input type="text" name="name" className="form-input" required placeholder="e.g., Sunday School 7" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Sunday School</button>
          </form>

          <h3 style={{ marginTop: '2rem' }}>Current Schools</h3>
          <ul style={{ paddingLeft: '1rem', color: '#a0a3b0' }}>
            {sundaySchools.map(ss => <li key={ss.id}>{ss.name}</li>)}
          </ul>
        </div>

        {/* 2. Add Head Master */}
        <div className="glass-card">
          <h2>2. Add Head Master</h2>
          <form action={createHeadMaster} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Assign to Sunday School</label>
              <select name="sundaySchoolId" className="form-input" required>
                <option value="">-- Select Sunday School --</option>
                {sundaySchools.map(ss => <option key={ss.id} value={ss.id}>{ss.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Head Master</button>
          </form>

          <h3 style={{ marginTop: '2rem' }}>Current Head Masters</h3>
          <ul style={{ paddingLeft: '1rem', color: '#a0a3b0', fontSize: '0.9rem' }}>
            {headMasters.map(hm => <li key={hm.id}>{hm.name} ({hm.ss_name})</li>)}
          </ul>
        </div>

        {/* 3. Add Teacher */}
        <div className="glass-card">
          <h2>3. Add Teacher</h2>
          <form action={createTeacher} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Assign under Head Master</label>
              <select name="headMasterId" className="form-input" required>
                <option value="">-- Select Head Master --</option>
                {headMasters.map(hm => <option key={hm.id} value={hm.id}>{hm.name} ({hm.ss_name})</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Teacher</button>
          </form>

          <h3 style={{ marginTop: '2rem' }}>Current Teachers</h3>
          <ul style={{ paddingLeft: '1rem', color: '#a0a3b0', fontSize: '0.9rem' }}>
            {teachers.map(t => <li key={t.id}>{t.name} (Under: {t.hm_name})</li>)}
          </ul>
        </div>

        {/* 4. Add Student */}
        <div className="glass-card">
          <h2>4. Add Student</h2>
          <form action={createStudent} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" required />
            </div>
            
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" name="dob" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Parents Name</label>
              <input type="text" name="parentsName" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input type="text" name="contactNumber" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Other Activity</label>
              <input type="text" name="otherActivity" className="form-input" placeholder="e.g. Altar Boy, Choir" />
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

            <div className="form-group">
              <label className="form-label">Assign under Teacher</label>
              <select name="teacherId" className="form-input" required>
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.ss_name})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assign Class</label>
              <select name="classId" className="form-input" required>
                <option value="">-- Select Class --</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Student</button>
          </form>
        </div>

      </div>

      <div style={{ marginTop: '4rem' }} className="glass-card">
        <h2>Students Roster</h2>
        <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', color: '#fff', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ padding: '0.5rem' }}>Name</th>
              <th style={{ padding: '0.5rem' }}>School</th>
              <th style={{ padding: '0.5rem' }}>Class</th>
              <th style={{ padding: '0.5rem' }}>Teacher</th>
              <th style={{ padding: '0.5rem' }}>Parents</th>
              <th style={{ padding: '0.5rem' }}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.5rem' }}>{s.name}</td>
                <td style={{ padding: '0.5rem' }}>{s.ss_name}</td>
                <td style={{ padding: '0.5rem' }}>{s.class_name}</td>
                <td style={{ padding: '0.5rem' }}>{s.t_name}</td>
                <td style={{ padding: '0.5rem' }}>{s.parents_name}</td>
                <td style={{ padding: '0.5rem' }}>{s.contact_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass-card">
          <h2>Bulk Upload Teachers (CSV)</h2>
          <p style={{ color: '#a0a3b0', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <strong>Expected Columns:</strong> <code>name, username, password, headmaster_id</code>
          </p>
          <form action={bulkUploadTeachers} className={styles.form}>
            <div className="form-group">
              <input type="file" name="file" accept=".csv" className="form-input" required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Upload Teachers</button>
          </form>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Reference: Head Master IDs</h4>
          <ul style={{ paddingLeft: '1rem', color: '#a0a3b0', fontSize: '0.85rem' }}>
            {headMasters.map(hm => <li key={hm.id}>ID <strong>{hm.id}</strong>: {hm.name} ({hm.ss_name})</li>)}
          </ul>
        </div>

        <div className="glass-card">
          <h2>Bulk Upload Students (CSV)</h2>
          <p style={{ color: '#a0a3b0', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <strong>Expected Columns:</strong><br />
            <code>name, username, password, teacher_id, class_id, dob, parents_name, contact_number, other_activity</code>
          </p>
          <form action={bulkUploadStudents} className={styles.form}>
            <div className="form-group">
              <input type="file" name="file" accept=".csv" className="form-input" required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Upload Students</button>
          </form>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Reference: Teacher & Class IDs</h4>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <ul style={{ paddingLeft: '1rem', color: '#a0a3b0', fontSize: '0.85rem', flex: 1 }}>
              {teachers.map(t => <li key={t.id}>Teacher <strong>{t.id}</strong>: {t.name}</li>)}
            </ul>
            <ul style={{ paddingLeft: '1rem', color: '#a0a3b0', fontSize: '0.85rem', flex: 1 }}>
              {classes.slice(0, 5).map(c => <li key={c.id}>Class <strong>{c.id}</strong>: {c.name}</li>)}
              <li><em>...and so on</em></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

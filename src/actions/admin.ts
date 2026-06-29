'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';
import { getUser } from './auth';

export async function createSundaySchool(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  if (!name) return;

  db.prepare('INSERT INTO sunday_schools (name) VALUES (?)').run(name);
  revalidatePath('/admin');
}

export async function createHeadMaster(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const sundaySchoolId = formData.get('sundaySchoolId') as string;

  if (!name || !username || !password || !sundaySchoolId) return;

  db.prepare(`
    INSERT INTO users (name, username, password, role, sunday_school_id)
    VALUES (?, ?, ?, 'head_master', ?)
  `).run(name, username, password, parseInt(sundaySchoolId, 10));

  revalidatePath('/admin');
}

export async function createTeacher(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const headMasterIdStr = formData.get('headMasterId') as string;

  if (!name || !username || !password || !headMasterIdStr) return;

  const headMasterId = parseInt(headMasterIdStr, 10);
  
  // Find Head Master's Sunday School
  const headMaster = db.prepare('SELECT sunday_school_id FROM users WHERE id = ? AND role = "head_master"').get(headMasterId) as { sunday_school_id: number };
  if (!headMaster) return;

  db.prepare(`
    INSERT INTO users (name, username, password, role, headmaster_id, sunday_school_id)
    VALUES (?, ?, ?, 'teacher', ?, ?)
  `).run(name, username, password, headMasterId, headMaster.sunday_school_id);

  revalidatePath('/admin');
}

export async function createStudent(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const teacherIdStr = formData.get('teacherId') as string;
  const classIdStr = formData.get('classId') as string;
  
  // New fields
  const dob = formData.get('dob') as string;
  const parentsName = formData.get('parentsName') as string;
  const contactNumber = formData.get('contactNumber') as string;
  const otherActivity = formData.get('otherActivity') as string;

  if (!name || !username || !password || !teacherIdStr || !classIdStr) return;

  const teacherId = parseInt(teacherIdStr, 10);
  const classId = parseInt(classIdStr, 10);

  // Find Teacher's Sunday School
  const teacher = db.prepare('SELECT sunday_school_id FROM users WHERE id = ? AND role = "teacher"').get(teacherId) as { sunday_school_id: number };
  if (!teacher) return;

  db.prepare(`
    INSERT INTO users (
      name, username, password, role, 
      teacher_id, class_id, sunday_school_id,
      dob, parents_name, contact_number, other_activity
    )
    VALUES (?, ?, ?, 'student', ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, username, password, 
    teacherId, classId, teacher.sunday_school_id,
    dob || null, parentsName || null, contactNumber || null, otherActivity || null
  );

  revalidatePath('/admin');
}

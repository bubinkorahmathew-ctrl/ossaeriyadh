'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';
import { getUser } from './auth';

export async function createUser(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const role = formData.get('role') as string;

  if (!name || !role) return;

  const insertUser = db.prepare('INSERT INTO users (name, role) VALUES (?, ?)');
  insertUser.run(name, role);

  revalidatePath('/admin');
}

export async function createClass(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const teacherId = formData.get('teacherId') as string;

  if (!name || !teacherId) return;

  const insertClass = db.prepare('INSERT INTO classes (name, teacher_id) VALUES (?, ?)');
  insertClass.run(name, parseInt(teacherId, 10));

  revalidatePath('/admin');
}

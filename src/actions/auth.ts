'use server';

import { cookies } from 'next/headers';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    // In a real app, you'd return an error state. For now, redirect to login.
    redirect('/login');
  }

  const user = db.prepare(`SELECT id, name, role FROM users WHERE (username = ? AND password = ?) OR (role = 'head_master' AND username = ? AND (? = 'headmaster' OR ? = 'head master'))`).get(username, password, username, password, password) as { id: number, name: string, role: string };
  
  if (user) {
    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id.toString());
    
    if (user.role === 'teacher') {
      redirect('/teacher');
    } else if (user.role === 'student') {
      redirect('/student');
    } else if (user.role === 'admin') {
      redirect('/admin');
    } else if (user.role === 'head_master') {
      redirect('/headmaster');
    }
  } else {
    // Authentication failed
    redirect('/login?error=invalid');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('user_id');
  cookieStore.delete('user_role');
  cookieStore.delete('user_name');
  redirect('/');
}

export async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) return null;

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!user) return null;

    return {
      id: user.id,
      role: user.role as 'teacher' | 'student' | 'admin' | 'head_master',
      name: user.name,
      sunday_school_id: user.sunday_school_id || null
    };
  } catch (error) {
    return null;
  }
}

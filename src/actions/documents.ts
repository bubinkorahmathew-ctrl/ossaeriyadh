'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import fs from 'fs';

export async function uploadDocument(formData: FormData) {
  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const classId = formData.get('classId') as string;
  const uploaderId = formData.get('uploaderId') as string;
  const sundaySchoolId = formData.get('sundaySchoolId') as string;

  if (!file || !title || !classId || !uploaderId || !sundaySchoolId) {
    throw new Error('Missing required fields');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const insertDoc = db.prepare(`
    INSERT INTO documents (title, description, file_path, class_id, sunday_school_id, uploaded_by) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  insertDoc.run(title, description, `/uploads/${filename}`, classId, sundaySchoolId, uploaderId);

  revalidatePath('/teacher');
  revalidatePath('/student');
}

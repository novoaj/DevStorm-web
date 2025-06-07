"use server"
import { revalidateTag, revalidatePath } from 'next/cache';

export async function invalidateUserData() {
  revalidateTag('user-data');
}

export async function invalidateUserProjects() {
  revalidateTag('user-projects');
}

export async function invalidateProject(pid: string) {
  revalidateTag(`project-${pid}`);
}

export async function invalidateTasks(pid: string) {
  revalidateTag(`tasks-${pid}`);
}

export async function invalidateProfilePage() {
  revalidatePath('/profile');
}
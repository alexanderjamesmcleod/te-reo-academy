// Curriculum - TO BE PORTED FROM V3
// Sources: te-reo-card-game/src/data/module1.js, module2.js

import { Module } from '../types/lesson.types';

export const CURRICULUM: Module[] = [
  // TODO: Port modules from v3
];

export function getModuleById(id: string): Module | undefined {
  return CURRICULUM.find(m => m.id === id);
}

export function getLessonById(lessonId: string) {
  for (const module of CURRICULUM) {
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

import type { Character } from '../types/character';
import { newCharacterId } from './characterStore';

export function downloadCharacter(character: Character): void {
  const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = (character.name || 'character').replace(/\s+/g, '_') + '.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function readCharacterFile(file: File): Promise<Character> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as Character;
        if (!imported.name) throw new Error('Invalid character file');
        if (!imported.id) imported.id = newCharacterId();
        resolve(imported);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Could not import character'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

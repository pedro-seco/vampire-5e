import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { portraitFromFile } from '../../ankh/portrait';

interface ImageSlotProps {
  image?: string;
  tall?: boolean;
  onChange: (image: string | undefined) => void;
}

export function ImageSlot({ image, tall, onChange }: ImageSlotProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      onChange(await portraitFromFile(file));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar a imagem');
    }
  };

  return (
    <figure className={'paper-photo' + (tall ? ' paper-photo--tall' : '')}>
      {image && <img src={image} alt="" />}
      <div className="paper-photo__actions">
        <button type="button" className="btn-sm" onClick={() => fileInput.current?.click()}>{image ? 'Trocar imagem' : 'Adicionar imagem'}</button>
        {image && <button type="button" className="btn-sm" onClick={() => onChange(undefined)}>Remover</button>}
        {error && <span className="paper-photo__error">{error}</span>}
      </div>
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={choose} />
    </figure>
  );
}

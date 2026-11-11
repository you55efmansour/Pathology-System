import { useEffect, useState } from 'react';
import { imageRepository } from '@/services/imageRepository';

export function useImageUrl(id) {
  const [state, setState] = useState({ url: '', error: '' });
  useEffect(() => {
    let active = true;
    imageRepository.url(id).then((url) => { if (active) setState({ url, error: '' }); }).catch((error) => { if (active) setState({ url: '', error: error.message }); });
    return () => { active = false; };
  }, [id]);
  return state;
}

declare module 'virtual:vault-sections' {
  const sections: { id: string; title: string; html: string; group?: string; label?: string; audience: 'jogador' | 'narrador'; part: 'base' | 'extras' }[];
  export default sections;
}

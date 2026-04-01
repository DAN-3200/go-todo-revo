import type { TagDef, Note } from '../types'

export const TAG_DEFS: TagDef[] = [
  { id: 'work',     label: 'trabalho',   cls: 'work'     },
  { id: 'personal', label: 'pessoal',    cls: 'personal' },
  { id: 'idea',     label: 'ideia',      cls: 'idea'     },
  { id: 'urgent',   label: 'urgente',    cls: 'urgent'   },
  { id: 'ref',      label: 'referência', cls: 'ref'      },
]

export const SEED_NOTES: Note[] = [
  {
    id: 1,
    title: 'Planejamento Q2 2025',
    content: 'Definir metas de produto para o segundo trimestre.\n\n- Lançar feature de exportação PDF\n- Revisão do design system\n- Onboarding para novos usuários\n- Integração com Slack\n\nPróxima reunião: quinta-feira 14h.',
    tags: ['work', 'urgent'],
    createdAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-03-28'),
    isPinned: true,
  },
  {
    id: 2,
    title: 'Ideia: App de hábitos minimalista',
    content: 'Um app de rastreamento de hábitos com interface completamente limpa. Sem gamificação excessiva. Foco em consistência, não em streak.\n\nConceito: um grid simples, uma cor por hábito. Sem notificações agressivas.',
    tags: ['idea', 'personal'],
    createdAt: new Date('2025-03-22'),
    updatedAt: new Date('2025-03-27'),
    isPinned: false,
  },
  {
    id: 3,
    title: 'Referências de tipografia editorial',
    content: 'Fontes para explorar:\n\n• Freight Display – elegante, muito usada em revistas\n• Canela – moderna, com personalidade\n• Larken – expressiva, boas variações de peso\n• Editorial New – trending em 2024\n\nSites de referência: Fonts In Use, Typewolf, Fontshare.',
    tags: ['ref', 'idea'],
    createdAt: new Date('2025-03-23'),
    updatedAt: new Date('2025-03-25'),
    isPinned: false,
  },
  {
    id: 4,
    title: 'Lembrete: renovar seguro do carro',
    content: 'Vencimento: 15 de abril de 2025.\n\nLigar para a corretora antes do dia 10 para comparar planos. Pedir cotação da Porto Seguro e Tokio Marine.',
    tags: ['personal', 'urgent'],
    createdAt: new Date('2025-03-24'),
    updatedAt: new Date('2025-03-24'),
    isPinned: false,
  },
  {
    id: 5,
    title: 'Notas da reunião de UX',
    content: 'Participantes: Ana, Bruno, Carla, Diego\n\nPontos levantados:\n1. O onboarding atual tem fricção excessiva na etapa de verificação de email\n2. Taxa de abandono em 42% na tela de planos\n3. Sugestão: simplificar fluxo com progressive disclosure\n\nAção: prototipagem até sexta.',
    tags: ['work'],
    createdAt: new Date('2025-03-21'),
    updatedAt: new Date('2025-03-22'),
    isPinned: false,
  },
  {
    id: 6,
    title: 'Livros para ler em 2025',
    content: 'Lista de leitura:\n\n□ A Elegância do Ouriço – Muriel Barbery\n□ Thinking in Systems – Donella Meadows\n□ The Design of Everyday Things – Don Norman\n□ Invisible Cities – Italo Calvino\n□ Never Split the Difference – Chris Voss',
    tags: ['personal', 'ref'],
    createdAt: new Date('2025-03-19'),
    updatedAt: new Date('2025-03-20'),
    isPinned: false,
  },
]

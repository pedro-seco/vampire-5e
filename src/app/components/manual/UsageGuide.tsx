import type { ReactNode } from 'react';

const ARROW_STYLE = { color: 'var(--txt-m)', fontSize: 12 };
const BOX_ROW_STYLE = { display: 'flex', gap: 4, alignItems: 'center', marginTop: 4 };

function GuideItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="manual-item">
      <div className="manual-item-title">{title}</div>
      {children}
    </div>
  );
}

function VisualAid({ label, annotation, children }: { label: string; annotation: string; children: ReactNode }) {
  return (
    <div className="visual-aid" style={{ marginTop: 8 }}>
      <span className="va-label">{label}</span>
      <div style={BOX_ROW_STYLE}>{children}</div>
      <div className="va-annotation">{annotation}</div>
    </div>
  );
}

const Arrow = ({ text }: { text: string }) => <span style={ARROW_STYLE}>{text}</span>;

function TrackerAids() {
  return (
    <>
      <VisualAid label="Saúde / Willpower" annotation="Vazio → Superficial (╲) → Agravado (✕) → Vazio">
        <div className="box" />
        <Arrow text="→ clique →" />
        <div className="box superficial" />
        <Arrow text="→ clique →" />
        <div className="box aggravated" />
        <Arrow text="→ clique → vazio" />
      </VisualAid>

      <VisualAid label="Hunger" annotation="Vazio → Preenchido (✕) → Vazio. Sempre 5 caixas.">
        <div className="box" />
        <Arrow text="→ clique →" />
        <div className="box hunger-on" />
        <Arrow text="→ clique → vazio" />
      </VisualAid>

      <VisualAid
        label="Humanity"
        annotation="Caixas vermelhas = valor atual de Humanity (da esquerda para a direita). Clique nas caixas vazias, da direita para a esquerda, para marcar Stains (╲ em laranja). No modo edição, use + / − para mudar o valor de Humanity."
      >
        <div className="box hum-filled" />
        <div className="box hum-filled" />
        <div className="box hum-filled" />
        <div className="box" />
        <div className="box stain" />
        <div className="box stain" />
      </VisualAid>
    </>
  );
}

export function UsageGuide() {
  return (
    <div className="manual-section">
      <div className="manual-section-title">Como usar esta ficha</div>

      <GuideItem title="Trocar de personagem">
        <p className="manual-text">Na barra superior, à direita, clique no nome do personagem (▾) para abrir a lista. Clique em qualquer nome para trocar. A ficha recarrega com os dados daquele personagem.</p>
      </GuideItem>

      <GuideItem title="Novo personagem">
        <p className="manual-text">Clique em <strong>Novo</strong>. Uma ficha em branco será criada. Troque para ela pela lista de personagens e preencha os campos no modo edição. Para apagar o personagem ativo, use <strong>Excluir</strong> (haverá uma confirmação).</p>
      </GuideItem>

      <GuideItem title="Modo edição">
        <p className="manual-text">Clique em <strong>Editar</strong> para liberar a ficha. Todos os campos de texto ficam editáveis. Valores numéricos (atributos, perícias) mostram os botões <strong>+</strong> e <strong>−</strong>. Seções como Disciplinas e Advantages mostram <strong>＋</strong> para adicionar entradas e <strong>×</strong> para remover (com confirmação). Clique em <strong>Sair da edição</strong> para voltar. As mudanças são salvas automaticamente.</p>
      </GuideItem>

      <GuideItem title="Trackers">
        <p className="manual-text">As caixas dos trackers são sempre interativas, sem precisar do modo edição. Clique em uma caixa para mudar o estado dela:</p>
        <TrackerAids />
      </GuideItem>

      <GuideItem title="Exportar e importar">
        <p className="manual-text"><strong>Exportar</strong> baixa o personagem como um arquivo <code>.json</code>: guarde como backup ou envie ao Narrador. <strong>Importar</strong> carrega um arquivo <code>.json</code> e adiciona aquele personagem à sua ficha. Tudo fica salvo no armazenamento local do navegador; se você limpar os dados do navegador, os personagens serão perdidos, então exporte com frequência.</p>
      </GuideItem>

      <GuideItem title="Impressão">
        <p className="manual-text"><strong>Impressão</strong> abre o diálogo de impressão do navegador com três folhas A4: a ficha de Mecânica, a Narrativa e a Ref. Escolha uma impressora ou salve em PDF.</p>
      </GuideItem>

      <GuideItem title="Adicionar disciplinas">
        <p className="manual-text">No modo edição, clique em <strong>＋</strong> ao lado de Disciplinas. Busque a disciplina pelo nome e confirme. Depois clique em <strong>＋ poder</strong> no cabeçalho da disciplina para adicionar poderes: só aparecem os poderes de nível igual ou menor ao da disciplina. Para remover um poder ou a disciplina inteira, clique em <strong>×</strong> e confirme.</p>
      </GuideItem>
    </div>
  );
}

export function RefContent() {
  return (
    <div className="ref-page">
      <div className="ref-section">
        <div className="ref-section-title">Tipos de dano</div>
        <p className="ref-note"><strong>╲ Superficial</strong> — Reduzido pela metade (arredondado para cima) antes de ser aplicado ao tracker. Curado com um Rouse Check.</p>
        <p className="ref-note"><strong>✕ Agravado</strong> — Aplicado por inteiro. Exige três Rouse Checks e um dia inteiro de descanso para curar uma caixa.</p>
        <p className="ref-note" style={{ marginTop: 6 }}><strong>Fontes de dano Superficial:</strong> socos, chutes, quedas, a maioria das armas de fogo, estaca (em vampiros).</p>
        <p className="ref-note"><strong>Fontes de dano Agravado:</strong> fogo, luz do sol, garras e presas de criaturas sobrenaturais, certos poderes de Disciplina, decapitação.</p>
      </div>

      <div className="ref-section">
        <div className="ref-section-title">Efeitos da Hunger</div>
        <table className="ref-table">
          <thead><tr><th>Nível</th><th>Efeito</th></tr></thead>
          <tbody>
            <tr><td className="t-val">1</td><td>Sem penalidade.</td></tr>
            <tr><td className="t-val">2</td><td>−1 dado em Rouse Checks que poderiam ser refeitos.</td></tr>
            <tr><td className="t-val">3</td><td>Bestial Failure possível em qualquer rolagem.</td></tr>
            <tr><td className="t-val">4</td><td>A Compulsão de clã é ativada. Messy Critical possível.</td></tr>
            <tr><td className="t-val">5</td><td>Teste de Frenzy sempre que provocado. Bestial Failure substitui todas as falhas.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="ref-section">
        <div className="ref-section-title">Rouse Checks</div>
        <p className="ref-note">Role um dado. Em uma <strong>falha (1–5)</strong>: a Hunger aumenta em 1. Em um <strong>sucesso (6–10)</strong>: nada muda.</p>
        <p className="ref-note">Com <strong>BP 3+</strong>, você pode refazer Rouse Checks de poderes de nível 2 ou menor e ficar com o melhor resultado.</p>
        <p className="ref-note"><strong>Starvation:</strong> se a Hunger fosse passar de 5, o vampiro entra em Frenzy imediatamente (Hunger Frenzy).</p>
      </div>

      <div className="ref-section">
        <div className="ref-section-title">Tipos de Frenzy</div>
        <table className="ref-table">
          <thead><tr><th>Tipo</th><th>Gatilho</th><th>Dif.</th></tr></thead>
          <tbody>
            <tr><td className="t-name">Hunger Frenzy</td><td>Hunger 5 + cheiro de sangue, ou a Hunger passaria de 5</td><td className="t-val">3</td></tr>
            <tr><td className="t-name">Terror Frenzy</td><td>Exposto a fogo ou luz do sol</td><td className="t-val">3</td></tr>
            <tr><td className="t-name">Rage Frenzy</td><td>Provocação, humilhação ou ataque físico</td><td className="t-val">2</td></tr>
          </tbody>
        </table>
        <p className="ref-note" style={{ marginTop: 6 }}>Resista com <strong>Composure + Resolve</strong> contra a Dificuldade. Falha = a Besta assume o controle.</p>
        <p className="ref-note"><strong>Compulsão:</strong> disparada por Messy Critical ou Bestial Failure. A Compulsão específica do clã vale pelo resto da cena. Suprimi-la por um turno custa 1 Willpower.</p>
      </div>

      <div className="ref-section">
        <div className="ref-section-title">Resonance</div>
        <table className="ref-table">
          <thead><tr><th>Resonance</th><th>Emoção / Estado</th><th>Disciplinas</th></tr></thead>
          <tbody>
            <tr><td className="t-name">Sanguine</td><td>Desejo, luxúria, paixão</td><td className="t-acc">Celerity, Presence</td></tr>
            <tr><td className="t-name">Choleric</td><td>Raiva, violência, ódio</td><td className="t-acc">Potence, Celerity</td></tr>
            <tr><td className="t-name">Melancholic</td><td>Medo, tristeza, solidão</td><td className="t-acc">Fortitude, Obfuscate</td></tr>
            <tr><td className="t-name">Phlegmatic</td><td>Calma, letargia, apatia</td><td className="t-acc">Auspex, Dominate</td></tr>
            <tr><td className="t-name">Empty</td><td>Nenhuma emoção forte</td><td>—</td></tr>
          </tbody>
        </table>
      </div>

      <div className="ref-section">
        <div className="ref-section-title">Armas e defesas</div>
        <table className="ref-table">
          <thead><tr><th>Item</th><th>Bônus</th><th>Notas</th></tr></thead>
          <tbody id="ref-items-table">
            <tr><td className="t-name">Desarmado</td><td className="t-val">—</td><td>Superficial contra vampiros</td></tr>
            <tr><td className="t-name">Faca / Estaca</td><td className="t-val">+1 dado</td><td>Estaca no coração: torpor</td></tr>
            <tr><td className="t-name">Espada / Machado</td><td className="t-val">+2 dados</td><td>—</td></tr>
            <tr><td className="t-name">Pistola</td><td className="t-val">+2 dados</td><td>Superficial contra vampiros</td></tr>
            <tr><td className="t-name">Rifle / Escopeta</td><td className="t-val">+3 dados</td><td>Superficial contra vampiros</td></tr>
            <tr><td className="t-name">Armadura leve</td><td className="t-val">1 dado de armadura</td><td>Protege contra dano físico</td></tr>
            <tr><td className="t-name">Armadura pesada</td><td className="t-val">2 dados de armadura</td><td>−1 dado em rolagens de Dexterity</td></tr>
          </tbody>
        </table>
      </div>

      <div className="ref-section">
        <div className="ref-section-title">Dificuldades comuns</div>
        <table className="ref-table">
          <thead><tr><th>Dificuldade</th><th>Descrição</th></tr></thead>
          <tbody>
            <tr><td className="t-val">1</td><td>Tarefa simples, condições desfavoráveis</td></tr>
            <tr><td className="t-val">2</td><td>Tarefa padrão</td></tr>
            <tr><td className="t-val">3</td><td>Desafiadora; exige habilidade ou sorte</td></tr>
            <tr><td className="t-val">4</td><td>Difícil; especialistas penam</td></tr>
            <tr><td className="t-val">5</td><td>Formidável; perto do limite da capacidade mortal</td></tr>
            <tr><td className="t-val">6+</td><td>Quase impossível sem ajuda sobrenatural</td></tr>
          </tbody>
        </table>
        <p className="ref-note" style={{ marginTop: 6 }}><strong>Critical Win:</strong> dois ou mais 10s em uma rolagem. Efeito excepcional a critério do Narrador.</p>
        <p className="ref-note"><strong>Bestial Failure:</strong> nenhum sucesso e pelo menos um 1. A Besta se manifesta: uma Compulsão, um surto ou um deslize em direção ao Frenzy.</p>
      </div>
    </div>
  );
}

export function RefTab() {
  return (
    <div className="page">
      <RefContent />
    </div>
  );
}

import Script from "next/script";

export default function Home() {
  return (
    <>
      <aside>
        <div className="brand">◈ bora de moto<span>.</span><small>MENOS ROTINA, MAIS ESTRADA</small></div>
        <nav id="nav" />
        <a href="/diario" style={{display:"block",fontWeight:600,padding:"12px",color:"inherit"}}>Viagens realizadas</a>
        <div className="sidefoot">
          ⌖ Seu ponto de partida<br /><b>Pedreira, São Paulo</b>
          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "22px 0" }} />
          <span className="avatar">VP</span> Vanessa Passos
        </div>
      </aside>
      <main>
        <header className="top">
          <div>
            <div className="eyebrow">SEU DIÁRIO DE ESTRADA</div>
            <h1>O próximo horizonte espera.</h1>
            <div className="muted">Planeje com calma. Aproveite cada quilômetro.</div>
          </div>
          <span className="muted">⌖ Pedreira, SP · Brasil</span>
        </header>
        <p><a href="/diario">Abrir diário de viagens realizadas →</a></p>
        <div id="app" />
        <footer>Bora de Moto · Feito para colecionar caminhos.<br />Planos salvos neste navegador · Exporte uma cópia para guardar ou transferir.</footer>
      </main>
      <dialog id="modal" />
      <div id="toast" hidden className="toast" />
      <Script src="/planejador.js" strategy="afterInteractive" />
    </>
  );
}

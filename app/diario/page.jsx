"use client";
import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { tipos, limite } from "./dados";
import "./diario.css";

function dataLegivel(data) {
  const dia = data.length === 10;
  return new Date((dia ? data : data + "-01") + "T12:00:00").toLocaleDateString("pt-BR",
    { month: "long", year: "numeric", ...(dia ? { day: "numeric" } : {}) });
}

export default function Diario() {
  const [dados, setDados] = useState(null), [chave, setChave] = useState("");
  const [edicao, editar] = useState(null), [exato, setExato] = useState(false);
  const [aviso, avisar] = useState(""), [ocupado, ocupar] = useState(false);
  async function carregar() {
    try {
      const r = await fetch("/api/diario", { cache: "no-store" });
      if (!r.ok) throw Error();
      setDados(await r.json()); avisar("");
    } catch { avisar("Não foi possível abrir o diário."); }
  }
  useEffect(() => {
    const k = new URLSearchParams(location.hash.slice(1)).get("editar");
    if (k) { sessionStorage.setItem("diario-editar", k); history.replaceState(null, "", location.pathname); }
    setChave(sessionStorage.getItem("diario-editar") || "");
    carregar();
  }, []);
  function abrir(v) {
    editar({ ...v }); setExato(v.data.length === 10); avisar("");
  }
  function alterar(campo, valor) { editar(v => ({ ...v, [campo]: valor })); }
  async function anexar(files) {
    ocupar(true);
    try {
      for (const file of files) {
        const index = tipos.indexOf(file.type);
        if (index < 0 || file.size > limite) throw Error("Escolha foto JPG, PNG, WebP ou vídeo MP4, WebM ou MOV de até 250 MB.");
        avisar("Enviando " + file.name + "…");
        const ext = ["jpg","png","webp","mp4","webm","mov"][index];
        const blob = await upload("galeria/" + crypto.randomUUID() + "." + ext, file, {
          access: "public", handleUploadUrl: "/api/midias", clientPayload: chave,
          contentType: file.type, multipart: file.size > 5 * 1024 * 1024
        });
        editar(v => ({ ...v, midias: [...v.midias, { url: blob.url, tipo: file.type, nome: file.name }] }));
      }
      avisar("Envio concluído. Salve a viagem para incluir os arquivos no diário.");
    } catch (e) { avisar(e.message); } finally { ocupar(false); }
  }
  async function salvar(event) {
    event.preventDefault(); ocupar(true);
    try {
      const r = await fetch("/api/diario", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + chave },
        body: JSON.stringify({ viagem: edicao, versao: dados.versao }) });
      const resultado = await r.json();
      if (!r.ok) throw Error(resultado.erro);
      setDados(resultado); editar(null); avisar("Viagem salva no diário público.");
    } catch (e) { avisar(e.message); } finally { ocupar(false); }
  }
  return <main className="diario">
    <a href="/">← Voltar ao planejador</a><h1>Viagens realizadas</h1>
    {aviso && <p role="status" className="notice">{aviso}</p>}
    {!dados && (aviso ? <button onClick={carregar}>Tentar novamente</button> : <p>Carregando viagens…</p>)}
    {dados && chave && !edicao && <button className="primary" onClick={() => abrir({ id: crypto.randomUUID(), destino: "", data: "", roteiro: "", midias: [] })}>+ Registrar viagem realizada</button>}
    {edicao && <form onSubmit={salvar} className="section"><fieldset disabled={ocupado}>
      <h2>Registrar viagem</h2>
      <label>Destino<input required maxLength={120} value={edicao.destino} onChange={e => alterar("destino", e.target.value)} /></label>
      <label><input type="checkbox" checked={exato} onChange={e => { setExato(e.target.checked); alterar("data", e.target.checked ? "" : edicao.data.slice(0,7)); }} /> Informar dia exato</label>
      <label>{exato ? "Data da viagem" : "Mês e ano da viagem"}<input required type={exato ? "date" : "month"} value={edicao.data} onChange={e => alterar("data", e.target.value)} /></label>
      <label>Roteiro realizado<textarea rows={6} maxLength={30000} placeholder="Por onde passou? Registre as etapas, paradas e lugares que visitou." value={edicao.roteiro} onChange={e => alterar("roteiro", e.target.value)} /></label>
      <label>Adicionar fotos e vídeos públicos<input type="file" multiple accept={tipos.join(",")} onChange={e => { const files = Array.from(e.target.files); e.target.value = ""; anexar(files); }} /></label>
      <small>Até 250 MB por arquivo. Os arquivos enviados ficam acessíveis por link.</small>
      <ul>{edicao.midias.map(m => <li key={m.url}>{m.nome}</li>)}</ul>
      <button className="primary">Salvar viagem</button> <button type="button" onClick={() => { editar(null); carregar(); }}>Fechar edição</button>
    </fieldset></form>}
    {dados && [...dados.viagens].sort((a,b) => b.data.localeCompare(a.data)).map(v => <article className="section" key={v.id}>
      <div className="heading"><div><time dateTime={v.data}>{dataLegivel(v.data)}</time><h2>{v.destino}</h2></div>
      {chave && !edicao && <button onClick={() => abrir(v)}>Editar viagem</button>}</div>
      <h3>Roteiro realizado</h3><p className="relato">{v.roteiro || "Roteiro ainda não registrado."}</p>
      <h3>Fotos e vídeos</h3>{!v.midias.length && <p>Nenhuma mídia adicionada.</p>}
      <div className="galeria">{v.midias.map(m => <figure key={m.url}>{m.tipo.startsWith("video/") ? <video controls playsInline preload="metadata" src={m.url} /> : <a href={m.url}><img loading="lazy" alt={m.nome} src={m.url} /></a>}<figcaption>{m.nome}</figcaption></figure>)}</div>
    </article>)}
  </main>;
}

const origem = "Pedreira, SP, Brasil";
const destino = "Serra da Macaca, SP-139, São Paulo, Brasil";
const mapa = new URLSearchParams({ saddr: origem, daddr: destino, output: "embed" });
const direcoes = new URLSearchParams({ api: "1", origin: origem, destination: destino, travelmode: "driving" });
const titulo = "Pedreira → Serra da Macaca";
const resumo = "22 de dezembro de 2026 · 1 dia · 500 km de ida estimados";
const url = "https://bora-de-moto.vercel.app/planejar/serra-da-macaca";

export const metadata = {
  title: titulo + " | Bora de Moto",
  description: resumo,
  alternates: { canonical: url },
  openGraph: { title: titulo, description: resumo, url, siteName: "Bora de Moto", locale: "pt_BR" },
};

export default function SerraDaMacaca() {
  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(16px, 4vw, 40px)" }}>
      <a href="/" style={{ color: "var(--green)", fontWeight: 700 }}>Bora de Moto</a>
      <article className="section" style={{ marginTop: 24 }}>
        <h1>{titulo}</h1>
        <p><time dateTime="2026-12-22">22 de dezembro de 2026</time> · 1 dia · 500 km de ida estimados</p>
        <h2>Mapa da viagem</h2>
        <iframe title="Mapa de Pedreira até a Serra da Macaca" src={"https://maps.google.com/maps?" + mapa}
          style={{ width: "100%", height: "clamp(280px, 50vh, 480px)", border: 0, borderRadius: 12 }}
          referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        <p><a href={"https://www.google.com/maps/dir/?" + direcoes} style={{ color: "var(--green)", fontWeight: 700 }}>Abrir rota no Google Maps</a></p>
      </article>
    </main>
  );
}

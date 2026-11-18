import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
export const dynamic = "force-dynamic";
const arquivo = "contador/acessos.json";
const resposta = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
async function ler() {
  const blob = await get(arquivo, { access: "public", useCache: false });
  if (!blob) return { total: 0, versao: "" };
  const { total } = await new Response(blob.stream).json();
  return { total: Number(total) || 0, versao: blob.blob.etag };
}
export async function GET() {
  try { return resposta({ total: (await ler()).total }); }
  catch { return resposta({ erro: "Contador indisponível." }, 503); }
}
// Registra um acesso. Usa o ETag para não perder contagens quando duas visitas chegam ao mesmo tempo.
export async function POST() {
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    try {
      const { total, versao } = await ler();
      await put(arquivo, JSON.stringify({ total: total + 1 }), { access: "public", contentType: "application/json",
        addRandomSuffix: false, allowOverwrite: Boolean(versao), ...(versao ? { ifMatch: versao } : {}) });
      return resposta({ total: total + 1 });
    } catch (e) {
      if (!(e instanceof BlobPreconditionFailedError) && !/already exists/i.test(e?.message || "")) return resposta({ erro: "Contador indisponível." }, 503);
    }
  }
  return resposta({ erro: "Contador ocupado." }, 503);
}

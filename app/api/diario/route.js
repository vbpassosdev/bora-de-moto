import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import { iniciais, tipos } from "../../diario/dados";
export const dynamic = "force-dynamic";
const arquivo = "diario/viagens.json";
const resposta = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
async function ler() {
  const blob = await get(arquivo, { access: "public", useCache: false });
  if (!blob) return { viagens: iniciais, versao: "" };
  return { viagens: await new Response(blob.stream).json(), versao: blob.blob.etag };
}
export async function GET() {
  try { return resposta(await ler()); }
  catch { return resposta({ erro: "Não foi possível carregar o diário." }, 503); }
}
export async function POST(req) {
  if (!process.env.DIARIO_CHAVE || req.headers.get("authorization") !== "Bearer " + process.env.DIARIO_CHAVE)
    return resposta({ erro: "Chave de edição inválida." }, 403);
  try {
    const { viagem, versao } = await req.json();
    if (!viagem || !/^[a-z0-9-]{1,64}$/.test(viagem.id) || !viagem.destino?.trim() || viagem.destino.length > 120 ||
        !/^\d{4}-(0[1-9]|1[0-2])(-([0-2]\d|3[01]))?$/.test(viagem.data) ||
        typeof viagem.roteiro !== "string" || viagem.roteiro.length > 30000 || !Array.isArray(viagem.midias))
      return resposta({ erro: "Confira os campos da viagem." }, 400);
    const urlGaleria = /^https:\/\/[A-Za-z0-9]+\.public\.blob\.vercel-storage\.com\/galeria\/[A-Za-z0-9._-]+$/;
    if (viagem.midias.some(m => !m || !tipos.includes(m.tipo) || !urlGaleria.test(m.url) || typeof m.nome !== "string"))
      return resposta({ erro: "Confira o tipo e o endereço dos arquivos anexados." }, 400);
    const atual = await ler();
    if (versao !== atual.versao) return resposta({ erro: "O diário mudou em outro aparelho. Reabra a viagem antes de editar." }, 409);
    const viagens = [...atual.viagens.filter(v => v.id !== viagem.id), viagem];
    const blob = await put(arquivo, JSON.stringify(viagens), { access: "public", contentType: "application/json", addRandomSuffix: false,
      allowOverwrite: Boolean(versao), ...(versao ? { ifMatch: versao } : {}) });
    return resposta({ viagens, versao: blob.etag });
  } catch (e) {
    return resposta({ erro: e instanceof BlobPreconditionFailedError ? "Outro aparelho atualizou o diário. Reabra a viagem." : "Falha ao salvar. Seu formulário continua aberto." }, e instanceof BlobPreconditionFailedError ? 409 : 503);
  }
}

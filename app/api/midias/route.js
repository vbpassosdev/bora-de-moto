import { handleUpload } from "@vercel/blob/client";
import { tipos, limite } from "../../diario/dados";
export async function POST(request) {
  try {
    const body = await request.json();
    const result = await handleUpload({ request, body,
      onBeforeGenerateToken: async (pathname, chave) => {
        if (!process.env.DIARIO_CHAVE || chave !== process.env.DIARIO_CHAVE || !/^galeria\/[a-f0-9-]{36}\.(jpg|png|webp|mp4|webm|mov)$/.test(pathname))
          throw Error("Envio não autorizado.");
        return { allowedContentTypes: tipos, maximumSizeInBytes: limite, addRandomSuffix: true };
      }
    });
    return Response.json(result);
  } catch { return Response.json({ error: "Não foi possível autorizar o envio." }, { status: 400 }); }
}

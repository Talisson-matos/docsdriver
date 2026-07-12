// Decodifica uma string base64 para bytes brutos (Uint8Array).
export function base64ParaBytes(base64: string): Uint8Array {
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }
  return bytes;
}

// Decodifica uma string base64 direto para um Blob (evita problemas de tipagem com BlobPart).
export function base64ParaBlob(base64: string, tipoMime: string): Blob {
  const bytes = base64ParaBytes(base64);
  return new Blob([bytes as unknown as BlobPart], { type: tipoMime });
}

// Decodifica uma string base64 (UTF-8) para texto.
export function base64ParaTexto(base64: string): string {
  const bytes = base64ParaBytes(base64);
  return new TextDecoder('utf-8').decode(bytes);
}

// Dispara o download de um Blob no navegador com o nome de arquivo informado.
export function baixarBlob(blob: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

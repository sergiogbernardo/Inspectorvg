export default function Hero() {
  return (
    <section className="mb-8 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
        Inspetor de <span className="text-emerald-400">arquivos</span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
        Hashes, entropia, magic bytes, strings, hex dump e metadados de qualquer arquivo.
        Tudo roda no seu navegador — <span className="text-emerald-300">nenhum byte é enviado</span>{' '}
        para nenhum servidor.
      </p>
    </section>
  );
}

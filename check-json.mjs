// Cek endpoint backend mana yang mengembalikan JSON tidak valid.
// Pastikan backend lokal sedang jalan (go run main.go), lalu:
//   bun check-json.mjs
// Endpoint tambahan bisa ditaruh di belakang perintah, contoh:
//   bun check-json.mjs /seo/home /settings
// Base URL bisa diganti: API_BASE=http://localhost:8080/v1 bun check-json.mjs

const base = process.env.API_BASE ?? "http://localhost:8080/v1";

const defaults = [
  "/team",
  "/articles",
  "/articles?status=published&limit=3",
  "/gallery",
  "/reviews",
  "/cms/pages/home",
  "/cms/pages/about",
  "/cms/pages/services",
  "/cms/pages/team",
  "/cms/pages/contact",
  "/cms/pages/faq",
  "/cms/pages/career",
  "/cms/pages/gallery",
  "/cms/pages/articles",
  "/cms/pages/privacy-policy",
  "/cms/pages/terms-conditions",
  "/settings",
];

const paths = [...defaults, ...process.argv.slice(2)];

for (const p of paths) {
  try {
    const res = await fetch(base + p);
    const text = await res.text();
    try {
      JSON.parse(text);
      console.log(`OK   ${res.status} ${p} (${text.length} chars)`);
    } catch (e) {
      console.log(`BAD  ${res.status} ${p} (${text.length} chars) -> ${e.message}`);
      const m = /position (\d+)/.exec(e.message);
      const pos = m ? Number(m[1]) : 0;
      console.log("     konteks di sekitar error:", JSON.stringify(text.slice(Math.max(0, pos - 40), pos + 80)));
    }
  } catch (e) {
    console.log(`FAIL ${p} -> ${e.message}`);
  }
}

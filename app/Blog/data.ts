export type Article = {
  id: string
  title: string
  summary: string
  tags: string[]
  body: string
}

// Seed list for index page (still used to render list quickly). In MDX mode you may replace this with file-system read.
export const articles: Article[] = [
  {
    id: "lufer-rehberi",
    title: "Lüfer Avı Rehberi: Mevsim, Takım ve Yem",
    summary:
      "Lüfer, boğazların efsanesi. En verimli dönem sonbahar. Akıntılı bölgelerde, rapala veya zoka ile yüzey-su üstü aksiyonları etkili olur.",
    tags: ["Lüfer", "Spin", "Boğaz"],
    body:
      "Lüfer avında akıntı okuma çok kritiktir. Sonbaharda sürüler kıyıya yaklaşır. 2.40-3.00 m spin kamışlar, orta devir makineler ve 0.16-0.20 misina aralığı idealdir. Yüzey ve sığ dalarlı yapay yemler (rapala, popper) ile akıntıdan yana atışlar verim sağlar. Doğal yem olarak taze istavrit ve zargana da tercih edilir. En verimli zamanlar gün doğumu ve batımıdır.",
  },
  {
    id: "istavrit-tuyolari",
    title: "İstavrit İçin Pratik İpuçları",
    summary:
      "İstavrit, kıyıdan erişilebilir bir tür. İnce beden çapı, hassas şamandıra ve taze yem başarı oranını artırır.",
    tags: ["İstavrit", "Şamandıra", "Kıyı"],
    body:
      "İstavritte ince takım fark yaratır. 0.12-0.16 beden, küçük iğneler ve dengeli şamandıra ile hafif atışlar yapın. Taze çimçim, istavrit fileto veya hamur kullanılabilir. Akşamüstü ile gece arası isabetli zamanlardır. Akıntıya paralel atış yapıp yemin su sütununda doğal salınmasını sağlayın.",
  },
  {
    id: "levrek-nerede-bulunur",
    title: "Levrek Nerede Bulunur? Habitat ve Av Teknikleri",
    summary:
      "Levrek çoğunlukla sığ, kayalık, oksijenli bölgeleri sever. Şafak ve gün batımı, silikon yemlerle verimli saatlerdir.",
    tags: ["Levrek", "Silikon Yem", "Sığ Su"],
    body:
      "Levrek, kıyıya yakın taşlık, yosunluk ve oksijenli bölgeleri tercih eder. Sığ su silikon yemleri (shad, slug) ile yavaş ve ritmik aksiyonlar deneyin. Gece avında koyu renkler, gündüzde doğal tonlar çalışır. Sessiz yaklaşım ve rüzgârı arkaya alacak atış açıları başarıyı artırır.",
  },
  {
    id: "cipura-dip-teknikleri",
    title: "Çipura İçin Dip Teknikleri",
    summary:
      "Çipura avında dip takımları, fluorocarbon köstek ve taze midye-kurban yemleri fark yaratır.",
    tags: ["Çipura", "Dip Avı", "Fluorocarbon"],
    body:
      "Çipura seçici bir türdür. 0.20-0.25 fluorocarbon köstek, küçük fakat sağlam iğneler ve temiz dip yapısı tercih edilmelidir. Yem olarak midye, karides ve boru kurdu öne çıkar. Sakin havalarda hassas ısırıkları görmek için uç duyarlılığı yüksek kamış kullanın.",
  },
  {
    id: "mezgit-kis-avciligi",
    title: "Kışın Mezgit Avcılığı: Ekipman ve Nokta Seçimi",
    summary:
      "Soğuk sularda mezgit daha derinde olur. İnce hassas uçlu kamış ve fosforlu çapariler iş görür.",
    tags: ["Mezgit", "Kış", "Çapari"],
    body:
      "Kışın mezgit 15-30 metre bandına çekilir. İnce uçlu kamışlar ile dip dokunuşlarını takip edin. Fosforlu, küçük iğneli çapariler ve taze karides ya da tavuk göğüs şeritleri etkili olur. Akşam-gece saatleri daha verimlidir.",
  },
]

export function getArticleById(id: string) {
  return articles.find((a) => a.id === id) || null
}



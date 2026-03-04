import Link from "next/link";

const CATEGORIES = [
  {
    icon: "draw",
    title: "Design & Créatif",
    description: "UI/UX, Logos, Branding, Motion Design, Illustrations.",
    slug: "design-crea",
  },
  {
    icon: "terminal",
    title: "Développement & Tech",
    description: "Web, Mobile, API, DevOps, Cloud, Blockchain.",
    slug: "developpement",
  },
  {
    icon: "ads_click",
    title: "Marketing Digital",
    description: "SEO, Social Media, Growth Hacking, Publicité.",
    slug: "marketing",
  },
  {
    icon: "edit_note",
    title: "Rédaction & Traduction",
    description: "Copywriting, Articles, Traduction, Localisation.",
    slug: "redaction",
  },
  {
    icon: "videocam",
    title: "Vidéo & Animation",
    description: "Montage, Motion Graphics, 3D, Explainer Videos.",
    slug: "video",
  },
  {
    icon: "music_note",
    title: "Musique & Audio",
    description: "Voix-off, Podcast, Jingles, Sound Design.",
    slug: "musique",
  },
  {
    icon: "business_center",
    title: "Business & Conseil",
    description: "Stratégie, Comptabilité, Juridique, Consulting.",
    slug: "business",
  },
  {
    icon: "psychology",
    title: "IA & Data Science",
    description: "Machine Learning, Analyse de données, Chatbots, Automatisation.",
    slug: "ia-data",
  },
];

export function CategoriesSection() {
  return (
    <section className="px-6 lg:px-20 py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explorez nos catégories</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Trouvez le freelance idéal dans la catégorie qui correspond à votre besoin.</p>
          </div>
          <Link
            href="/explorer"
            className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all flex-shrink-0"
          >
            Voir tout <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/explorer?categorie=${cat.slug}`}
              className="group bg-white dark:bg-slate-800/40 hover:bg-primary border border-slate-200 dark:border-slate-800 hover:border-primary p-10 rounded-3xl transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/20"
            >
              <span className="material-symbols-outlined text-5xl text-primary group-hover:text-white mb-8 block transition-transform group-hover:scale-110">
                {cat.icon}
              </span>
              <h4 className="text-xl font-bold group-hover:text-white mb-2">{cat.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-white/80 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

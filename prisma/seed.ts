import { PrismaClient, GhostType, DangerLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BhootKosh…");

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@bhootkosh.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMeSecurePassword123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "Archive Admin" },
    create: {
      email: adminEmail,
      name: "Archive Admin",
      passwordHash,
    },
  });
  console.log(`Admin: ${adminEmail}`);

  const regionData = [
    {
      name: "Rajasthan",
      slug: "rajasthan",
      state: "Rajasthan",
      description:
        "Desert forts, abandoned villages, and royal legends shape Rajasthan’s folklore landscape.",
    },
    {
      name: "West Bengal",
      slug: "west-bengal",
      state: "West Bengal",
      description:
        "Bengali literature and oral tradition preserve a rich catalogue of petni, shakchunni, and riverine spirits.",
    },
    {
      name: "Maharashtra",
      slug: "maharashtra",
      state: "Maharashtra",
      description:
        "From fort watchmen to munjya lore, Maharashtra holds both urban and rural spirit traditions.",
    },
    {
      name: "Kerala",
      slug: "kerala",
      state: "Kerala",
      description:
        "Coastal and forest traditions of yakshi, preta, and temple-associated beings.",
    },
    {
      name: "Tamil Nadu",
      slug: "tamil-nadu",
      state: "Tamil Nadu",
      description:
        "Tamil pei lore and village guardian spirits form a distinct southern archive.",
    },
    {
      name: "Uttar Pradesh",
      slug: "uttar-pradesh",
      state: "Uttar Pradesh",
      description:
        "Gangetic plains traditions of pret, brahmadaitya, and cremation-ground lore.",
    },
    {
      name: "Assam",
      slug: "assam",
      state: "Assam",
      description:
        "Northeastern oral traditions including calls of the night and forest spirits.",
    },
    {
      name: "Gujarat",
      slug: "gujarat",
      state: "Gujarat",
      description:
        "Coastal and desert-edge legends, including haunted shores and deserted settlements.",
    },
    {
      name: "Himachal Pradesh",
      slug: "himachal-pradesh",
      state: "Himachal Pradesh",
      description:
        "Hill stations and forested ridges with colonial-era and local ghost narratives.",
    },
  ];

  const regions: Record<string, string> = {};
  for (const r of regionData) {
    const created = await prisma.region.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
    regions[r.slug] = created.id;
  }

  const tagNames = [
    "female spirit",
    "fort",
    "beach",
    "possession",
    "forest",
    "river",
    "village",
    "shape-shifter",
    "restless dead",
    "demon",
    "mythological",
  ];
  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const slug = name.replace(/\s+/g, "-");
    const t = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    tags[slug] = t.id;
  }

  type GhostSeed = {
    name: string;
    slug: string;
    otherNames: string[];
    type: GhostType;
    regionSlug: string;
    state: string;
    dangerLevel: DangerLevel;
    habitat: string;
    appearance: string;
    behavior: string;
    origin: string;
    summary: string;
    fullDescription: string;
    culturalNotes: string;
    sources: string;
    image: string;
    gallery: string[];
    featured: boolean;
    tagSlugs: string[];
  };

  // Local archive assets:
  // - ghosts/*  = AI-illustrated folklore portraits
  // - places/*  = real Wikimedia Commons site photographs
  // - stories/* = AI story cover illustrations
  const ghostImg = (slug: string) => `/images/ghosts/${slug}.jpg`;
  const placeImg = {
    bhangarh: [
      "/images/places/bhangarh-1.jpg",
      "/images/places/bhangarh-2.jpg",
      "/images/places/bhangarh-3.jpg",
    ],
    kuldhara: [
      "/images/places/kuldhara-1.jpg",
      "/images/places/kuldhara-2.jpg",
      "/images/places/kuldhara-3.jpg",
    ],
    dumas: [
      "/images/places/dumas-1.jpg",
      "/images/places/dumas-2.jpg",
    ],
    dowhill: [
      "/images/places/dowhill-1.jpg",
      "/images/places/dowhill-2.jpg",
    ],
    shaniwar: [
      "/images/places/shaniwar-1.jpg",
      "/images/places/shaniwar-2.jpg",
    ],
  };
  const storyImg = {
    nishi: "/images/stories/nishi-daak-story.jpg",
    banyan: "/images/stories/banyan-tree.jpg",
    fort: "/images/stories/watchman-fort.jpg",
    bride: "/images/stories/bride-backward-feet.jpg",
    well: "/images/stories/whispering-well.jpg",
  };

  const ghosts: GhostSeed[] = [
    {
      name: "Chudail",
      slug: "chudail",
      otherNames: ["Churel", "Chudail", "Chudailni"],
      type: "FEMALE_SPIRITS",
      regionSlug: "uttar-pradesh",
      state: "North India (pan-regional)",
      dangerLevel: "HIGH",
      habitat: "Crossroads, peepal trees, abandoned houses, lonely roads after dusk",
      appearance:
        "Often described as a woman with long unbound hair, unusually pale or glowing skin, and feet that point backwards. Some regions add inverted facial features or a form that shifts from beautiful to terrifying once the traveller follows her. Details vary widely by language and village.",
      behavior:
        "Village accounts say she appears near peepal trees or deserted paths and may lure lonely travellers. Other stories cast her as a spirit of injustice—returning after a wrongful death, especially related to childbirth, abandonment, or violence. She is rarely a single ‘monster type’; she is a family of related legends.",
      origin:
        "Told across North India and neighbouring regions as the restless spirit of a woman who died in tragic or unjust circumstances. The figure absorbs local grief, moral warnings, and landscape lore.",
      summary:
        "One of India’s most widely known female spirits, the Chudail appears in countless regional variants as a warning tale, a story of unresolved grief, and a presence tied to liminal night roads.",
      fullDescription: `<p>The <strong>Chudail</strong> (also Churel) is among the most recognisable figures in North Indian folklore. Popular cinema often flattens her into one stock image, but oral tradition is richer and more contradictory. In some villages she is tragic; in others she is a moral caution; in still others she explains misfortune on lonely roads.</p>
<p>Recurring motifs include <em>backwards feet</em>, unbound hair, the peepal tree, and the hour after dusk. Yet even these are not universal. Punjab, Uttar Pradesh, Bihar, and Rajasthan each hold versions that differ in name, cause of death, and how the living should respond.</p>
<p>BhootKosh documents the Chudail as a <strong>cultural category</strong>, not a single verified entity. When reading or collecting stories, note the region, language, and whether the teller treats the figure as a ghost, a metaphor, or both.</p>
<p>Related archive entries include Shakchunni, Daayan, and Mohini Yakshi—figures that share motifs of female unrest and social boundary, while remaining distinct regional traditions.</p>`,
      culturalNotes:
        "Treat regional variants as distinct oral traditions rather than one fixed ‘canonical’ monster. Names and attributes shift with language and community storytelling. Avoid sensational imagery that erases the grief and social context inside many tellings.",
      sources:
        "Widely attested North Indian oral motifs; generalised for educational use. Field versions should always be attributed to place and teller when known.",
      image: ghostImg("chudail"),
      gallery: [],
      featured: true,
      tagSlugs: ["female-spirit", "restless-dead", "village"],
    },
    {
      name: "Vetala",
      slug: "vetala",
      otherNames: ["Baital", "Vetāla", "Betal"],
      type: "RESTLESS_DEAD",
      regionSlug: "maharashtra",
      state: "Pan-Indian (literary & folk)",
      dangerLevel: "MEDIUM",
      habitat: "Cemeteries, cremation grounds, ancient trees, narrative ‘story space’ of kings",
      appearance:
        "In classical retellings, a corpse-dwelling spirit—sometimes hanging upside-down from a tree in a burning ground. Later popular art borrows vampire-like traits, which can oversimplify the original literary being.",
      behavior:
        "Famous for riddling speech and testing the wisdom of kings. In the Vikram–Vetal cycle, the spirit inhabits a corpse and poses moral dilemmas. Folk speech may later blur Vetala with general graveyard ghosts.",
      origin:
        "Deeply rooted in Sanskrit storytelling, especially the Vetala Panchavimshati frame narratives associated with King Vikramaditya, later retold in many Indian languages.",
      summary:
        "The Vetala bridges literary Sanskrit tradition and popular ghost lore as a corpse-inhabiting spirit of the burning ground—and a master of riddles.",
      fullDescription: `<p>Unlike purely village-bound ghosts, the <strong>Vetala</strong> is embedded in classical narrative culture. In the celebrated cycle of twenty-five tales, a king must carry a Vetala-inhabited corpse while answering ethical riddles—if he speaks, the spirit returns to the tree and the ordeal restarts.</p>
<p>This structure made the Vetala more than a scare figure: it became a vehicle for questions about justice, truth, duty, and kingship. Vernacular retellings carried the frame story across centuries.</p>
<p>Modern readers sometimes equate Vetala with a ‘vampire’. BhootKosh prefers the older context: a <em>literary and ritual-adjacent being</em> of the cremation ground, later absorbed into broader ghost vocabulary.</p>
<p>Compare with Preta and Pishacha for related afterlife and impurity categories that are not identical to Vetala.</p>`,
      culturalNotes:
        "Distinguish literary Vetala from pop-horror ‘vampire’ comparisons. Note the philosophical role of the riddle cycle when teaching or writing about this figure.",
      sources:
        "Sanskrit Vetala Panchavimshati tradition and later vernacular retellings; educational composite.",
      image: ghostImg("vetala"),
      gallery: [],
      featured: true,
      tagSlugs: ["restless-dead", "mythological"],
    },
    {
      name: "Pishacha",
      slug: "pishacha",
      otherNames: ["Pishach", "Piśāca", "Pisach"],
      type: "DEMONS",
      regionSlug: "uttar-pradesh",
      state: "Pan-Indian (mythological)",
      dangerLevel: "HIGH",
      habitat: "Cremation grounds, dark forests, desolate places, liminal night spaces",
      appearance:
        "In mythic literature, flesh-associated beings of frightening or impure form. Later folk speech may use the word for almost any malicious night spirit, so appearance is not fixed.",
      behavior:
        "Linked with impurity, night wandering, fear, and affliction motifs. In some contexts Pishachas are a cosmological class; in others the name simply marks terror after dark.",
      origin:
        "Appears in early Indic mythological literature as a class of beings distinct from gods, humans, and many other spirit types.",
      summary:
        "Pishachas are mythological beings of darkness and impurity later absorbed into broader Indian ghost taxonomies.",
      fullDescription: `<p>In classical cosmology, <strong>Pishachas</strong> form a category of beings associated with darkness, impurity, and the edges of human order. They sit alongside other classes—yakshas, rakshasas, pretas—each with different roles depending on the text and era.</p>
<p>Popular speech sometimes uses ‘pishach’ loosely for any malicious presence. Archive discipline means asking: is the teller using a <em>technical mythic term</em>, or everyday fear-language?</p>
<p>BhootKosh lists Pishacha so readers can map the continuum from scripture and epic taxonomy to village ghost talk—without collapsing them into one Hollywood demon.</p>`,
      culturalNotes:
        "Separate mythological class from local ghost story when documenting. Avoid treating all ‘dark spirits’ as interchangeable.",
      sources: "Indic mythological literature; later folklore glosses (educational summary).",
      image: ghostImg("pishacha"),
      gallery: [],
      featured: false,
      tagSlugs: ["demon", "mythological"],
    },
    {
      name: "Nishi Daak",
      slug: "nishi-daak",
      otherNames: ["Nishir Daak", "Nishi Dak", "Call of the Night"],
      type: "VILLAGE_SPIRITS",
      regionSlug: "west-bengal",
      state: "West Bengal / Assam (regional variants)",
      dangerLevel: "HIGH",
      habitat: "Village edges, ponds, bamboo groves, paths after midnight",
      appearance:
        "Often formless. The legend centres on a voice—frequently one that mimics a mother, friend, or beloved—calling a person’s name from outside the house.",
      behavior:
        "Calls a person by name in a familiar voice late at night. Folklore warns never to answer or open the door. Some versions say answering leads the living into the dark, never to return.",
      origin:
        "Bengali and neighbouring eastern oral traditions about a midnight call that lures the living away from safety.",
      summary:
        "Nishi Daak is the dreaded night-call of Bengal: a voice in the dark that should never be answered.",
      fullDescription: `<p>The legend of <strong>Nishi Daak</strong> (the call of the night) is not primarily a story of a visible monster. It is a story about <em>sound, trust, and the threshold of the home</em>.</p>
<p>Households across Bengal and neighbouring regions teach that if your name is called after a certain hour—especially in a familiar voice—you must not respond. The caller may not be human. The safety of the living depends on silence and closed doors until dawn.</p>
<p>The tale encodes practical night caution and deep anxieties about separation, rivers, ponds, and the village edge. Related motifs appear under different names across eastern India.</p>
<p>Read alongside Shakchunni and Bhoot for broader eastern and pan-Indian spirit vocabularies.</p>`,
      culturalNotes:
        "Document the specific community version when possible. Closely related motifs appear across eastern India with local names and slightly different rules.",
      sources: "Bengali oral tradition motifs; educational composite account.",
      image: ghostImg("nishi-daak"),
      gallery: [],
      featured: true,
      tagSlugs: ["village", "possession"],
    },
    {
      name: "Brahmadaitya",
      slug: "brahmadaitya",
      otherNames: ["Brahma Daitya", "Brahmodaitya"],
      type: "RESTLESS_DEAD",
      regionSlug: "west-bengal",
      state: "Bengal and eastern India",
      dangerLevel: "MEDIUM",
      habitat: "Banyan trees, old temples, cremation grounds, sacred groves",
      appearance:
        "Often imagined as the spirit of a deceased Brahmin, sometimes in white, associated with large trees—especially the banyan—or abandoned sacred sites.",
      behavior:
        "Depending on the tale, protective guardian or fearsome power. Some stories demand ritual respect; others warn against sleeping under a particular tree after dark.",
      origin:
        "Eastern Indian folklore linking certain deceased high-status souls to specific trees and temple precincts.",
      summary:
        "The Brahmadaitya is a spirit often tied to ancient banyan trees and temple landscapes in eastern India.",
      fullDescription: `<p>In Bengali and neighbouring folklore, a <strong>Brahmadaitya</strong> is frequently fixed to a place: a banyan with exposed roots, a ruined temple courtyard, a cremation-ground edge.</p>
<p>Stories may cast the spirit as dangerous if offended, or as a local power that must be propitiated. The figure sits at the meeting point of caste vocabulary, sacred geography, and ghost belief.</p>
<p>BhootKosh presents Brahmadaitya carefully: as a <em>folklore category with social history</em>, not as a timeless stereotype. When collecting, record the exact tree or site named by the teller.</p>`,
      culturalNotes:
        "Caste-linked spirit categories should be framed historically and respectfully. Prefer place-specific documentation over generic scare copy.",
      sources: "Eastern Indian folklore collections (generalised educational summary).",
      image: ghostImg("brahmadaitya"),
      gallery: [],
      featured: true,
      tagSlugs: ["restless-dead", "forest"],
    },
    {
      name: "Yakshini",
      slug: "yakshini",
      otherNames: ["Yakshi", "Yakṣiṇī"],
      type: "MYTHOLOGICAL_BEINGS",
      regionSlug: "kerala",
      state: "Pan-Indian / Kerala variants",
      dangerLevel: "MEDIUM",
      habitat: "Forests, treasure sites, temple sculpture, crossroads, later roadside night tales",
      appearance:
        "In classical art, often a beautiful nature spirit. In some South Indian ghost tales, a seductive night figure whose true form is deadly—two layers that should not be collapsed without care.",
      behavior:
        "Ambiguous across history: fertility, wealth, and auspicious presence in temple culture; predatory or tragic lure in later regional ghost narratives.",
      origin:
        "Ancient yaksha/yakshini beings of Indic mythology, later reinterpreted in regional oral traditions, especially in South India.",
      summary:
        "Yakshini spans classical nature-spirit iconography and later regional legends of the night-walking seductress.",
      fullDescription: `<p><strong>Yakshinis</strong> appear on temple walls as auspicious beings of nature, fertility, and abundance. That visual and religious history is older than modern ghost cinema.</p>
<p>In later South Indian oral tales, the yakshi may become a night-time presence on lonely roads—beautiful, persuasive, fatal. This is an example of how mythic categories evolve inside living folklore.</p>
<p>BhootKosh keeps both layers visible: temple Yakshini and regional ghost Yakshi are related by name and motif, but not always the same cultural object.</p>
<p>See also Mohini Yakshi for Kerala’s famous night-road tradition.</p>`,
      culturalNotes:
        "Separate temple/iconographic Yakshini from modern horror-film Yakshi when documenting sources and dates.",
      sources: "Indic mythology; South Indian oral variants (composite educational entry).",
      image: ghostImg("yakshini"),
      gallery: [],
      featured: true,
      tagSlugs: ["mythological", "female-spirit", "forest"],
    },
    {
      name: "Daayan",
      slug: "daayan",
      otherNames: ["Dayan", "Dain", "Dakan"],
      type: "POSSESSION_LEGENDS",
      regionSlug: "rajasthan",
      state: "Central & North India (pan-regional)",
      dangerLevel: "EXTREME",
      habitat: "Village social space; accusations often target living women rather than empty ruins",
      appearance:
        "Described variously. In many contexts ‘Daayan’ is an accusation against a living person, not a free-roaming ghost with a single look.",
      behavior:
        "Folklore links the figure to witchcraft, the evil eye, and misfortune. Historically, the label has also been used in village conflict—with real-world harm.",
      origin:
        "Village witchcraft narratives across North and Central India; complex intersection of folklore, gender, and social power.",
      summary:
        "Daayan lore blurs ghost story and witchcraft accusation—documented here with cultural and ethical care.",
      fullDescription: `<p>Entries on <strong>Daayan</strong> must hold two truths at once: the word appears in supernatural storytelling, and it has been used as a label in social persecution.</p>
<p>BhootKosh documents narrative motifs—curses, night power, misfortune—while emphasising that folklore can be weaponised against living people, especially women.</p>
<p>This is not a page for sensational ‘witch’ content. It is an educational archive entry about how fear stories and social power interact in parts of North and Central India.</p>`,
      culturalNotes:
        "Do not sensationalise real-world witch-hunting violence. Prefer anthropological and community-safe framing. Educational purpose only.",
      sources:
        "Folklore and anthropological literature on witchcraft accusations (summary).",
      image: ghostImg("daayan"),
      gallery: [],
      featured: false,
      tagSlugs: ["possession", "female-spirit", "village"],
    },
    {
      name: "Munjya",
      slug: "munjya",
      otherNames: ["Munja", "Munjya Bhoot"],
      type: "RESTLESS_DEAD",
      regionSlug: "maharashtra",
      state: "Maharashtra",
      dangerLevel: "HIGH",
      habitat: "Peepal trees, village outskirts, specific named trees in local lore",
      appearance:
        "Spirit of a boy who died after the sacred thread (munj / upanayana) ceremony, often fixed to a peepal tree. Visual details vary by village.",
      behavior:
        "Said to be mischievous or dangerous if disturbed. Local tales place him in particular trees; misfortune near the tree may be explained through Munjya lore.",
      origin:
        "Maharashtrian folklore around untimely death after the munj rite—an incomplete life stage made into place-bound spirit belief.",
      summary:
        "Munjya is a Maharashtrian tree-spirit tied to the death of a boy after the sacred thread ceremony.",
      fullDescription: `<p>In Maharashtra, <strong>Munjya</strong> stories often bind a spirit to one peepal tree that everyone in the village can name. The tree becomes a landmark of caution after dark.</p>
<p>The narrative encodes ritual ideas about untimely death and unfinished life stages. It is place-lore as much as ghost-lore: geography, kinship, and ceremony meet under the leaves.</p>
<p>When documenting Munjya, map the story to the village and tree when known—generic ‘Maharashtra ghost’ copy loses what makes the legend local.</p>`,
      culturalNotes:
        "Local tree associations are highly place-specific. Prefer village-level attribution in serious documentation.",
      sources: "Maharashtrian oral tradition (educational composite).",
      image: ghostImg("munjya"),
      gallery: [],
      featured: true,
      tagSlugs: ["restless-dead", "forest", "village"],
    },
    {
      name: "Nagin",
      slug: "nagin",
      otherNames: ["Nagini", "Ichchhadhari Nagin", "Naagin"],
      type: "SHAPE_SHIFTERS",
      regionSlug: "rajasthan",
      state: "Pan-Indian popular lore",
      dangerLevel: "HIGH",
      habitat: "Rivers, lakes, ruined temples, forest paths, later film and folk theatre space",
      appearance:
        "A serpent who may take human form—often a woman—in popular and folk narratives. Classical naga imagery differs from modern screen Nagin styling.",
      behavior:
        "Themes of revenge, love, treasure protection, and shape-shifting dominate later popular tellings. Older naga traditions also include worship and cosmology.",
      origin:
        "Draws on naga traditions in Indian mythology, later elaborated in folk theatre, television, and cinema.",
      summary:
        "Nagin lore blends ancient naga belief with popular shape-shifter romance and revenge tales.",
      fullDescription: `<p>While <strong>nagas</strong> are ancient mythological beings, the modern ‘Nagin’ figure is heavily shaped by folk performance and mass media. Archive entries should separate classical naga theology from contemporary pop folklore.</p>
<p>Popular stories emphasise the ichchhadhari (wish-formed) serpent who walks as human—love, betrayal, and vengeance driving the plot. These are living entertainment traditions as much as ‘ghost’ stories.</p>
<p>BhootKosh includes Nagin to show how mythic animal-spirits migrate into modern narrative culture without erasing older religious contexts.</p>`,
      culturalNotes:
        "Flag media influence when documenting twentieth- and twenty-first-century variants.",
      sources: "Naga mythology and later popular folklore (educational composite).",
      image: ghostImg("nagin"),
      gallery: [],
      featured: true,
      tagSlugs: ["shape-shifter", "mythological", "river"],
    },
    {
      name: "Preta",
      slug: "preta",
      otherNames: ["Pret", "Peta", "Peta-preta"],
      type: "RESTLESS_DEAD",
      regionSlug: "uttar-pradesh",
      state: "Pan-Indian (religious-cultural)",
      dangerLevel: "MEDIUM",
      habitat: "Cremation grounds, liminal spaces after death, ritual calendars of remembrance",
      appearance:
        "In religious texts, often a hungry or unsatisfied departed spirit. Popular speech may use pret more loosely for ‘ghost’.",
      behavior:
        "Associated with incomplete funerary rites, lingering attachment, and the need for ritual release. Many communities perform rites precisely to prevent a soul from remaining pret.",
      origin:
        "Sanskrit preta concept within broader South Asian afterlife and ritual systems.",
      summary:
        "Preta names the restless or hungry departed—at the intersection of religion, ritual, and ghost belief.",
      fullDescription: `<p>Understanding <strong>Preta</strong> requires ritual context. This is not only a scare category; it is woven into how many communities think about death, duty, and care for the dead.</p>
<p>Folklore and religious practice intertwine more tightly here than in pure ‘monster’ stories. A pret may mark unfinished rites, unfulfilled longing, or a soul not yet at rest.</p>
<p>When comparing to Western ‘ghost’, note the ritual frameworks that give Preta its meaning—otherwise the translation flattens too much.</p>`,
      culturalNotes:
        "Avoid equating preta 1:1 with Western ghost without noting ritual and religious frameworks.",
      sources: "Indic religious and ethnographic literature (summary).",
      image: ghostImg("preta"),
      gallery: [],
      featured: false,
      tagSlugs: ["restless-dead", "mythological"],
    },
    {
      name: "Rakshasa",
      slug: "rakshasa",
      otherNames: ["Raksasa", "Rakshas"],
      type: "DEMONS",
      regionSlug: "uttar-pradesh",
      state: "Pan-Indian (epic-mythological)",
      dangerLevel: "EXTREME",
      habitat: "Forests, fortresses, epic battlefields, later folk speech for any great terror",
      appearance:
        "Powerful, often shape-shifting beings in epic literature—not simple village ghosts. Forms range from magnificent to terrifying depending on the text and character.",
      behavior:
        "In epics they oppose gods and heroes, but also include complex characters with their own codes. Later folk speech may loosely apply the word to any terrifying entity.",
      origin:
        "Central to Ramayana, Mahabharata, and Puranic narrative worlds.",
      summary:
        "Rakshasas are epic-scale beings of Indic mythology, later echoing in folk vocabulary for terror.",
      fullDescription: `<p>BhootKosh includes <strong>Rakshasa</strong> to map the continuum from epic cosmology to everyday ghost talk. Not every ‘rakshas’ in village speech is the literary type—but the word carries deep cultural weight.</p>
<p>Epic rakshasas can be adversaries, rulers, devotees, or tragic figures. Reducing them to horror stock types loses the literary and religious richness of the category.</p>
<p>Use this entry as a bridge: from Sanskrit narrative worlds to how modern speakers still use rakshas as a word of fear or power.</p>`,
      culturalNotes:
        "Keep epic context visible. Avoid reducing complex characters to cheap horror tropes.",
      sources: "Sanskrit epics and Puranas; folk usage notes.",
      image: ghostImg("rakshasa"),
      gallery: [],
      featured: false,
      tagSlugs: ["demon", "mythological"],
    },
    {
      name: "Mohini Yakshi",
      slug: "mohini-yakshi",
      otherNames: ["Yakshi", "Mohini", "Kerala Yakshi"],
      type: "FEMALE_SPIRITS",
      regionSlug: "kerala",
      state: "Kerala",
      dangerLevel: "HIGH",
      habitat: "Roadsides at night, lonely paths, old estates, rubber and coconut country edges",
      appearance:
        "A beautiful woman who appears to solitary travellers at night; some tellings reveal a monstrous true form only too late.",
      behavior:
        "Lures travellers from the safe path. Associated with seduction and death in popular Kerala ghost lore; older layers may differ from film versions.",
      origin:
        "Kerala’s yakshi legends—related to, but not identical with, classical yakshini iconography.",
      summary:
        "Mohini Yakshi is Kerala’s famous night-time spirit of lonely roads—beauty as lure, landscape as stage.",
      fullDescription: `<p>Kerala <strong>yakshi</strong> stories are a major regional tradition. They often involve a beautiful woman waiting by the wayside after dark, with fatal consequences for those who follow her into the trees or estate paths.</p>
<p>Many modern tellings are shaped by cinema and popular literature. Older oral variants may emphasise place-names, family curses, or specific estates rather than a single national monster image.</p>
<p>Document both: the shared motif of the night lure, and the local details that make a story belong to one road, one district, one teller.</p>
<p>See Yakshini for the broader mythic category that feeds this legend-world.</p>`,
      culturalNotes:
        "Collect older oral variants where possible; flag film influence on contemporary versions.",
      sources: "Kerala oral tradition and popular retellings (composite).",
      image: ghostImg("mohini-yakshi"),
      gallery: [],
      featured: true,
      tagSlugs: ["female-spirit", "forest"],
    },
    {
      name: "Pei",
      slug: "pei",
      otherNames: ["Pey", "Tamil Pei"],
      type: "VILLAGE_SPIRITS",
      regionSlug: "tamil-nadu",
      state: "Tamil Nadu",
      dangerLevel: "MEDIUM",
      habitat: "Village margins, crossroads, haunted houses, wells, family compounds",
      appearance:
        "Not one fixed body. Pei is a Tamil umbrella term for ghost or spirit; form depends on the specific local story.",
      behavior:
        "Ranges from mischievous to deadly. Often place-bound or tied to a wrongful death, unfinished duty, or a haunted house narrative.",
      origin:
        "Tamil folk vocabulary for spirits—a category, not a single named individual.",
      summary:
        "Pei is the Tamil umbrella term for ghosts—an archive entry for a regional spirit category.",
      fullDescription: `<p>Rather than one named monster, <strong>pei</strong> is how many Tamil speakers name ghostly presence. Specific pei stories attach to houses, trees, wells, and family histories.</p>
<p>Serious documentation means cataloguing those individual legends under place names—not only listing ‘Pei’ as if it were a single bestiary creature.</p>
<p>BhootKosh keeps this entry as a door into Tamil ghost vocabulary: start here, then follow the local names.</p>`,
      culturalNotes:
        "Catalogue individual pei legends under place names when documenting field material.",
      sources: "Tamil folk categories (educational overview).",
      image: ghostImg("pei"),
      gallery: [],
      featured: false,
      tagSlugs: ["village", "restless-dead"],
    },
    {
      name: "Bhoot",
      slug: "bhoot",
      otherNames: ["Bhut", "Bhoot-Pret", "Bhootni (feminine forms in some speech)"],
      type: "RESTLESS_DEAD",
      regionSlug: "uttar-pradesh",
      state: "Pan-Indian",
      dangerLevel: "UNKNOWN",
      habitat: "Anywhere liminal—roads, ruins, threshold spaces, abandoned rooms",
      appearance:
        "Generic term; appearance depends entirely on the local narrative. There is no single canonical look.",
      behavior:
        "Catch-all category for departed spirits who remain among the living. Specific behaviour belongs to the particular story being told.",
      origin:
        "Common Hindi/Urdu and wider Indic vernacular for ghost—the everyday word behind our archive’s name.",
      summary:
        "Bhoot is the everyday word for ghost across much of North India—and the root of BhootKosh’s name.",
      fullDescription: `<p><strong>BhootKosh</strong> takes its name from this everyday term. Documenting ‘bhoot’ as a category reminds readers that Indian ghost belief is less a single bestiary than a living vocabulary of the unsettled dead.</p>
<p>When a teller says only ‘bhoot’, ask follow-up questions: place, time, who died, what was left unfinished. The specific name—Chudail, Munjya, Pei—often appears only after that conversation.</p>
<p>Prefer specific local names in the archive whenever available; use Bhoot as the fallback category that holds the rest.</p>`,
      culturalNotes:
        "Always prefer specific local names when available; use bhoot as fallback category.",
      sources: "General North Indian vernacular usage.",
      image: ghostImg("bhoot"),
      gallery: [],
      featured: true,
      tagSlugs: ["restless-dead"],
    },
    {
      name: "Shakchunni",
      slug: "shakchunni",
      otherNames: ["Shankhachunni", "Shakchunni", "Shakchuni"],
      type: "FEMALE_SPIRITS",
      regionSlug: "west-bengal",
      state: "West Bengal",
      dangerLevel: "MEDIUM",
      habitat: "Households, domestic thresholds, spaces of married women’s status in folklore",
      appearance:
        "Spirit of a married woman in Bengali lore; often said to retain signs of marital status such as vermilion in popular typology.",
      behavior:
        "May possess or replace a living woman in household tales. Themes of jealousy, status, and domestic space appear across variants.",
      origin:
        "Bengali petni / shakchunni typology of female spirits, which classifies unrest partly by marital status and manner of death.",
      summary:
        "Shakchunni is a Bengali female spirit associated with the figure of a married woman—part of a local taxonomy of unrest.",
      fullDescription: `<p>In Bengali folklore taxonomies, different female spirits are distinguished by marital status and manner of death. <strong>Shakchunni</strong> typically relates to a married woman, contrasting with other categories such as petni in popular typology.</p>
<p>These categories are folk-analytic tools used by communities and collectors—they are not rigid scientific types. Local usage can blur or rename them.</p>
<p>Household settings matter: many Shakchunni stories are not lonely-road tales but stories about the inside of the home, status, and who belongs.</p>
<p>Compare with Chudail and Nishi Daak for other North and East Indian female and night-threshold traditions.</p>`,
      culturalNotes:
        "These categories are folk-analytic, not rigid scientific types—record local usage carefully.",
      sources: "Bengali folklore typology (educational summary).",
      image: ghostImg("shakchunni"),
      gallery: [],
      featured: true,
      tagSlugs: ["female-spirit", "possession", "village"],
    },
  ];

  const ghostIds: Record<string, string> = {};

  for (const g of ghosts) {
    const created = await prisma.ghost.upsert({
      where: { slug: g.slug },
      update: {
        name: g.name,
        otherNames: g.otherNames,
        type: g.type,
        regionId: regions[g.regionSlug],
        state: g.state,
        dangerLevel: g.dangerLevel,
        habitat: g.habitat,
        appearance: g.appearance,
        behavior: g.behavior,
        origin: g.origin,
        summary: g.summary,
        fullDescription: g.fullDescription,
        culturalNotes: g.culturalNotes,
        sources: g.sources,
        image: g.image,
        gallery: g.gallery,
        status: "PUBLISHED",
        featured: g.featured,
        seoTitle: `${g.name} - Indian Folklore | BhootKosh`,
        seoDescription: g.summary,
        tags: {
          set: g.tagSlugs.filter((s) => tags[s]).map((s) => ({ id: tags[s] })),
        },
      },
      create: {
        name: g.name,
        slug: g.slug,
        otherNames: g.otherNames,
        type: g.type,
        regionId: regions[g.regionSlug],
        state: g.state,
        dangerLevel: g.dangerLevel,
        habitat: g.habitat,
        appearance: g.appearance,
        behavior: g.behavior,
        origin: g.origin,
        summary: g.summary,
        fullDescription: g.fullDescription,
        culturalNotes: g.culturalNotes,
        sources: g.sources,
        image: g.image,
        gallery: g.gallery,
        status: "PUBLISHED",
        featured: g.featured,
        seoTitle: `${g.name} - Indian Folklore | BhootKosh`,
        seoDescription: g.summary,
        tags: {
          connect: g.tagSlugs.filter((s) => tags[s]).map((s) => ({ id: tags[s] })),
        },
      },
    });
    ghostIds[g.slug] = created.id;
  }

  // Related ghosts
  const relatedPairs: [string, string[]][] = [
    ["chudail", ["shakchunni", "daayan", "mohini-yakshi"]],
    ["nishi-daak", ["shakchunni", "bhoot"]],
    ["yakshini", ["mohini-yakshi", "nagin"]],
    ["munjya", ["brahmadaitya", "preta"]],
    ["vetala", ["pishacha", "preta"]],
  ];
  for (const [slug, related] of relatedPairs) {
    if (!ghostIds[slug]) continue;
    await prisma.ghost.update({
      where: { id: ghostIds[slug] },
      data: {
        relatedGhosts: {
          set: related.filter((r) => ghostIds[r]).map((r) => ({ id: ghostIds[r] })),
        },
      },
    });
  }

  const places = [
    {
      name: "Bhangarh Fort",
      slug: "bhangarh-fort",
      location: "Bhangarh, Alwar district",
      state: "Rajasthan",
      regionSlug: "rajasthan",
      history:
        "<p>Bhangarh is a ruined fort-town in Rajasthan, known for its fortifications, temples, and palace remains. Historical settlement layers and later abandonment form the factual backdrop to popular legend.</p><p>What visitors see today—broken walls, empty courtyards, and temple platforms—is real archaeology and tourism landscape. The supernatural layer is a later and parallel story people tell about that landscape.</p>",
      legend:
        "<p>Popular legend claims a curse made the fort uninhabitable after dusk. Stories of a tantric and a princess circulate widely in tourism and oral retellings—versions differ, and should be treated as folklore rather than verified history.</p><p>The power of the legend comes from how ruin, desert light, and restricted night entry combine into a single atmosphere.</p>",
      reportedActivity:
        "Visitors and guides report unease after dark; entry restrictions and tourism narratives reinforce the haunted reputation. Daytime visits remain the documented, responsible way to see the site.",
      warning:
        "This entry documents cultural legend. Do not treat folklore as a safety guide. Follow local regulations and daylight visiting rules.",
      images: placeImg.bhangarh,
      featured: true,
      related: ["chudail", "bhoot"],
      tags: ["fort"],
    },
    {
      name: "Kuldhara Village",
      slug: "kuldhara-village",
      location: "Near Jaisalmer",
      state: "Rajasthan",
      regionSlug: "rajasthan",
      history:
        "<p>Kuldhara is an abandoned village in the Jaisalmer region. Historical accounts describe sudden desertion; precise causes remain debated among historians and locals.</p><p>Empty streets and collapsed houses make the site a powerful stage for story—whether or not one accepts supernatural claims.</p>",
      legend:
        "<p>Folklore speaks of a mass departure under threat and a curse that none would settle successfully again. Ruins and empty streets fuel ghost-story tourism.</p>",
      reportedActivity:
        "Night-time stories of shadows and voices circulate among travellers; daytime ruins are the primary documented site.",
      warning:
        "Educational folklore entry only. Visit only through permitted access and responsible tourism.",
      images: placeImg.kuldhara,
      featured: true,
      related: ["bhoot"],
      tags: ["village", "fort"],
    },
    {
      name: "Dumas Beach",
      slug: "dumas-beach",
      location: "Near Surat",
      state: "Gujarat",
      regionSlug: "gujarat",
      history:
        "<p>Dumas is a black-sand beach near Surat. Local history intertwines coastal life with stories about nearby cremation grounds and restless dead.</p>",
      legend:
        "<p>Popular lore claims spirits of the dead walk the beach at night. The dark sand itself becomes a narrative prop in ghost tourism.</p><p>As always, separate atmosphere and anecdote from verified event.</p>",
      reportedActivity:
        "Stories of whispers, footsteps, and fear after dark are common in visitor anecdotes.",
      warning:
        "Coastal areas can be hazardous at night for ordinary reasons—tides, crime, isolation. Folklore is not a substitute for caution.",
      images: placeImg.dumas,
      featured: true,
      related: ["preta", "pishacha"],
      tags: ["beach"],
    },
    {
      name: "Dow Hill",
      slug: "dow-hill",
      location: "Kurseong",
      state: "West Bengal",
      regionSlug: "west-bengal",
      history:
        "<p>Dow Hill near Kurseong is known for its forested slopes, colonial-era buildings, and boarding-school landscape in the eastern Himalayas.</p>",
      legend:
        "<p>Tales of a headless boy on forest roads and sightings near the old school buildings form the core of local ghost lore popularised online and by visitors.</p>",
      reportedActivity:
        "Forest road apparitions and school-building stories dominate published accounts.",
      warning:
        "Mountain forests have real hazards. This is cultural documentation, not an encouragement of night exploration.",
      images: placeImg.dowhill,
      featured: true,
      related: ["bhoot", "pei"],
      tags: ["forest"],
    },
    {
      name: "Shaniwar Wada",
      slug: "shaniwar-wada",
      location: "Pune",
      state: "Maharashtra",
      regionSlug: "maharashtra",
      history:
        "<p>Shaniwar Wada is a historic fortification in Pune associated with the Peshwas. Fires, politics, and tragedy mark its documented past.</p><p>The historical record of violence and palace intrigue is real; spectral claims are a separate layer of urban folklore.</p>",
      legend:
        "<p>The most famous legend involves the cries of a young prince murdered in the palace complex. Night-time wails are said to be heard by some storytellers—though such claims belong to folklore, not verified record.</p>",
      reportedActivity:
        "Stories of a child’s scream and spectral presence circulate in popular Pune ghost lore.",
      warning:
        "Respect heritage site rules. Folklore should not interfere with conservation or visitor safety.",
      images: placeImg.shaniwar,
      featured: true,
      related: ["munjya", "bhoot"],
      tags: ["fort"],
    },
  ];

  for (const p of places) {
    await prisma.hauntedPlace.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        location: p.location,
        state: p.state,
        regionId: regions[p.regionSlug],
        history: p.history,
        legend: p.legend,
        reportedActivity: p.reportedActivity,
        warning: p.warning,
        images: p.images,
        status: "PUBLISHED",
        featured: p.featured,
        seoTitle: `${p.name} | Haunted Place | BhootKosh`,
        seoDescription: p.legend.replace(/<[^>]+>/g, "").slice(0, 160),
        relatedGhosts: {
          set: p.related.filter((r) => ghostIds[r]).map((r) => ({ id: ghostIds[r] })),
        },
        tags: {
          set: p.tags.filter((t) => tags[t]).map((t) => ({ id: tags[t] })),
        },
      },
      create: {
        name: p.name,
        slug: p.slug,
        location: p.location,
        state: p.state,
        regionId: regions[p.regionSlug],
        history: p.history,
        legend: p.legend,
        reportedActivity: p.reportedActivity,
        warning: p.warning,
        images: p.images,
        status: "PUBLISHED",
        featured: p.featured,
        seoTitle: `${p.name} | Haunted Place | BhootKosh`,
        seoDescription: p.legend.replace(/<[^>]+>/g, "").slice(0, 160),
        relatedGhosts: {
          connect: p.related.filter((r) => ghostIds[r]).map((r) => ({ id: ghostIds[r] })),
        },
        tags: {
          connect: p.tags.filter((t) => tags[t]).map((t) => ({ id: tags[t] })),
        },
      },
    });
  }

  const stories = [
    {
      title: "The Call of Nishi Daak",
      slug: "the-call-of-nishi-daak",
      regionSlug: "west-bengal",
      summary:
        "A riverside household learns why elders forbid answering a name called after midnight.",
      content:
        "<p>On the night the river mist rose higher than the courtyard wall, Meera heard her mother call her from outside. The voice was perfect—the cadence, the cough, even the way her mother said the second syllable of her name.</p><p>But her mother was asleep on the cot beside her.</p><p>In the village, they call it Nishi Daak. You do not answer. You do not open the door. You wait for dawn, when the mist thins and names belong only to the living again.</p><p>Years later, Meera would tell her own children the same rule. Not as a ghost story meant to thrill, but as a boundary: some voices after midnight are not for the living to answer.</p>",
      coverImage: storyImg.nishi,
      related: ["nishi-daak", "shakchunni"],
      tags: ["village"],
      featured: true,
    },
    {
      title: "The Banyan Tree at Midnight",
      slug: "the-banyan-tree-at-midnight",
      regionSlug: "west-bengal",
      summary:
        "A boy who laughs under the old banyan learns that some trees keep older tenants.",
      content:
        "<p>They said a Brahmadaitya lived in the banyan at the edge of the paddy. The boys dared each other to walk three circles under its roots at midnight.</p><p>On the third circle, the laughter stopped. Only the leaves moved—without wind.</p><p>In the morning the tree looked ordinary again. That, the elders said, is how the oldest places keep their secrets: by returning to silence.</p>",
      coverImage: storyImg.banyan,
      related: ["brahmadaitya", "bhoot"],
      tags: ["forest"],
      featured: true,
    },
    {
      title: "The Watchman of the Old Fort",
      slug: "the-watchman-of-the-old-fort",
      regionSlug: "rajasthan",
      summary:
        "A night guard at a ruined fort hears footsteps on walls that no longer have stairs.",
      content:
        "<p>Ramji had watched the fort for eleven years. He knew which jackals barked and which stones settled after heat. He did not know the footsteps that climbed a staircase burned away a century ago.</p><p>At dawn he found only dust—and his own bootprints ending where the wall fell open to the sky.</p><p>He never told the tourists. He only asked for a transfer to the day shift, and for a lamp that never went out.</p>",
      coverImage: storyImg.fort,
      related: ["bhoot", "chudail"],
      tags: ["fort"],
      featured: true,
    },
    {
      title: "The Bride with Backward Feet",
      slug: "the-bride-with-backward-feet",
      regionSlug: "uttar-pradesh",
      summary:
        "A wedding procession returns one bride too many in this classic North Indian cautionary tale.",
      content:
        "<p>When the palki set down at the groom’s gate, the women sang. When they lifted the veil, the feet pointed the wrong way.</p><p>By morning the songs had stopped, and the peepal at the crossroads had a new story to keep.</p><p>Some say it was a Chudail who walked home with the procession. Others say it was a warning about looking carefully at what joy invites into the house. The archive keeps both tellings.</p>",
      coverImage: storyImg.bride,
      related: ["chudail", "daayan"],
      tags: ["female-spirit", "village"],
      featured: true,
    },
    {
      title: "The Whispering Well",
      slug: "the-whispering-well",
      regionSlug: "maharashtra",
      summary:
        "A village well repeats names of those who lean too close after dusk.",
      content:
        "<p>Do not shout into the well after the lamps are lit, the elders said. It learns voices. It keeps them.</p><p>When Suresh leaned over to mock the rule, the well whispered his name back—twice. Once in his voice. Once in something that had been listening longer than the village had a name.</p><p>They covered the well the next week. The story remained open.</p>",
      coverImage: storyImg.well,
      related: ["munjya", "preta"],
      tags: ["village", "restless-dead"],
      featured: true,
    },
  ];

  for (const s of stories) {
    await prisma.story.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        summary: s.summary,
        content: s.content,
        coverImage: s.coverImage,
        regionId: regions[s.regionSlug],
        status: "PUBLISHED",
        featured: s.featured,
        seoTitle: `${s.title} | BhootKosh`,
        seoDescription: s.summary,
        relatedGhosts: {
          set: s.related.filter((r) => ghostIds[r]).map((r) => ({ id: ghostIds[r] })),
        },
        tags: {
          set: s.tags.filter((t) => tags[t]).map((t) => ({ id: tags[t] })),
        },
      },
      create: {
        title: s.title,
        slug: s.slug,
        summary: s.summary,
        content: s.content,
        coverImage: s.coverImage,
        regionId: regions[s.regionSlug],
        status: "PUBLISHED",
        featured: s.featured,
        seoTitle: `${s.title} | BhootKosh`,
        seoDescription: s.summary,
        relatedGhosts: {
          connect: s.related.filter((r) => ghostIds[r]).map((r) => ({ id: ghostIds[r] })),
        },
        tags: {
          connect: s.tags.filter((t) => tags[t]).map((t) => ({ id: tags[t] })),
        },
      },
    });
  }

  const existingSubmission = await prisma.submission.findFirst({
    where: { name: "The Lamp at the Crossing" },
  });
  if (!existingSubmission) {
    await prisma.submission.create({
      data: {
        name: "The Lamp at the Crossing",
        regionText: "Bihar",
        story:
          "In our village they say a single oil lamp appears at the three-road crossing after midnight. If you try to reach it, the lamp moves further away, always the same distance, until you are deep in the fields. Elders say it is a spirit testing whether you will leave the path. My grandmother forbade us from chasing any light that has no house behind it.",
        sourceType: "FAMILY",
        contactEmail: "contributor@example.com",
        status: "PENDING",
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Ghosts: ${ghosts.length}, Places: ${places.length}, Stories: ${stories.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

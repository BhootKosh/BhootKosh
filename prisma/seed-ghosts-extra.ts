import type { GhostType, DangerLevel } from "@prisma/client";

export type GhostSeed = {
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

const img = (slug: string) => `/images/ghosts/${slug}.jpg`;

/**
 * Additional North / Central Indian folklore entries
 * (MP, Haryana, Punjab, Delhi, Uttarakhand, Himachal).
 * Shared names across states are documented as multi-region traditions.
 */
export const extraGhosts: GhostSeed[] = [
  {
    name: "Masan",
    slug: "masan",
    otherNames: ["Masaan", "Mashaan", "Smashan Bhoot"],
    type: "RESTLESS_DEAD",
    regionSlug: "madhya-pradesh",
    state: "Madhya Pradesh (also HR, PB, DL, UK, HP)",
    dangerLevel: "HIGH",
    habitat: "Cremation grounds, smashan ghats, riverbanks after funerals",
    appearance:
      "Often imagined as an ash-grey or soot-dark figure near funeral pyres—sometimes faceless, sometimes wearing the residue of the burning ground. Descriptions vary by village.",
    behavior:
      "Associated with cremation grounds and the restless dead. Tales warn against lingering alone at smashan after dark or mocking funeral rites. Some accounts treat Masan as a class of spirits rather than one named being.",
    origin:
      "Widespread North and Central Indian oral tradition linked to smashan (cremation ground) lore. Related names appear in Madhya Pradesh, Haryana, Punjab, Delhi, Uttarakhand, and Himachal.",
    summary:
      "Masan (Masaan) is a cremation-ground spirit of North and Central India—feared, respected, and named in many regional dialects.",
    fullDescription: `<p><strong>Masan</strong> (also Masaan) belongs to the smashan traditions of North and Central India. The word itself points to the cremation ground—the threshold between the living and the dead.</p>
<p>In Madhya Pradesh and neighbouring states, villagers may speak of Masan as a presence that lingers where bodies are burned. Related names appear in Haryana, Punjab, Delhi, Uttarakhand, and Himachal folklore.</p>
<p>BhootKosh records Masan as a <strong>cultural category</strong> of cremation-ground unrest, not a single verified entity. Local tellings differ on form, danger, and ritual response.</p>`,
    culturalNotes:
      "Do not treat smashan lore as travel advice. Cremation grounds have ordinary hazards; folklore is cultural narrative.",
    sources: "North/Central Indian oral motifs; educational summary of regional variants.",
    image: img("masan"),
    gallery: [],
    featured: true,
    tagSlugs: ["restless-dead", "village"],
  },
  {
    name: "Mua",
    slug: "mua",
    otherNames: ["Mua Bhoot"],
    type: "RESTLESS_DEAD",
    regionSlug: "madhya-pradesh",
    state: "Madhya Pradesh",
    dangerLevel: "MEDIUM",
    habitat: "Rural fields, village outskirts, lonely paths after dusk",
    appearance:
      "Described in rural Madhya Pradesh tellings as a pale or thin restless figure near fields and mud houses—details shift by district.",
    behavior:
      "Often a restless-dead figure of the countryside. Stories may warn travellers and field workers against answering unknown calls at night.",
    origin: "Central Indian village oral tradition, especially Madhya Pradesh.",
    summary:
      "Mua is a rural Madhya Pradesh spirit associated with fields, paths, and night-time unease.",
    fullDescription: `<p><strong>Mua</strong> appears in Madhya Pradesh village lore as a restless presence of rural landscapes—fields, outskirts, and night roads.</p>
<p>Like many regional names, Mua is less a single canonical monster than a local way of naming fear at the edge of settlement.</p>`,
    culturalNotes: "Record local pronunciation and district when collecting variants.",
    sources: "Madhya Pradesh oral tradition (educational summary).",
    image: img("mua"),
    gallery: [],
    featured: false,
    tagSlugs: ["restless-dead", "village"],
  },
  {
    name: "Hadal",
    slug: "hadal",
    otherNames: ["Hadaal", "Hadalni"],
    type: "FEMALE_SPIRITS",
    regionSlug: "madhya-pradesh",
    state: "Madhya Pradesh",
    dangerLevel: "HIGH",
    habitat: "Village wells, peepal trees, abandoned houses, lonely roads",
    appearance:
      "Often a woman-shaped spirit with long hair; some tellings share motifs with chudail lore (liminal beauty that turns terrifying).",
    behavior:
      "Village accounts may link Hadal to injustice, untimely death, or danger near water sources and empty paths after dusk.",
    origin: "Madhya Pradesh and Central Indian female-spirit traditions; spelling varies (Hadal / Hadaal).",
    summary:
      "Hadal (Hadaal) is a Central Indian female spirit of wells, trees, and night roads—related in tone to wider chudail-type lore.",
    fullDescription: `<p><strong>Hadal</strong> or <strong>Hadaal</strong> is spoken of in Madhya Pradesh folklore as a dangerous female spirit of liminal places.</p>
<p>Collectors should note spelling and local attributes carefully; the name may overlap with neighbouring chudail traditions without being identical.</p>`,
    culturalNotes: "Compare with Chudail/Churail entries for shared North Indian motifs.",
    sources: "Central Indian oral tradition (educational summary).",
    image: img("hadal"),
    gallery: [],
    featured: true,
    tagSlugs: ["female-spirit", "village"],
  },
  {
    name: "Peederanga",
    slug: "peederanga",
    otherNames: ["Pidaranga"],
    type: "FOREST_SPIRITS",
    regionSlug: "madhya-pradesh",
    state: "Madhya Pradesh",
    dangerLevel: "MEDIUM",
    habitat: "Dense forest, sal jungle, tribal belt woodlands of Central India",
    appearance:
      "Shadowy forest humanoid or presence among trees; rarely fixed in popular art—oral description is primary.",
    behavior:
      "Forest-threshold lore: warnings about entering certain groves alone, mocking the woods, or breaking local taboos.",
    origin: "Madhya Pradesh forest and tribal-belt oral traditions.",
    summary:
      "Peederanga is a forest spirit of Madhya Pradesh—part of Central Indian woodland folklore.",
    fullDescription: `<p><strong>Peederanga</strong> belongs to Madhya Pradesh forest lore, where spirits mark the boundary between village and jungle.</p>
<p>Document local names and ritual responses with respect for communities who still narrate these landscapes.</p>`,
    culturalNotes: "Forest folklore often intertwines with livelihood and sacred grove practices.",
    sources: "Madhya Pradesh forest oral motifs (educational summary).",
    image: img("peederanga"),
    gallery: [],
    featured: false,
    tagSlugs: ["forest", "village"],
  },
  {
    name: "Sadu Guteni",
    slug: "sadu-guteni",
    otherNames: ["Sadu Guteni", "Sadu-Guteni"],
    type: "VILLAGE_SPIRITS",
    regionSlug: "madhya-pradesh",
    state: "Madhya Pradesh",
    dangerLevel: "MEDIUM",
    habitat: "Village edges, old trees, lamp-lit courtyards",
    appearance:
      "Village spirit form varies; often a restless presence near banyan or household edges rather than a single fixed look.",
    behavior:
      "Local tellings may cast Sadu Guteni as a household or village-edge unrest figure—warnings about night movement and respect for local custom.",
    origin: "Madhya Pradesh village oral tradition.",
    summary:
      "Sadu Guteni is a Madhya Pradesh village spirit of edges, trees, and night-time household lore.",
    fullDescription: `<p><strong>Sadu Guteni</strong> is recorded here as a Central Indian village spirit name from Madhya Pradesh oral culture.</p>
<p>As with many local names, field collection should preserve the teller’s district and language.</p>`,
    culturalNotes: "Prefer local informants over pan-Indian generalisation.",
    sources: "Madhya Pradesh oral tradition (educational summary).",
    image: img("sadu-guteni"),
    gallery: [],
    featured: false,
    tagSlugs: ["village", "restless-dead"],
  },
  {
    name: "Dhola Kapdiya",
    slug: "dhola-kapdiya",
    otherNames: ["Dhola Kapdiya"],
    type: "RESTLESS_DEAD",
    regionSlug: "haryana",
    state: "Haryana",
    dangerLevel: "MEDIUM",
    habitat: "Rural Haryana fields, village outskirts, night paths",
    appearance:
      "Rural North Indian ghost figure; pale or indistinct form near mustard fields and village roads in popular telling.",
    behavior:
      "A restless presence of the Haryana countryside—stories caution against lonely travel after dark.",
    origin: "Haryana oral tradition.",
    summary:
      "Dhola Kapdiya is a rural Haryana spirit tied to fields, paths, and night-time village lore.",
    fullDescription: `<p><strong>Dhola Kapdiya</strong> appears in Haryana folklore as a countryside spirit of fields and night roads.</p>`,
    culturalNotes: "Regional name—verify local pronunciation when collecting.",
    sources: "Haryana oral tradition (educational summary).",
    image: img("dhola-kapdiya"),
    gallery: [],
    featured: false,
    tagSlugs: ["village", "restless-dead"],
  },
  {
    name: "Jind",
    slug: "jind",
    otherNames: ["Jind ka Bhoot"],
    type: "RESTLESS_DEAD",
    regionSlug: "haryana",
    state: "Haryana (Jind region)",
    dangerLevel: "MEDIUM",
    habitat: "Town outskirts, old havelis, dusty roads of Jind area",
    appearance:
      "Local restless figure associated with the Jind region’s landscape—havelis, roads, and settlement edges.",
    behavior:
      "Place-linked ghost lore: the spirit is named through geography as much as personality.",
    origin: "Haryana—Jind regional oral tradition.",
    summary:
      "Jind names a Haryana regional ghost tradition tied to the Jind landscape and its settlements.",
    fullDescription: `<p>In Haryana folklore lists, <strong>Jind</strong> marks a regional ghost tradition associated with the Jind area—place-spirit naming common in North Indian oral culture.</p>`,
    culturalNotes: "Place-names as spirit-names are common; do not invent a single cinema face.",
    sources: "Haryana regional oral motifs (educational summary).",
    image: img("jind"),
    gallery: [],
    featured: false,
    tagSlugs: ["village", "restless-dead"],
  },
  {
    name: "Kichin",
    slug: "kichin",
    otherNames: ["Kichin", "Kichan"],
    type: "DEMONS",
    regionSlug: "haryana",
    state: "Haryana (also Punjab, Delhi)",
    dangerLevel: "HIGH",
    habitat: "Lonely roads, peepal trees, empty paths after midnight",
    appearance:
      "Predatory shadow or terrifying silhouette of the North Indian plains; exact form is unstable across tellings.",
    behavior:
      "Feared as a dangerous night presence. Related names circulate in Haryana, Punjab, and Delhi folklore lists.",
    origin: "North Indian plain oral traditions spanning Haryana, Punjab, and Delhi.",
    summary:
      "Kichin is a feared night spirit of the North Indian plains, named across Haryana, Punjab, and Delhi lore.",
    fullDescription: `<p><strong>Kichin</strong> appears in multi-state North Indian folklore inventories—especially Haryana, Punjab, and Delhi.</p>
<p>It is typically cast as a dangerous night figure of roads and trees rather than a household ghost.</p>`,
    culturalNotes: "Multi-state name; map variants by district when possible.",
    sources: "North Indian oral inventories (educational summary).",
    image: img("kichin"),
    gallery: [],
    featured: true,
    tagSlugs: ["demon", "restless-dead"],
  },
  {
    name: "Jakh",
    slug: "jakh",
    otherNames: ["Jakh", "Jakha"],
    type: "VILLAGE_SPIRITS",
    regionSlug: "haryana",
    state: "Haryana",
    dangerLevel: "MEDIUM",
    habitat: "Village boundaries, small shrines, field edges",
    appearance:
      "Sometimes guardian-like, sometimes fierce—form depends on local telling; often felt at the settlement edge.",
    behavior:
      "May be treated as a boundary or protective presence that becomes dangerous if disrespected.",
    origin: "Haryana village and boundary-spirit traditions.",
    summary:
      "Jakh is a Haryana village-boundary spirit—protective in some tellings, perilous in others.",
    fullDescription: `<p><strong>Jakh</strong> belongs to Haryana’s village-edge lore, where spirits police thresholds between home and wilderness.</p>`,
    culturalNotes: "Boundary spirits often blur ‘ghost’ and ‘local deity’ categories.",
    sources: "Haryana oral tradition (educational summary).",
    image: img("jakh"),
    gallery: [],
    featured: false,
    tagSlugs: ["village", "mythological"],
  },
  {
    name: "Chhalawa",
    slug: "chhalawa",
    otherNames: ["Chhalava", "Chhalaawa"],
    type: "SHAPE_SHIFTERS",
    regionSlug: "punjab",
    state: "Punjab (also Haryana, Delhi)",
    dangerLevel: "HIGH",
    habitat: "Crossroads, empty roads, edges of towns after dark",
    appearance:
      "Shape-shifting presence—may appear as a known person, animal, or dissolving silhouette. Deception is the core motif.",
    behavior:
      "Famous for illusion and false forms. Related ‘Pahari Chhalawa’ variants exist in Himachal. Told across Punjab, Haryana, and Delhi.",
    origin: "North Indian plain oral tradition; strong in Punjab and neighbouring regions.",
    summary:
      "Chhalawa is a North Indian shape-shifting spirit of crossroads and false appearances.",
    fullDescription: `<p><strong>Chhalawa</strong> (spellings vary) is a shape-shifting figure of North Indian folklore—especially Punjab, Haryana, and Delhi.</p>
<p>Stories emphasise deception: the spirit may wear a familiar face or dissolve into smoke. Himachal’s Pahari Chhalawa is a mountain-related cousin name.</p>`,
    culturalNotes: "Compare with Pahari Chhalawa for hill variants.",
    sources: "Punjab/Haryana/Delhi oral motifs (educational summary).",
    image: img("chhalawa"),
    gallery: [],
    featured: true,
    tagSlugs: ["shape-shifter", "village"],
  },
  {
    name: "Jinn",
    slug: "jinn",
    otherNames: ["Djinn", "Jin"],
    type: "MYTHOLOGICAL_BEINGS",
    regionSlug: "delhi",
    state: "Delhi (also Punjab)",
    dangerLevel: "HIGH",
    habitat: "Old city lanes, abandoned buildings, liminal night spaces",
    appearance:
      "In North Indian urban Muslim and mixed urban lore, a smoky or invisible presence—local tellings differ from Arabian fantasy art.",
    behavior:
      "Possession, disturbance, and bargains appear in some narratives; others treat jinn as parallel beings to be left alone.",
    origin:
      "Islamic jinn belief filtered through North Indian urban culture (Delhi, Punjab cities). Distinct from Hindu pret/bhoot taxonomy but coexists in shared cities.",
    summary:
      "Jinn lore in Delhi and Punjab cities reflects Islamic cosmology spoken in a North Indian urban voice.",
    fullDescription: `<p><strong>Jinn</strong> narratives in Delhi and Punjab are part of living urban folklore, not imported cinema costumes.</p>
<p>BhootKosh documents the Indian urban telling: old mohallas, night disturbance, and parallel beings—always with respect for religious context.</p>`,
    culturalNotes: "Handle religious frameworks carefully; avoid mockery or sensational exorcism content.",
    sources: "North Indian urban oral tradition (educational summary).",
    image: img("jinn"),
    gallery: [],
    featured: true,
    tagSlugs: ["mythological", "possession"],
  },
  {
    name: "Jam",
    slug: "jam",
    otherNames: ["Jaam"],
    type: "RESTLESS_DEAD",
    regionSlug: "punjab",
    state: "Punjab",
    dangerLevel: "MEDIUM",
    habitat: "Village wells, fields, Punjab rural night landscape",
    appearance:
      "Pale rural ghost figure; local form is lightly specified—atmosphere of well and field dominates.",
    behavior:
      "Restless-dead presence of the Punjabi countryside in regional spirit lists.",
    origin: "Punjab oral tradition.",
    summary:
      "Jam is a Punjab rural spirit name linked to fields, wells, and village night lore.",
    fullDescription: `<p><strong>Jam</strong> appears in Punjab folklore inventories as a rural restless spirit.</p>`,
    culturalNotes: "Short local names often carry dense place-specific meaning.",
    sources: "Punjab oral tradition (educational summary).",
    image: img("jam"),
    gallery: [],
    featured: false,
    tagSlugs: ["village", "restless-dead"],
  },
  {
    name: "Churail",
    slug: "churail",
    otherNames: ["Churel", "Chudail", "Chudailni"],
    type: "FEMALE_SPIRITS",
    regionSlug: "punjab",
    state: "Punjab (pan-North Indian)",
    dangerLevel: "HIGH",
    habitat: "Crossroads, peepal trees, lonely roads after dusk",
    appearance:
      "Classic North Indian female spirit: long unbound hair, pale or glowing face; some regions add backwards feet. Punjab often says Churail where others say Chudail.",
    behavior:
      "Liminal-road and injustice motifs; widely shared across North India with local names.",
    origin: "Pan-North Indian tradition; Punjab spelling/pronunciation Churail is prominent.",
    summary:
      "Churail is the Punjabi and wider North Indian name for the chudail-type female spirit of roads and peepal trees.",
    fullDescription: `<p><strong>Churail</strong> is closely related to the pan-North Indian <em>chudail/churel</em> complex. Punjab and neighbouring regions commonly use this form of the name.</p>
<p>See also the archive entry for Chudail for overlapping motifs.</p>`,
    culturalNotes: "Treat as regional naming of a shared motif family, not a separate ‘species’.",
    sources: "North Indian oral tradition (educational summary).",
    image: img("churail"),
    gallery: [],
    featured: true,
    tagSlugs: ["female-spirit", "village"],
  },
  {
    name: "Aseer",
    slug: "aseer",
    otherNames: ["Aseer Ruh", "Asir"],
    type: "RESTLESS_DEAD",
    regionSlug: "delhi",
    state: "Delhi",
    dangerLevel: "MEDIUM",
    habitat: "Old courtyards, locked rooms, abandoned urban corners",
    appearance:
      "A bound or constrained spirit—chains, cloth bindings, or a sense of captivity appear in metaphorical description.",
    behavior:
      "Narratives of unrest that cannot leave a place—binding, unfinished business, or ritual constraint.",
    origin: "Delhi urban/spiritual oral vocabulary (aseer ≈ captive/bound).",
    summary:
      "Aseer names a bound or captive spirit presence in Delhi folklore speech.",
    fullDescription: `<p><strong>Aseer</strong> (captive/bound) appears in Delhi-area spirit talk as a figure of constrained unrest—less a road ghost than a presence that cannot leave.</p>`,
    culturalNotes: "Word meaning matters; record language of the teller.",
    sources: "Delhi oral/spiritual vocabulary (educational summary).",
    image: img("aseer"),
    gallery: [],
    featured: false,
    tagSlugs: ["restless-dead", "possession"],
  },
  {
    name: "Aanchari",
    slug: "aanchari",
    otherNames: ["Ancheri", "Aanchhari"],
    type: "FOREST_SPIRITS",
    regionSlug: "uttarakhand",
    state: "Uttarakhand",
    dangerLevel: "MEDIUM",
    habitat: "Himalayan pine forests, ridges, mountain paths at twilight",
    appearance:
      "Often a luminous or ethereal female mountain spirit among deodars—beautiful and uncanny.",
    behavior:
      "Hill fairy-spirit lore: may lure or test travellers; also associated with wild feminine power of the mountains.",
    origin: "Uttarakhand Himalayan oral tradition (related names across Western Himalaya).",
    summary:
      "Aanchari is an Uttarakhand mountain spirit of forests and ridges—ethereal, powerful, and regionally beloved in tale.",
    fullDescription: `<p><strong>Aanchari</strong> (spellings vary) is a Himalayan female forest/mountain spirit of Uttarakhand lore.</p>
<p>She belongs with other hill feminine powers that are neither simple goddess nor simple ghost.</p>`,
    culturalNotes: "Hill spirits often sit between deity and ghost categories.",
    sources: "Uttarakhand oral tradition (educational summary).",
    image: img("aanchari"),
    gallery: [],
    featured: true,
    tagSlugs: ["forest", "female-spirit"],
  },
  {
    name: "Said",
    slug: "said",
    otherNames: ["Saeed", "Sayeed spirit"],
    type: "RESTLESS_DEAD",
    regionSlug: "uttarakhand",
    state: "Uttarakhand (also Himachal)",
    dangerLevel: "MEDIUM",
    habitat: "Mountain paths, stone temples, deodar forests",
    appearance:
      "Pale mountain ghost near shrines and forest paths; solemn rather than theatrical.",
    behavior:
      "Hill restless-dead presence shared in Uttarakhand and Himachal inventories.",
    origin: "Western Himalayan oral tradition (UK & HP).",
    summary:
      "Said is a Himalayan spirit name found in Uttarakhand and Himachal folklore lists.",
    fullDescription: `<p><strong>Said</strong> appears in both Uttarakhand and Himachal spirit catalogues as a mountain restless presence.</p>`,
    culturalNotes: "Shared Himalayan vocabulary across state borders.",
    sources: "Western Himalayan oral motifs (educational summary).",
    image: img("said"),
    gallery: [],
    featured: false,
    tagSlugs: ["restless-dead", "forest"],
  },
  {
    name: "Ranbhoot",
    slug: "ranbhoot",
    otherNames: ["Ran Bhoot", "Battlefield Ghost"],
    type: "RESTLESS_DEAD",
    regionSlug: "uttarakhand",
    state: "Uttarakhand",
    dangerLevel: "HIGH",
    habitat: "Old battlefields, hillsides, historic conflict sites",
    appearance:
      "Spectral warrior silhouette—faint martial outline in mist; the battlefield is the true face.",
    behavior:
      "Restless dead of conflict; tales of night processions or cries on historic ground.",
    origin: "Uttarakhand hill lore of war-dead and heroic unrest.",
    summary:
      "Ranbhoot is the battlefield ghost of Uttarakhand—spirit of those who fell in hill wars and raids.",
    fullDescription: `<p><strong>Ranbhoot</strong> (ran = battle) names the war-dead of hill memory in Uttarakhand folklore.</p>`,
    culturalNotes: "Connect carefully to local history without glorifying violence.",
    sources: "Uttarakhand oral tradition (educational summary).",
    image: img("ranbhoot"),
    gallery: [],
    featured: true,
    tagSlugs: ["restless-dead", "mythological"],
  },
  {
    name: "Golu Jyu ki Atma",
    slug: "golu-jyu-ki-atma",
    otherNames: ["Golu Devta", "Golu Jyu"],
    type: "MYTHOLOGICAL_BEINGS",
    regionSlug: "uttarakhand",
    state: "Uttarakhand (Kumaon)",
    dangerLevel: "LOW",
    habitat: "Hill shrines, bells, red cloth offerings, Kumaon sacred sites",
    appearance:
      "More deity-adjacent than horror ghost—presence at Golu Devta shrines with bells and petitions.",
    behavior:
      "Justice, vows, and petitions: Golu is widely worshipped in Kumaon. ‘Atma’ speech may blur ghost and divine presence in popular talk.",
    origin: "Kumaon (Uttarakhand) living tradition of Golu Devta.",
    summary:
      "Golu Jyu ki Atma points to Kumaon’s Golu Devta tradition—justice deity and spiritual presence, not a cheap scare figure.",
    fullDescription: `<p><strong>Golu Devta</strong> (Golu Jyu) is a major Kumaoni deity of justice. Popular speech about <em>atma</em> should not reduce living worship to ‘ghost hunting’.</p>
<p>BhootKosh includes this entry to document how hill communities speak of powerful spiritual presence—with respect.</p>`,
    culturalNotes: "This is living devotion. Do not frame as paranormal tourism.",
    sources: "Kumaon religious and oral tradition (educational summary).",
    image: img("golu-jyu-ki-atma"),
    gallery: [],
    featured: true,
    tagSlugs: ["mythological", "village"],
  },
  {
    name: "Bhootniya",
    slug: "bhootniya",
    otherNames: ["Bhootni", "Hill Bhootni"],
    type: "FEMALE_SPIRITS",
    regionSlug: "uttarakhand",
    state: "Uttarakhand",
    dangerLevel: "HIGH",
    habitat: "Misty pine forests, mountain paths, lonely hill roads",
    appearance:
      "Female mountain ghost—pale sari, long hair, forest mist; hill sister to plains chudail motifs.",
    behavior:
      "Dangerous female presence of Himalayan paths; warnings to lone travellers.",
    origin: "Uttarakhand female-spirit tradition.",
    summary:
      "Bhootniya is an Uttarakhand female mountain spirit of forests and night paths.",
    fullDescription: `<p><strong>Bhootniya</strong> names female ghost presence in Uttarakhand hill speech—related in theme to wider North Indian female-spirit lore but localised to mountains.</p>`,
    culturalNotes: "Avoid reducing hill women folklore to only ‘seductive ghost’ clichés.",
    sources: "Uttarakhand oral tradition (educational summary).",
    image: img("bhootniya"),
    gallery: [],
    featured: false,
    tagSlugs: ["female-spirit", "forest"],
  },
  {
    name: "Khabis",
    slug: "khabis",
    otherNames: ["Khabish", "Khabīs"],
    type: "DEMONS",
    regionSlug: "himachal-pradesh",
    state: "Himachal Pradesh (also Uttarakhand)",
    dangerLevel: "HIGH",
    habitat: "Rocky mountain paths, lonely ridges, stormy hill nights",
    appearance:
      "Malicious shadow-being of the hills—aggressive, dark, feared.",
    behavior:
      "Harmful hill spirit in Himachal and Uttarakhand inventories; kept at a distance by custom and cautionary tale.",
    origin: "Western Himalayan oral tradition.",
    summary:
      "Khabis is a feared malicious spirit of Himachal and Uttarakhand mountain lore.",
    fullDescription: `<p><strong>Khabis</strong> appears in Himalayan folklore lists as a harmful presence of ridges and night paths.</p>`,
    culturalNotes: "Document fear practices without encouraging dangerous mountain travel myths.",
    sources: "Western Himalayan oral motifs (educational summary).",
    image: img("khabis"),
    gallery: [],
    featured: true,
    tagSlugs: ["demon", "forest"],
  },
  {
    name: "Pahari Chhalawa",
    slug: "pahari-chhalawa",
    otherNames: ["Hill Chhalawa", "Pahadi Chhalawa"],
    type: "SHAPE_SHIFTERS",
    regionSlug: "himachal-pradesh",
    state: "Himachal Pradesh",
    dangerLevel: "HIGH",
    habitat: "Foggy mountain paths, pine forests, hill crossroads",
    appearance:
      "Mountain cousin of plains Chhalawa—dissolving, shape-shifting form in fog.",
    behavior:
      "Illusion and false forms on Himalayan trails; related to wider Chhalawa tradition.",
    origin: "Himachal Pradesh hill oral tradition.",
    summary:
      "Pahari Chhalawa is Himachal’s mountain shape-shifter—Chhalawa of the hills.",
    fullDescription: `<p><strong>Pahari Chhalawa</strong> adapts the North Indian shape-shifting Chhalawa motif to Himalayan landscape and fog.</p>`,
    culturalNotes: "Cross-link with Chhalawa (plains) entry.",
    sources: "Himachal oral tradition (educational summary).",
    image: img("pahari-chhalawa"),
    gallery: [],
    featured: true,
    tagSlugs: ["shape-shifter", "forest"],
  },
  {
    name: "Jogini",
    slug: "jogini",
    otherNames: ["Yogini", "Jogni"],
    type: "MYTHOLOGICAL_BEINGS",
    regionSlug: "himachal-pradesh",
    state: "Himachal Pradesh",
    dangerLevel: "MEDIUM",
    habitat: "Waterfalls, cliff shrines, high places, ritual sites",
    appearance:
      "Powerful feminine spiritual presence—sometimes fierce, sometimes protective—near water and rock shrines.",
    behavior:
      "Hill yogini/jogini traditions blend goddess, spirit, and sacred geography. Not reducible to ‘ghost’ alone.",
    origin: "Himachal and wider Himalayan yogini sacred geography.",
    summary:
      "Jogini marks powerful feminine sacred presence in Himachal—spirit, deity, and landscape intertwined.",
    fullDescription: `<p><strong>Jogini</strong> (yogini) traditions in Himachal are living sacred geography. BhootKosh notes them because popular speech may say ‘spirit’ where ritual practice says ‘devi’.</p>`,
    culturalNotes: "Sacred sites require respect; no trespass narratives.",
    sources: "Himachal sacred and oral tradition (educational summary).",
    image: img("jogini"),
    gallery: [],
    featured: true,
    tagSlugs: ["mythological", "female-spirit"],
  },
  {
    name: "Devchar",
    slug: "devchar",
    otherNames: ["Devchar", "Dev-char"],
    type: "VILLAGE_SPIRITS",
    regionSlug: "himachal-pradesh",
    state: "Himachal Pradesh",
    dangerLevel: "LOW",
    habitat: "Village rooftops, cedar forests, household edges at night",
    appearance:
      "Small or elusive spectral figure—mischievous rather than monstrous in many tellings.",
    behavior:
      "Trickster hill spirit of Himachal villages—pranks, night noises, boundary play.",
    origin: "Himachal village oral tradition.",
    summary:
      "Devchar is a mischievous Himachal village spirit of night roofs and forest edges.",
    fullDescription: `<p><strong>Devchar</strong> belongs to Himachal’s lighter (but still eerie) village spirit talk—mischief at the edge of the home.</p>`,
    culturalNotes: "Not every spirit is a predator; record tone of the tale.",
    sources: "Himachal oral tradition (educational summary).",
    image: img("devchar"),
    gallery: [],
    featured: false,
    tagSlugs: ["village", "forest"],
  },
  {
    name: "Bir",
    slug: "bir",
    otherNames: ["Beer", "Bir Bhairav forms locally"],
    type: "MYTHOLOGICAL_BEINGS",
    regionSlug: "himachal-pradesh",
    state: "Himachal Pradesh",
    dangerLevel: "MEDIUM",
    habitat: "Stone temples, ritual flags, mountain villages",
    appearance:
      "Warrior-like protective presence—fierce, martial, linked to local bir/bhairav-type guardianship in hill speech.",
    behavior:
      "Protective power that can also be fearsome; vows, flags, and local guardianship rituals.",
    origin: "Himachal hill guardian/warrior spirit-deity traditions.",
    summary:
      "Bir is a Himachal warrior-guardian presence—folk power at the edge of ghost and deity.",
    fullDescription: `<p><strong>Bir</strong> in Himachal lore often points to martial protective beings of village and temple—document with ritual context, not only scare stories.</p>`,
    culturalNotes: "Guardian traditions are living practice in many villages.",
    sources: "Himachal oral and ritual tradition (educational summary).",
    image: img("bir"),
    gallery: [],
    featured: true,
    tagSlugs: ["mythological", "village"],
  },
];

export const extraRegions = [
  {
    name: "Madhya Pradesh",
    slug: "madhya-pradesh",
    state: "Madhya Pradesh",
    description:
      "Central Indian plains and forests hold village, smashan, and woodland spirit traditions.",
  },
  {
    name: "Haryana",
    slug: "haryana",
    state: "Haryana",
    description:
      "North Indian plain folklore of fields, village boundaries, and night-road spirits.",
  },
  {
    name: "Punjab",
    slug: "punjab",
    state: "Punjab",
    description:
      "Punjabi oral culture names churail, chhalawa, jinn, and rural restless dead.",
  },
  {
    name: "Delhi",
    slug: "delhi",
    state: "Delhi",
    description:
      "Urban North Indian spirit speech—jinn, chhalawa, masan, and bound unrest in the old city and beyond.",
  },
  {
    name: "Uttarakhand",
    slug: "uttarakhand",
    state: "Uttarakhand",
    description:
      "Himalayan folklore of aanchari, ranbhoot, Golu Devta, and mountain female spirits.",
  },
];

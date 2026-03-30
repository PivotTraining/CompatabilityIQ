// @ts-nocheck -- pending schema regen
// CompatibleIQ -- Archetype Narratives
// Rich descriptions, pairing dynamics, and narrative content for each archetype

export type ArchetypeId = 'anchor' | 'spark' | 'builder' | 'empath' | 'maverick'

// ═══════════════════════════════════════════
// Individual Archetype Descriptions
// ═══════════════════════════════════════════

export interface ArchetypeProfile {
  id: ArchetypeId
  name: string
  tagline: string
  emoji: string
  description: string
  strengths: string[]
  blindSpots: string[]
  bestPairedWith: ArchetypeId[]
  inRelationship: string
  underStress: string
  growthEdge: string
}

export const ARCHETYPE_PROFILES: Record<ArchetypeId, ArchetypeProfile> = {
  anchor: {
    id: 'anchor',
    name: 'The Anchor',
    tagline: 'Steady hands, open heart.',
    emoji: '\u2693',
    description:
      'You are the person people lean on and never have to question. Emotionally grounded, secure in who you are, and present in a way that makes others feel safe. You bring stability not through rigidity but through consistency -- you show up the same way whether things are easy or hard. In relationships, you are the calm in someone else\'s storm, and you don\'t need external validation to know your worth.',
    strengths: [
      'Emotionally consistent and dependable',
      'Creates a safe space for vulnerability',
      'Communicates directly without drama',
      'Handles conflict with maturity and patience',
      'High self-awareness and emotional regulation',
    ],
    blindSpots: [
      'Can seem "too stable" -- partners may mistake steadiness for lack of passion',
      'May suppress own needs to maintain harmony',
      'Risk of attracting partners who rely on you without reciprocating',
      'Can struggle with spontaneity and going with the flow',
      'May avoid rocking the boat even when something needs to be said',
    ],
    bestPairedWith: ['empath', 'spark', 'builder'],
    inRelationship:
      'Anchors are the partner who remembers the small things, follows through on promises, and brings a sense of order to the emotional chaos of life. They prefer deep, consistent love over dramatic displays. They communicate openly and expect the same in return.',
    underStress:
      'When overwhelmed, Anchors tend to go quiet and internal. They process alone before sharing, which can read as withdrawal to partners who need verbal reassurance. Their stress response is to stabilize everything around them, sometimes at the cost of their own emotional needs.',
    growthEdge:
      'Learning to let go of control and embrace uncertainty. The Anchor\'s greatest growth comes from trusting that things don\'t always need to be steady to be good -- that a little chaos can be generative, and that asking for help is not a weakness.',
  },

  spark: {
    id: 'spark',
    name: 'The Spark',
    tagline: 'Life is too short for boring love.',
    emoji: '\u26A1',
    description:
      'You are magnetic, passionate, and unapologetically alive. You bring energy into every room and every relationship. You crave novelty, adventure, and the electric feeling of real connection. You\'re not interested in going through the motions -- you want a love that makes you feel something. Your enthusiasm is contagious, and your willingness to be fully present in the moment makes people feel seen in a way they rarely experience.',
    strengths: [
      'Brings excitement and spontaneity to relationships',
      'Fearless about expressing desire and passion',
      'Makes partners feel pursued and wanted',
      'High energy and adventurous spirit',
      'Lives fully in the present moment',
    ],
    blindSpots: [
      'Can mistake intensity for depth',
      'May struggle with the quieter, routine phases of a relationship',
      'Tendency to chase the "high" of new connection',
      'Can be impulsive in conflict -- says things in the heat of the moment',
      'May unintentionally overwhelm partners who need more space',
    ],
    bestPairedWith: ['anchor', 'maverick', 'spark'],
    inRelationship:
      'Sparks keep the fire alive. They plan surprises, initiate physical connection, and refuse to let a relationship become stale. They need a partner who can match their energy or at least appreciate it without trying to dim it. They express love through action, touch, and grand gestures.',
    underStress:
      'Under stress, Sparks can become reactive and confrontational. They process emotions out loud and in real-time, which can feel intense to partners who need space. They may also channel stress into restlessness -- needing to do something, go somewhere, change something.',
    growthEdge:
      'Learning that love can be quiet and still be deep. The Spark\'s growth comes from sitting with stillness, finding beauty in routine, and trusting that a relationship doesn\'t need constant fireworks to be real. Patience is their superpower-in-training.',
  },

  builder: {
    id: 'builder',
    name: 'The Builder',
    tagline: 'Love with a blueprint.',
    emoji: '\uD83D\uDEE0\uFE0F',
    description:
      'You approach love the way you approach everything else: with intention, strategy, and a clear vision of what you\'re building toward. You are future-focused, ambitious, and deeply practical. You believe that a great relationship is built, not found -- and you\'re willing to put in the work. You show love through actions, reliability, and creating a life together that actually works.',
    strengths: [
      'Goal-oriented and intentional about relationships',
      'Shows love through actions and follow-through',
      'Financially responsible and future-minded',
      'Excellent at creating structure and stability',
      'Values partnership as a team effort',
    ],
    blindSpots: [
      'Can treat the relationship like a project to optimize',
      'May prioritize career or goals over emotional connection',
      'Struggles to be present when the "plan" is disrupted',
      'Can come across as transactional or emotionally distant',
      'May undervalue play, spontaneity, and emotional expression',
    ],
    bestPairedWith: ['anchor', 'builder', 'empath'],
    inRelationship:
      'Builders are the partner who has the five-year plan, the retirement account, and the weekend routine dialed in. They show up through doing -- handling logistics, making plans, and building something tangible. They need a partner who respects their drive and doesn\'t interpret ambition as neglect.',
    underStress:
      'When stressed, Builders double down on control. They make more lists, work longer hours, and try to solve emotional problems with practical solutions. They may intellectualize feelings rather than sitting with them, and their need for order can create tension with partners who process differently.',
    growthEdge:
      'Learning that not everything can be planned or optimized. The Builder\'s growth comes from embracing emotional messiness, prioritizing presence over productivity, and understanding that sometimes the best thing to do is nothing -- just be.',
  },

  empath: {
    id: 'empath',
    name: 'The Empath',
    tagline: 'I feel everything. And I mean everything.',
    emoji: '\uD83D\uDC9C',
    description:
      'You experience the world at a depth that most people don\'t even know exists. You feel your own emotions intensely and absorb others\' emotions just as deeply. In relationships, you are profoundly attuned to your partner\'s inner world -- often understanding what they need before they can articulate it. Your emotional intelligence is your superpower, and your capacity for love is vast.',
    strengths: [
      'Deeply emotionally perceptive and intuitive',
      'Creates profound emotional connection',
      'Naturally nurturing and supportive',
      'Excellent listener who makes partners feel truly heard',
      'High capacity for empathy and compassion',
    ],
    blindSpots: [
      'Can lose themselves in a partner\'s emotional world',
      'May prioritize partner\'s needs over their own boundaries',
      'Tendency toward anxious attachment patterns',
      'Can become emotionally overwhelmed or burned out',
      'May interpret emotional distance as rejection',
    ],
    bestPairedWith: ['anchor', 'builder', 'empath'],
    inRelationship:
      'Empaths are the partner who remembers the specific thing you said three months ago that hurt your feelings and checks in to make sure you\'re okay. They love through words, presence, and emotional attunement. They crave deep conversation, vulnerability, and the feeling of being truly known.',
    underStress:
      'Under stress, Empaths can become hyper-vigilant about their partner\'s mood, reading into every micro-expression and tone shift. They may become anxious, seek reassurance, or withdraw to protect themselves from emotional overload. Their empathy, which is usually a gift, can become a source of exhaustion.',
    growthEdge:
      'Learning to hold space for others without losing themselves. The Empath\'s growth comes from establishing firm boundaries, practicing self-regulation, and trusting that their partner\'s emotions are not their responsibility to fix.',
  },

  maverick: {
    id: 'maverick',
    name: 'The Maverick',
    tagline: 'I love you, but I also love my freedom.',
    emoji: '\uD83E\uDDED',
    description:
      'You are fiercely independent, unconventional, and allergic to anything that feels like a box. You value autonomy in all things -- your time, your space, your identity. You believe that the best relationships are between two whole people who choose each other every day, not two halves looking to be completed. You challenge norms, question traditions, and build relationships on your own terms.',
    strengths: [
      'Brings independence and self-sufficiency to relationships',
      'Challenges partners to grow and think differently',
      'Refuses to lose identity in a relationship',
      'Comfortable with solitude and self-reflection',
      'Values authenticity over social expectations',
    ],
    blindSpots: [
      'Can mistake independence for emotional unavailability',
      'May struggle to make a partner feel prioritized',
      'Tendency toward avoidant attachment patterns',
      'Can be perceived as emotionally withholding',
      'May resist compromise as a threat to autonomy',
    ],
    bestPairedWith: ['spark', 'maverick', 'anchor'],
    inRelationship:
      'Mavericks are the partner who needs their own space, their own friends, and their own projects. They love deeply but express it on their own timeline. They need a partner who is secure enough to not interpret independence as disinterest and who values their own autonomy equally.',
    underStress:
      'Under stress, Mavericks withdraw. They need space to process alone and can become irritable if they feel crowded. They may pull away from emotional conversations and retreat into their own world, which can feel like abandonment to partners who need closeness during hard times.',
    growthEdge:
      'Learning that interdependence is not dependence. The Maverick\'s growth comes from letting someone in without feeling like they\'re losing themselves, and from understanding that vulnerability and closeness are not threats to autonomy but expressions of strength.',
  },
}

// ═══════════════════════════════════════════
// Archetype Pairing Narratives
// ═══════════════════════════════════════════

export interface PairingNarrative {
  archetypeA: ArchetypeId
  archetypeB: ArchetypeId
  score: number // 0-100
  tier: 'very_high' | 'high' | 'medium_high' | 'medium' | 'low_medium' | 'low'
  narrative: string
  strengths: string[]
  watchOuts: string[]
}

/**
 * The full 5x5 pairing matrix. Since order doesn't matter for compatibility,
 * we store each pair once (alphabetically) and look up both directions.
 */
export const PAIRING_NARRATIVES: PairingNarrative[] = [
  // ── Anchor + Anchor ──
  {
    archetypeA: 'anchor',
    archetypeB: 'anchor',
    score: 78,
    tier: 'high',
    narrative:
      'Two Anchors create one of the most emotionally stable partnerships possible. There is a deep mutual understanding of each other\'s need for consistency and reliability. The risk is that "stable" slides into "stagnant" -- both partners may avoid difficult conversations or new experiences in favor of maintaining the status quo.',
    strengths: [
      'Extremely high emotional safety and trust',
      'Both partners communicate directly and maturely',
      'Shared values around consistency and reliability',
      'Low conflict volatility -- disagreements are handled calmly',
    ],
    watchOuts: [
      'Relationship may lack excitement or spontaneity',
      'Both may avoid conflict rather than address it',
      'Can become emotionally complacent over time',
      'May need to intentionally inject novelty and adventure',
    ],
  },

  // ── Anchor + Spark ──
  {
    archetypeA: 'anchor',
    archetypeB: 'spark',
    score: 82,
    tier: 'high',
    narrative:
      'This is the classic "opposites attract" pairing that actually works. The Anchor provides the stability and emotional safety that allows the Spark to be fully themselves without burning out. The Spark brings excitement, passion, and spontaneity that keeps the Anchor from becoming too comfortable. When this works, it\'s a beautifully balanced partnership where each person brings what the other needs most.',
    strengths: [
      'Natural balance of stability and excitement',
      'Spark pushes Anchor out of their comfort zone',
      'Anchor grounds the Spark without dimming their light',
      'Strong physical and emotional chemistry potential',
    ],
    watchOuts: [
      'Spark may feel "held back" by Anchor\'s need for routine',
      'Anchor may feel exhausted by Spark\'s constant energy',
      'Different conflict styles can create friction',
      'Spark\'s spontaneity vs. Anchor\'s need for planning',
    ],
  },

  // ── Anchor + Builder ──
  {
    archetypeA: 'anchor',
    archetypeB: 'builder',
    score: 80,
    tier: 'high',
    narrative:
      'The Anchor and Builder share a deep respect for stability, commitment, and building something real. The Anchor provides the emotional foundation while the Builder provides the strategic vision. This is a partnership that feels like a team -- both people are rowing in the same direction. The challenge is ensuring there\'s enough emotional warmth alongside all that structure.',
    strengths: [
      'Shared values around commitment and long-term vision',
      'Complementary strengths: emotional grounding + strategic drive',
      'Both value reliability and follow-through',
      'Strong foundation for family and financial planning',
    ],
    watchOuts: [
      'May become too focused on "building" and forget to enjoy the present',
      'Builder may prioritize goals over emotional connection',
      'Relationship can feel like a business partnership if unchecked',
      'Both may struggle with vulnerability and emotional expression',
    ],
  },

  // ── Anchor + Empath ──
  {
    archetypeA: 'anchor',
    archetypeB: 'empath',
    score: 90,
    tier: 'very_high',
    narrative:
      'This is one of the highest-compatibility pairings in the entire system. The Anchor\'s emotional steadiness creates the exact environment the Empath needs to thrive without burning out. The Empath brings depth, emotional richness, and a level of attunement that makes the Anchor feel genuinely understood. Both are emotionally available, both value deep connection, and both show up for each other in ways that feel effortless.',
    strengths: [
      'Profound emotional connection and mutual understanding',
      'Anchor provides safety that lets Empath be fully open',
      'Empath helps Anchor access and express deeper emotions',
      'Both are committed to emotional growth and vulnerability',
    ],
    watchOuts: [
      'Empath may become over-reliant on Anchor for emotional regulation',
      'Anchor may feel pressure to always be the "strong one"',
      'Empath\'s anxiety may occasionally trigger Anchor\'s need for space',
      'Must maintain individual identities outside the relationship',
    ],
  },

  // ── Anchor + Maverick ──
  {
    archetypeA: 'anchor',
    archetypeB: 'maverick',
    score: 65,
    tier: 'medium',
    narrative:
      'This pairing has real potential but requires significant understanding from both sides. The Anchor offers the security and consistency the Maverick secretly needs but won\'t ask for. The Maverick brings freshness, independence, and intellectual stimulation that keeps the Anchor engaged. The core tension: the Anchor may feel like they\'re always waiting for the Maverick to fully show up, while the Maverick may feel subtly pressured to be more emotionally available than they\'re comfortable with.',
    strengths: [
      'Anchor\'s security gives Maverick freedom to be themselves',
      'Maverick challenges Anchor to embrace independence',
      'Both respect each other\'s autonomy when balanced well',
      'Can build a relationship with healthy space',
    ],
    watchOuts: [
      'Maverick\'s need for space may feel like rejection to Anchor',
      'Anchor may over-function emotionally while Maverick under-functions',
      'Core attachment tension: secure vs. avoidant dynamics',
      'Maverick may resist the "we" identity Anchor naturally builds',
    ],
  },

  // ── Spark + Spark ──
  {
    archetypeA: 'spark',
    archetypeB: 'spark',
    score: 70,
    tier: 'medium_high',
    narrative:
      'Two Sparks together is fireworks -- literally. The passion is electric, the chemistry is undeniable, and the relationship feels alive in a way that makes everyone around them either inspired or exhausted. The challenge is sustainability. When both partners run on intensity, there\'s no one to pump the brakes during conflict, and the same passion that fuels the highs can fuel devastating lows.',
    strengths: [
      'Incredible physical and emotional chemistry',
      'Both embrace adventure and spontaneity',
      'Relationship never gets boring or routine',
      'Deep mutual understanding of each other\'s intensity',
    ],
    watchOuts: [
      'Conflicts can escalate quickly with no one to de-escalate',
      'Intensity may burn bright but burn out fast',
      'Both may struggle with the mundane parts of partnership',
      'Jealousy or competition for attention is possible',
    ],
  },

  // ── Spark + Builder ──
  {
    archetypeA: 'spark',
    archetypeB: 'builder',
    score: 58,
    tier: 'medium',
    narrative:
      'The Spark and Builder can either be a powerful complementary pair or a source of constant friction. The Spark brings the passion and spontaneity that the Builder secretly craves but won\'t prioritize. The Builder brings the structure and long-term thinking that the Spark needs but may resist. When it works, the Builder provides the framework and the Spark fills it with color. When it doesn\'t, the Builder feels like the Spark is reckless, and the Spark feels like the Builder is controlling.',
    strengths: [
      'Complementary energies when balanced',
      'Builder provides structure, Spark provides inspiration',
      'Can create a relationship that is both exciting and sustainable',
      'Mutual respect for each other\'s drive',
    ],
    watchOuts: [
      'Fundamentally different approaches to time and priorities',
      'Builder may see Spark as unserious or impulsive',
      'Spark may see Builder as rigid or emotionally unavailable',
      'Conflict over spontaneity vs. planning can be chronic',
    ],
  },

  // ── Spark + Empath ──
  {
    archetypeA: 'spark',
    archetypeB: 'empath',
    score: 62,
    tier: 'medium',
    narrative:
      'This pairing brings together two emotionally expressive types, creating a relationship full of intensity and depth. The Spark brings passion and excitement; the Empath brings emotional attunement and care. The connection can feel intoxicating. The risk is volatility: the Spark\'s impulsiveness can trigger the Empath\'s anxiety, and the Empath\'s emotional needs can feel overwhelming to the Spark when they\'re in go-mode.',
    strengths: [
      'Deep emotional and physical connection',
      'Both are comfortable with emotional expression',
      'Empath makes Spark feel deeply understood',
      'Spark makes Empath feel desired and alive',
    ],
    watchOuts: [
      'Emotional volatility when both are activated',
      'Spark\'s impulsiveness can trigger Empath\'s anxiety',
      'Empath may absorb Spark\'s emotional swings',
      'Neither may be equipped to be the "steady" one during conflict',
    ],
  },

  // ── Spark + Maverick ──
  {
    archetypeA: 'spark',
    archetypeB: 'maverick',
    score: 76,
    tier: 'high',
    narrative:
      'Two free spirits who understand each other\'s need for excitement and autonomy. The Spark brings the passion and the Maverick brings the independence, creating a relationship that feels like an adventure rather than a cage. They respect each other\'s need for space and bring each other along on their individual journeys. This pairing thrives on mutual admiration and the shared belief that love should enhance freedom, not restrict it.',
    strengths: [
      'Mutual respect for independence and individuality',
      'Both love adventure and new experiences',
      'Low risk of codependency',
      'Exciting, dynamic relationship with natural chemistry',
    ],
    watchOuts: [
      'May struggle to build deep emotional intimacy',
      'Both may avoid difficult emotional conversations',
      'Lack of a grounding force can create instability',
      'One or both may struggle with commitment milestones',
    ],
  },

  // ── Builder + Builder ──
  {
    archetypeA: 'builder',
    archetypeB: 'builder',
    score: 72,
    tier: 'medium_high',
    narrative:
      'Two Builders together are a power couple in the truest sense. Shared ambition, aligned goals, and a mutual understanding that great things take work. They respect each other\'s drive and build a partnership that looks impressive from the outside. The risk is competition -- two alpha strategists can clash over whose plan takes priority -- and the emotional connection may be under-nourished while both partners focus on achievement.',
    strengths: [
      'Shared ambition and long-term vision',
      'Both understand the sacrifices required for success',
      'Strong financial alignment and planning',
      'Mutual respect for work ethic and discipline',
    ],
    watchOuts: [
      'Competition over career priorities and decision-making',
      'Emotional connection may be deprioritized',
      'Both may struggle to be vulnerable with each other',
      'Relationship can feel like a business arrangement',
    ],
  },

  // ── Builder + Empath ──
  {
    archetypeA: 'builder',
    archetypeB: 'empath',
    score: 74,
    tier: 'medium_high',
    narrative:
      'The Builder and Empath create a partnership that balances head and heart. The Builder provides structure, direction, and practical stability. The Empath provides emotional depth, nurturing, and the relational warmth that keeps the partnership from becoming purely transactional. When aligned, the Empath softens the Builder\'s edges and the Builder gives the Empath a sense of security and direction.',
    strengths: [
      'Strong head-heart balance in the relationship',
      'Empath ensures emotional needs are prioritized',
      'Builder provides stability the Empath needs',
      'Complementary strengths: practical + emotional intelligence',
    ],
    watchOuts: [
      'Builder may dismiss Empath\'s emotional needs as irrational',
      'Empath may feel unheard when Builder shifts to "fix-it" mode',
      'Power imbalance risk if Builder becomes the decision-maker',
      'Empath may over-accommodate to keep the Builder happy',
    ],
  },

  // ── Builder + Maverick ──
  {
    archetypeA: 'builder',
    archetypeB: 'maverick',
    score: 48,
    tier: 'low_medium',
    narrative:
      'This is one of the more challenging pairings. The Builder wants to build something together; the Maverick wants to remain free. The Builder has a five-year plan; the Maverick questions why anyone needs one. At their best, the Builder\'s structure can provide a launchpad for the Maverick\'s independence, and the Maverick\'s unconventional thinking can push the Builder toward innovation. At their worst, both feel fundamentally misunderstood.',
    strengths: [
      'Can push each other out of comfort zones',
      'Maverick\'s creativity can complement Builder\'s execution',
      'Both value self-sufficiency',
      'When aligned on a shared vision, very powerful',
    ],
    watchOuts: [
      'Fundamentally different views on commitment and structure',
      'Builder may feel the Maverick is non-committal',
      'Maverick may feel the Builder is controlling',
      'Very different conflict styles and emotional processing',
    ],
  },

  // ── Empath + Empath ──
  {
    archetypeA: 'empath',
    archetypeB: 'empath',
    score: 75,
    tier: 'medium_high',
    narrative:
      'Two Empaths create a relationship of extraordinary emotional depth. They understand each other\'s inner worlds intuitively, and the level of emotional intimacy can be profound. However, without a grounding force, both partners may become consumed by each other\'s emotional states, creating a feedback loop of anxiety or emotional overwhelm. This pairing thrives when both partners have strong individual self-regulation skills.',
    strengths: [
      'Unparalleled emotional intimacy and understanding',
      'Both feel deeply seen and validated',
      'Rich, meaningful communication about feelings',
      'Strong mutual empathy and compassion',
    ],
    watchOuts: [
      'Emotional co-regulation can become co-dysregulation',
      'Both may absorb each other\'s stress and anxiety',
      'Difficulty making practical decisions when both lead with emotion',
      'May avoid conflict to protect each other\'s feelings',
    ],
  },

  // ── Empath + Maverick ──
  {
    archetypeA: 'empath',
    archetypeB: 'maverick',
    score: 42,
    tier: 'low_medium',
    narrative:
      'This is the classic anxious-avoidant pairing, and it requires real work to succeed. The Empath craves closeness, vulnerability, and emotional availability. The Maverick craves space, independence, and autonomy. The Empath may interpret the Maverick\'s need for space as rejection, while the Maverick may interpret the Empath\'s need for closeness as pressure. When both partners are self-aware and willing to grow, this pairing can be transformative. Without that awareness, it\'s a cycle of pursuit and withdrawal.',
    strengths: [
      'Potential for profound personal growth on both sides',
      'Empath can help Maverick access deeper emotions',
      'Maverick can help Empath build healthier boundaries',
      'Magnetic initial attraction due to complementary energies',
    ],
    watchOuts: [
      'Classic anxious-avoidant pursue-withdraw cycle',
      'Empath may feel chronically undervalued',
      'Maverick may feel chronically pressured',
      'Requires significant self-awareness from both partners',
    ],
  },

  // ── Maverick + Maverick ──
  {
    archetypeA: 'maverick',
    archetypeB: 'maverick',
    score: 60,
    tier: 'medium',
    narrative:
      'Two Mavericks respect each other\'s independence implicitly. There\'s no drama about needing space, no guilt about separate interests, and no pressure to be someone you\'re not. The relationship feels free and authentic. The challenge is building genuine intimacy and commitment when both partners default to independence. Without intentional emotional investment, this pairing can become two people living parallel lives who happen to share a bed.',
    strengths: [
      'Total mutual respect for independence',
      'No codependency or enmeshment risk',
      'Both value authenticity and non-traditional approaches',
      'Intellectually stimulating and unconventional',
    ],
    watchOuts: [
      'May struggle to build emotional depth',
      'Neither partner may prioritize the relationship enough',
      'Can drift apart without deliberate connection efforts',
      'Commitment milestones may be delayed indefinitely',
    ],
  },
]

// ═══════════════════════════════════════════
// Lookup Helpers
// ═══════════════════════════════════════════

/**
 * Get the pairing narrative for two archetypes (order-independent).
 */
export function getPairingNarrative(a: ArchetypeId, b: ArchetypeId): PairingNarrative | undefined {
  return PAIRING_NARRATIVES.find(
    (p) =>
      (p.archetypeA === a && p.archetypeB === b) ||
      (p.archetypeA === b && p.archetypeB === a)
  )
}

/**
 * Get all pairings for a given archetype, sorted by score descending.
 */
export function getPairingsForArchetype(archetype: ArchetypeId): PairingNarrative[] {
  return PAIRING_NARRATIVES
    .filter((p) => p.archetypeA === archetype || p.archetypeB === archetype)
    .sort((a, b) => b.score - a.score)
}

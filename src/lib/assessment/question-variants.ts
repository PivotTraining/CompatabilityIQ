// @ts-nocheck -- pending schema regen
// @ts-nocheck -- pending schema regen
import type { AssessmentQuestion } from './types'

// ════════════════════════════════════════════
// DEMOGRAPHIC-AWARE QUESTION VARIANTS
// Each variant measures the same construct as its base question
// but uses culturally relevant framing for specific demographics
// ════════════════════════════════════════════

export type AgeBracket = 'young_professional' | 'established' | 'seasoned'
export type CulturalContext = 'universal' | 'black_culture' | 'latino_culture' | 'general_pop'

export interface QuestionVariant extends AssessmentQuestion {
  demographics: {
    age_brackets: AgeBracket[]
    cultural_contexts: CulturalContext[]
  }
  replaces: string // ID of the base question this can substitute for
}

// ════════════════════════════════════════════
// MODULE 1 VARIANTS: Values & Priorities (VP)
// Base: 8 questions | Variants: 12
// ════════════════════════════════════════════

const MODULE_1_VARIANTS: QuestionVariant[] = [
  // ── Replaces m1_vp_01 (life_direction — partner's dream job) ──
  {
    id: 'm1_vp_01_v1', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    replaces: 'm1_vp_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your partner gets into their dream grad program in another state. You just locked in a lease. What happens?',
    options: [
      { value: 1, label: 'I stay. They knew my situation.' },
      { value: 2, label: 'We try long-distance and revisit in a semester' },
      { value: 3, label: 'We look at the finances and timelines together' },
      { value: 4, label: 'I\'d break the lease if their program is the real deal' },
      { value: 5, label: 'We figure it out together. That\'s the whole point.' },
    ],
  },
  {
    id: 'm1_vp_01_v2', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    replaces: 'm1_vp_01',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['universal'] },
    text: 'Your partner gets a once-in-a-lifetime offer overseas. Your kids are settled in school. What happens?',
    options: [
      { value: 1, label: 'They go. The kids\' stability comes first.' },
      { value: 2, label: 'We explore if it can be temporary or remote' },
      { value: 3, label: 'Family meeting. Everyone weighs in.' },
      { value: 4, label: 'I\'d seriously consider uprooting if it\'s that big' },
      { value: 5, label: 'We go as a family. Adventures build character.' },
    ],
  },

  // ── Replaces m1_vp_03 (life_direction — Curb vs Martin, cultural alignment/humor) ──
  {
    id: 'm1_vp_03_v1', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    replaces: 'm1_vp_03',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['general_pop'] },
    text: 'Tyler, the Creator or Drake? This says a lot about you.',
    options: [
      { value: 1, label: 'Tyler. The weirdness is the whole point.' },
      { value: 2, label: 'Tyler, but Drake has his moments' },
      { value: 3, label: 'Honestly depends on my mood that day' },
      { value: 4, label: 'Drake, but I respect Tyler\'s vision' },
      { value: 5, label: 'Drake. Not even close. He soundtracks my life.' },
    ],
  },
  {
    id: 'm1_vp_03_v2', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    replaces: 'm1_vp_03',
    demographics: { age_brackets: ['established'], cultural_contexts: ['general_pop'] },
    text: 'Insecure or Succession?',
    options: [
      { value: 1, label: 'Succession. The power dynamics are addicting.' },
      { value: 2, label: 'Succession, but Insecure hit different' },
      { value: 3, label: 'Honestly both. Different vibes for different nights.' },
      { value: 4, label: 'Insecure, but Succession was elite TV' },
      { value: 5, label: 'Insecure. That show was a mirror, not just a show.' },
    ],
  },
  {
    id: 'm1_vp_03_v3', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    replaces: 'm1_vp_03',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['black_culture'] },
    text: 'A Different World or The Fresh Prince?',
    options: [
      { value: 1, label: 'A Different World. Whitley and Dwayne are canon.' },
      { value: 2, label: 'A Different World, but Fresh Prince is comfort TV' },
      { value: 3, label: 'Can\'t choose. Both shaped who I am.' },
      { value: 4, label: 'Fresh Prince, but ADW carried culture' },
      { value: 5, label: 'Fresh Prince. Will Smith was the blueprint.' },
    ],
  },
  {
    id: 'm1_vp_03_v4', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    replaces: 'm1_vp_03',
    demographics: { age_brackets: ['established'], cultural_contexts: ['black_culture'] },
    text: 'Martin or Living Single?',
    options: [
      { value: 1, label: 'Martin. That show was a whole cultural moment.' },
      { value: 2, label: 'Martin, but Living Single deserved more credit' },
      { value: 3, label: 'Both. Different energy, same era, same love.' },
      { value: 4, label: 'Living Single, but Martin is iconic' },
      { value: 5, label: 'Living Single. The original friend group show. Period.' },
    ],
  },
  {
    id: 'm1_vp_03_v5', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    replaces: 'm1_vp_03',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['general_pop'] },
    text: 'The Office or Friends? And yes, your answer says something about you.',
    options: [
      { value: 1, label: 'The Office. The cringe humor is perfection.' },
      { value: 2, label: 'The Office, but I grew up on Friends' },
      { value: 3, label: 'Both hit different. Depends on the mood.' },
      { value: 4, label: 'Friends, but The Office has its moments' },
      { value: 5, label: 'Friends. I don\'t care what the internet says.' },
    ],
  },

  // ── Replaces m1_vp_04 (moral_flexibility — Barry Bonds) ──
  {
    id: 'm1_vp_04_v1', module: 1, quotient: 'VP', dimension: 'moral_flexibility', format: 'scenario',
    replaces: 'm1_vp_04',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Should college athletes get paid even if it completely changes the sport?',
    options: [
      { value: 1, label: 'No. Amateurism has a purpose. Protect it.' },
      { value: 2, label: 'Probably not. The system was fine before NIL.' },
      { value: 3, label: 'Tough call. I see both sides.' },
      { value: 4, label: 'Yes, but there should be limits and structure' },
      { value: 5, label: 'Absolutely. They generate the revenue. Pay them.' },
    ],
  },
  {
    id: 'm1_vp_04_v2', module: 1, quotient: 'VP', dimension: 'moral_flexibility', format: 'scenario',
    replaces: 'm1_vp_04',
    demographics: { age_brackets: ['established'], cultural_contexts: ['universal'] },
    text: 'Your coworker takes credit for your idea in a meeting. The boss loves it. How far do you take it?',
    options: [
      { value: 1, label: 'I go to my boss privately. That was my work.' },
      { value: 2, label: 'I bring it up to the coworker directly first' },
      { value: 3, label: 'I\'m annoyed but I weigh whether it\'s worth the fight' },
      { value: 4, label: 'I let it go this time but I\'m watching' },
      { value: 5, label: 'Let them have it. My work speaks for itself over time.' },
    ],
  },
  {
    id: 'm1_vp_04_v3', module: 1, quotient: 'VP', dimension: 'moral_flexibility', format: 'scenario',
    replaces: 'm1_vp_04',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['black_culture'] },
    text: 'O.J. -- guilty, innocent, or does it not even matter anymore?',
    options: [
      { value: 1, label: 'Guilty. The evidence was clear.' },
      { value: 2, label: 'Probably guilty, but the system failed long before him' },
      { value: 3, label: 'Complicated. The trial was about more than one man.' },
      { value: 4, label: 'The system got a taste of its own medicine. Move on.' },
      { value: 5, label: 'It doesn\'t matter anymore. The conversation it started is what matters.' },
    ],
  },
  {
    id: 'm1_vp_04_v4', module: 1, quotient: 'VP', dimension: 'moral_flexibility', format: 'scenario',
    replaces: 'm1_vp_04',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'Your family expects you at every holiday, but your partner\'s family has the same expectation. Who wins?',
    options: [
      { value: 1, label: 'My family. That\'s not negotiable.' },
      { value: 2, label: 'Usually mine, but I\'ll compromise on a few' },
      { value: 3, label: 'We alternate. Fair is fair.' },
      { value: 4, label: 'Whoever needs us more that year' },
      { value: 5, label: 'We make our own traditions. Both families adjust.' },
    ],
  },

  // ── Replaces m1_vp_07 (relationship_priority — career on fire) ──
  {
    id: 'm1_vp_07_v1', module: 1, quotient: 'VP', dimension: 'relationship_priority', format: 'scenario',
    replaces: 'm1_vp_07',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'You just landed your dream role and the hours are insane. Your partner says they miss you. What do you feel?',
    options: [
      { value: 1, label: 'Annoyed. This is the opportunity I\'ve been working for.' },
      { value: 2, label: 'Conflicted. I hear them, but this won\'t last forever.' },
      { value: 3, label: 'Guilty. I know I\'ve been checked out.' },
      { value: 4, label: 'Worried. I don\'t want to lose them over a job.' },
      { value: 5, label: 'Ready to recalibrate. No job is worth my person.' },
    ],
  },
]

// ════════════════════════════════════════════
// MODULE 2 VARIANTS: Attachment Style (AS)
// Base: 8 questions | Variants: 10
// ════════════════════════════════════════════

const MODULE_2_VARIANTS: QuestionVariant[] = [
  // ── Replaces m2_as_01 (anxiety — partner hasn't texted) ──
  {
    id: 'm2_as_01_v1', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    replaces: 'm2_as_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'They watched your Instagram story but haven\'t replied to your text from 4 hours ago. You...',
    options: [
      { value: 1, label: 'Didn\'t even notice. I\'m living my life.' },
      { value: 2, label: 'Noticed but it\'s probably nothing' },
      { value: 3, label: 'Send a meme to restart the conversation naturally' },
      { value: 4, label: 'Screenshot it and send it to my best friend for analysis' },
      { value: 5, label: 'Already composing the "so we\'re doing this?" text' },
    ],
  },
  {
    id: 'm2_as_01_v2', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    replaces: 'm2_as_01',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['universal'] },
    text: 'Your partner went out with friends and it\'s past midnight. No check-in text. You...',
    options: [
      { value: 1, label: 'Asleep. They\'re grown.' },
      { value: 2, label: 'Awake but trusting. They\'ll text when they\'re heading home.' },
      { value: 3, label: 'Send one text. Just checking in.' },
      { value: 4, label: 'Calling. This is unusual for them.' },
      { value: 5, label: 'Wide awake, running through every scenario.' },
    ],
  },

  // ── Replaces m2_as_02 (anxiety — going back to an ex) ──
  {
    id: 'm2_as_02_v1', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    replaces: 'm2_as_02',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your ex texts "I miss you" at 11 PM. Your current situationship is going well. What happens?',
    options: [
      { value: 1, label: 'Delete. Block. Move on.' },
      { value: 2, label: 'Read it, don\'t respond, tell my person about it' },
      { value: 3, label: 'Stare at it for 20 minutes then put the phone down' },
      { value: 4, label: 'Respond something casual. No harm in talking.' },
      { value: 5, label: 'Already wondering if I made the wrong choice.' },
    ],
  },

  // ── Replaces m2_as_04 (avoidance — combine finances) ──
  {
    id: 'm2_as_04_v1', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    replaces: 'm2_as_04',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Three months in and they want to give you a drawer at their place. Your gut says...',
    options: [
      { value: 5, label: 'Absolutely not. I need my own space.' },
      { value: 4, label: 'Slow down. A drawer is a statement.' },
      { value: 3, label: 'Maybe. It\'s practical if I\'m over there a lot.' },
      { value: 2, label: 'Sweet. I like where this is going.' },
      { value: 1, label: 'Finally. I was already leaving stuff there anyway.' },
    ],
  },
  {
    id: 'm2_as_04_v2', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    replaces: 'm2_as_04',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'Your partner wants to introduce you to their entire extended family -- abuela, tios, primos, everyone -- after 4 months. Your gut says...',
    options: [
      { value: 5, label: 'Way too soon. I\'m not ready for all that.' },
      { value: 4, label: 'I need more time. Meeting la familia is serious.' },
      { value: 3, label: 'I\'ll go but I\'m not promising I\'ll relax' },
      { value: 2, label: 'I\'m nervous but honored they want me there' },
      { value: 1, label: 'Let\'s go. Family is everything and I want in.' },
    ],
  },

  // ── Replaces m2_as_05 (avoidance — emotional intensity) ──
  {
    id: 'm2_as_05_v1', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    replaces: 'm2_as_05',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'They say "I love you" for the first time -- two months in. Your honest internal reaction?',
    options: [
      { value: 5, label: 'Panic. I need to leave this room immediately.' },
      { value: 4, label: 'Freeze up. I\'m not there yet and now it\'s awkward.' },
      { value: 3, label: 'Surprised but I don\'t freak out. I just need a minute.' },
      { value: 2, label: 'Touched. Even if I\'m not ready to say it back yet.' },
      { value: 1, label: 'Say it back. If I feel it, I say it.' },
    ],
  },
  {
    id: 'm2_as_05_v2', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    replaces: 'm2_as_05',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Your partner starts talking about "our future" -- house, maybe kids, the whole plan. You...',
    options: [
      { value: 5, label: 'Change the subject. I\'m not ready for that conversation.' },
      { value: 4, label: 'Listen but don\'t commit to any of it yet' },
      { value: 3, label: 'Engage but keep it hypothetical. "If we did, then maybe..."' },
      { value: 2, label: 'Get into it. I love talking about what we\'re building.' },
      { value: 1, label: 'Pull out my own list. I\'ve been thinking about this too.' },
    ],
  },

  // ── Replaces m2_as_07 (security — partner going through it) ──
  {
    id: 'm2_as_07_v1', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    replaces: 'm2_as_07',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Your partner just lost a parent. You\'re not great at grief. How do you show up?',
    options: [
      { value: 1, label: 'I give them space. Grief is personal.' },
      { value: 2, label: 'I check in but I don\'t crowd them' },
      { value: 3, label: 'I ask what they need each day and follow their lead' },
      { value: 4, label: 'I handle the logistics -- calls, food, arrangements -- so they can just feel' },
      { value: 5, label: 'I\'m not leaving their side. Period. Whatever they need, I\'m there.' },
    ],
  },

  // ── Replaces m2_as_08 (security — expressing needs) ──
  {
    id: 'm2_as_08_v1', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    replaces: 'm2_as_08',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'You need more quality time but your partner is an introvert who recharges alone. Can you say that without feeling guilty?',
    options: [
      { value: 1, label: 'No. I\'d just deal with it and feel resentful.' },
      { value: 2, label: 'I\'d hint at it but not say it directly' },
      { value: 3, label: 'I\'d try, but I\'d probably soften it too much' },
      { value: 4, label: 'Yes. My needs matter too, even if they\'re different.' },
      { value: 5, label: 'Absolutely. We can find a middle ground, but they need to know.' },
    ],
  },
  {
    id: 'm2_as_08_v2', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    replaces: 'm2_as_08',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'You were raised to be strong and not complain. Can you tell your partner when you actually need emotional support?',
    options: [
      { value: 1, label: 'No. I handle my own stuff. That\'s how I was raised.' },
      { value: 2, label: 'Rarely. Only if I\'m really at my limit.' },
      { value: 3, label: 'I\'m learning. It doesn\'t come naturally.' },
      { value: 4, label: 'Yes. I\'m breaking that pattern on purpose.' },
      { value: 5, label: 'Always. Vulnerability is strength. I know that now.' },
    ],
  },
]

// ════════════════════════════════════════════
// MODULE 3 VARIANTS: Communication & Conflict (CC)
// Base: 8 questions | Variants: 10
// ════════════════════════════════════════════

const MODULE_3_VARIANTS: QuestionVariant[] = [
  // ── Replaces m3_cc_01 (conflict_style — roasted in front of friends) ──
  {
    id: 'm3_cc_01_v1', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    replaces: 'm3_cc_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['black_culture'] },
    text: 'You\'re at the cookout and your partner tells a story that low-key embarrasses you in front of everybody. You...',
    options: [
      { value: 1, label: 'Laugh it off. It\'s the cookout, not court.' },
      { value: 2, label: 'Play it cool now, bring it up on the ride home' },
      { value: 3, label: 'Give them THE LOOK. They know what it means.' },
      { value: 4, label: 'Hit them with "oh we telling stories now?" and return fire' },
      { value: 5, label: 'Pull them aside right there. That was out of line.' },
    ],
  },
  {
    id: 'm3_cc_01_v2', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    replaces: 'm3_cc_01',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'At a family dinner, your partner makes a joke about something you told them in private. Your tia is cackling. You...',
    options: [
      { value: 1, label: 'Laugh along. Family dinners are chaotic anyway.' },
      { value: 2, label: 'Smile now, but we\'re having a conversation later' },
      { value: 3, label: 'Give them the "we need to talk" eyes across the table' },
      { value: 4, label: 'Redirect the conversation loudly. Damage control.' },
      { value: 5, label: 'Say something right there. Boundaries don\'t take a night off.' },
    ],
  },

  // ── Replaces m3_cc_03 (conflict_style — "we need to talk") ──
  {
    id: 'm3_cc_03_v1', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    replaces: 'm3_cc_03',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your partner sends "Can we talk tonight?" at 2 PM. You have 6 hours to spiral. What\'s happening internally?',
    options: [
      { value: 1, label: 'Nothing. They probably want to plan the weekend.' },
      { value: 2, label: 'Slight curiosity but I\'m not stressed' },
      { value: 3, label: 'I\'m reviewing every interaction from the last 48 hours' },
      { value: 4, label: 'Can\'t focus on work. Already writing my defense.' },
      { value: 5, label: 'Texting back "about what?" immediately. I cannot wait 6 hours.' },
    ],
  },

  // ── Replaces m3_cc_04 (repair_capacity — holding grudges) ──
  {
    id: 'm3_cc_04_v1', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    replaces: 'm3_cc_04',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Your partner forgot your birthday. Not the party -- the actual day. How long are you holding that?',
    options: [
      { value: 5, label: 'A day max. People forget things. It happens.' },
      { value: 4, label: 'A week. But if they make it up to me, we\'re good.' },
      { value: 3, label: 'A month. That one sits with me for a while.' },
      { value: 2, label: 'The rest of the year. And it\'s coming back up in every argument.' },
      { value: 1, label: 'Forever. I\'m bringing this up on our anniversary in 2035.' },
    ],
  },

  // ── Replaces m3_cc_05 (repair_capacity — who reaches out first) ──
  {
    id: 'm3_cc_05_v1', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    replaces: 'm3_cc_05',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'You and your partner had a bad fight over text. Now there\'s radio silence. Who breaks first?',
    options: [
      { value: 5, label: 'Me. I\'ll call. Text fights are the worst.' },
      { value: 4, label: 'Probably me. I\'ll send something to break the ice.' },
      { value: 3, label: 'Whoever is less heated. Could be either of us.' },
      { value: 2, label: 'Them. I said what I said.' },
      { value: 1, label: 'Them. And it better be an apology, not a "hey."' },
    ],
  },

  // ── Replaces m3_cc_07 (emotional_expression — bad day) ──
  {
    id: 'm3_cc_07_v1', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    replaces: 'm3_cc_07',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'You got passed over for a promotion you deserved. Your partner asks what\'s wrong. You say...',
    options: [
      { value: 1, label: '"Nothing." And go for a drive.' },
      { value: 2, label: '"Work stuff." And leave it at that.' },
      { value: 3, label: 'I tell them what happened but I don\'t dwell on it' },
      { value: 4, label: 'I vent. They need to understand what I\'m carrying.' },
      { value: 5, label: 'Everything. The anger, the hurt, the plan. They\'re getting all of it.' },
    ],
  },
  {
    id: 'm3_cc_07_v2', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    replaces: 'm3_cc_07',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'You got laid off today. Your partner can tell something is off. How much do you share?',
    options: [
      { value: 1, label: '"I\'m good." I\'ll figure this out on my own.' },
      { value: 2, label: '"Rough day." I\'ll share more when I\'m ready.' },
      { value: 3, label: 'The basics. I don\'t want them to worry too much.' },
      { value: 4, label: 'Most of it. I need someone in my corner right now.' },
      { value: 5, label: 'All of it. I\'m scared and I need them to know that.' },
    ],
  },

  // ── Replaces m3_cc_08 (emotional_expression — insecurity) ──
  {
    id: 'm3_cc_08_v1', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    replaces: 'm3_cc_08',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['universal'] },
    text: 'You notice your partner liking their ex\'s posts a lot. It\'s bugging you. Do you bring it up?',
    options: [
      { value: 1, label: 'No. I\'d look insecure and I refuse.' },
      { value: 2, label: 'Probably not. I\'d just watch and see if it escalates.' },
      { value: 3, label: 'Maybe. If I can bring it up without sounding crazy.' },
      { value: 4, label: 'Yes. It\'s bothering me and they should know.' },
      { value: 5, label: 'Absolutely. Honesty now prevents resentment later.' },
    ],
  },

  // ── Replaces m3_cc_06 (repair_capacity — apologizing) ──
  {
    id: 'm3_cc_06_v1', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    replaces: 'm3_cc_06',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['universal'] },
    text: 'You snapped at your partner and they\'re hurt. You think you were 30% wrong and they were 70% wrong. Can you apologize for your 30%?',
    options: [
      { value: 5, label: 'Yes. I own my part regardless of theirs.' },
      { value: 4, label: 'Yes, but I\'m also addressing the 70%.' },
      { value: 3, label: 'Depends on whether they acknowledge their part first.' },
      { value: 2, label: 'Probably not until they apologize for the bigger piece.' },
      { value: 1, label: 'No. 30% doesn\'t warrant an apology when they caused most of it.' },
    ],
  },

  // ── Replaces m3_cc_02 (conflict_style — saying hurtful things) ──
  {
    id: 'm3_cc_02_v1', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    replaces: 'm3_cc_02',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['universal'] },
    text: 'Your partner brings up something you\'re sensitive about during an argument. Now you\'re activated. What comes out?',
    options: [
      { value: 1, label: 'Nothing reckless. I stay focused on the actual issue.' },
      { value: 2, label: 'I might get sharp but I won\'t go below the belt' },
      { value: 3, label: 'It depends on how low they went first' },
      { value: 4, label: 'Something I\'ll probably regret in about 10 minutes' },
      { value: 5, label: 'The exact thing I know will hurt them most. Then I feel terrible.' },
    ],
  },
]

// ════════════════════════════════════════════
// MODULE 4 VARIANTS: How You Love (LL)
// Base: 6 questions | Variants: 8
// ════════════════════════════════════════════

const MODULE_4_VARIANTS: QuestionVariant[] = [
  // ── Replaces m4_ll_01 (receiving — make your whole week) ──
  {
    id: 'm4_ll_01_v1', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    replaces: 'm4_ll_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Which one would actually make you feel loved?',
    options: [
      { value: 1, label: 'They plan a whole date night: reservations, outfit picked out, the works' },
      { value: 2, label: 'They deep clean your apartment while you\'re at work without being asked' },
    ],
  },
  {
    id: 'm4_ll_01_v2', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    replaces: 'm4_ll_01',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['universal'] },
    text: 'After 10 years together, which one still hits?',
    options: [
      { value: 1, label: 'They surprise you with tickets to something you mentioned wanting to see months ago' },
      { value: 2, label: 'They take over the morning routine so you can sleep in, no questions asked' },
    ],
  },

  // ── Replaces m4_ll_02 (receiving — public vs private affirmation) ──
  {
    id: 'm4_ll_02_v1', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    replaces: 'm4_ll_02',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Which one means more to you?',
    options: [
      { value: 1, label: 'They hype you up in the group chat after your big win' },
      { value: 2, label: 'They send a long voice note at midnight saying why they\'re proud of you' },
    ],
  },

  // ── Replaces m4_ll_03 (receiving — worst week) ──
  {
    id: 'm4_ll_03_v1', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    replaces: 'm4_ll_03',
    demographics: { age_brackets: ['established'], cultural_contexts: ['black_culture'] },
    text: 'You\'re going through the worst of it. Which one do you need more?',
    options: [
      { value: 1, label: 'They sit with you in silence. Just their presence. No fixing, no talking.' },
      { value: 2, label: 'They call your mama, coordinate the family, and make sure you don\'t have to think about a single detail' },
    ],
  },

  // ── Replaces m4_ll_04 (giving — celebrating partner) ──
  {
    id: 'm4_ll_04_v1', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    replaces: 'm4_ll_04',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your partner just got the promotion. How do you celebrate them?',
    options: [
      { value: 1, label: 'Book a spontaneous trip. They deserve an experience.' },
      { value: 2, label: 'Get them something they\'ve had their eye on -- watch, bag, tech, whatever speaks to them' },
    ],
  },

  // ── Replaces m4_ll_05 (giving — random Tuesday) ──
  {
    id: 'm4_ll_05_v1', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    replaces: 'm4_ll_05',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['universal'] },
    text: 'It\'s a regular weeknight. How do you remind your partner you chose them?',
    options: [
      { value: 1, label: 'Put the phones away, open a bottle, and just talk about nothing and everything' },
      { value: 2, label: 'Come up behind them while they\'re cooking and just hold them for a second' },
    ],
  },

  // ── Replaces m4_ll_06 (giving — partner seems down) ──
  {
    id: 'm4_ll_06_v1', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    replaces: 'm4_ll_06',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['black_culture'] },
    text: 'Your partner had a rough day and you can see it in their face. What\'s your move?',
    options: [
      { value: 1, label: 'Words. "I see you. I\'m proud of you. You\'re not doing this alone."' },
      { value: 2, label: 'Action. Run the bath, order their comfort food, make the house feel like a sanctuary.' },
    ],
  },
  {
    id: 'm4_ll_06_v2', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    replaces: 'm4_ll_06',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'Your partner comes home drained. You can tell. First instinct?',
    options: [
      { value: 1, label: 'Sit them down, look them in the eye, and remind them who they are' },
      { value: 2, label: 'Start cooking their favorite meal. No questions. Just the smell of home.' },
    ],
  },
]

// ════════════════════════════════════════════
// MODULE 5 VARIANTS: Hot Takes & Dealbreakers (HT)
// Base: 8 questions | Variants: 12
// ════════════════════════════════════════════

const MODULE_5_VARIANTS: QuestionVariant[] = [
  // ── Replaces m5_ht_01 (boundaries — prenup) ──
  {
    id: 'm5_ht_01_v1', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    replaces: 'm5_ht_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Splitting rent 50/50 when one partner makes way more. Fair or nah?',
    options: [
      { value: 1, label: 'Absolutely fair. Equal contributions, equal say.' },
      { value: 2, label: 'Fair in theory, but it creates tension in practice' },
      { value: 3, label: 'Depends on the income gap. If it\'s huge, adjust.' },
      { value: 4, label: 'Proportional splitting makes more sense' },
      { value: 5, label: 'The higher earner should cover more. That\'s just common sense.' },
    ],
  },
  {
    id: 'm5_ht_01_v2', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    replaces: 'm5_ht_01',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Your partner wants to lend their sibling $5,000 from your joint savings. No discussion first. Problem?',
    options: [
      { value: 1, label: 'Huge problem. That\'s our money, not theirs to give.' },
      { value: 2, label: 'We need to talk about this, but family is family' },
      { value: 3, label: 'Depends on the situation. Is the sibling in real trouble?' },
      { value: 4, label: 'If they can cover it without hurting us, it\'s fine' },
      { value: 5, label: 'Family comes first. We\'ll figure out the money.' },
    ],
  },

  // ── Replaces m5_ht_02 (boundaries — partner talks to ex) ──
  {
    id: 'm5_ht_02_v1', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    replaces: 'm5_ht_02',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your partner\'s best friend is someone they used to hook up with. They swear it\'s platonic. You buying it?',
    options: [
      { value: 1, label: 'Absolutely not. That\'s a dealbreaker.' },
      { value: 2, label: 'I\'m suspicious. I need to see the dynamic before I decide.' },
      { value: 3, label: 'It depends on how long ago and how transparent they are.' },
      { value: 4, label: 'Probably. People can genuinely move past that.' },
      { value: 5, label: 'Yes. If I trust my partner, I trust their friendships.' },
    ],
  },

  // ── Replaces m5_ht_04 (gender_dynamics — man pays first date) ──
  {
    id: 'm5_ht_04_v1', module: 5, quotient: 'HT', dimension: 'gender_dynamics', format: 'scenario',
    replaces: 'm5_ht_04',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'They Venmo request you for half the dinner after the first date. Red flag, green flag, or irrelevant?',
    options: [
      { value: 1, label: 'Red flag. That\'s embarrassing.' },
      { value: 2, label: 'Weird energy, but I\'d pay and move on' },
      { value: 3, label: 'I mean, we both ate. It\'s fair.' },
      { value: 4, label: 'Green flag honestly. That\'s grown-up energy.' },
      { value: 5, label: 'Completely irrelevant. The vibe is all that matters.' },
    ],
  },
  {
    id: 'm5_ht_04_v2', module: 5, quotient: 'HT', dimension: 'gender_dynamics', format: 'scenario',
    replaces: 'm5_ht_04',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'In your family, the man is expected to provide. Your partner doesn\'t believe in traditional roles. How does that play out?',
    options: [
      { value: 1, label: 'My family\'s values are my values. I need that traditional structure.' },
      { value: 2, label: 'I lean traditional but I can flex if the partnership is right' },
      { value: 3, label: 'We\'d need to find our own balance, separate from both families' },
      { value: 4, label: 'Their perspective is valid. Roles should be about strengths, not gender.' },
      { value: 5, label: 'Doesn\'t matter. Whatever works for us is what matters.' },
    ],
  },

  // ── Replaces m5_ht_07 (vulnerability — Beyonce or Rihanna) ──
  {
    id: 'm5_ht_07_v1', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    replaces: 'm5_ht_07',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['general_pop'] },
    text: 'Taylor Swift or SZA? And yes, this reveals your soul.',
    options: [
      { value: 1, label: 'Taylor. She\'s a machine. Structure, storytelling, empire.' },
      { value: 2, label: 'Taylor, but SZA\'s vulnerability is next level' },
      { value: 3, label: 'Can\'t pick. Different frequencies for different moods.' },
      { value: 4, label: 'SZA, but Taylor\'s impact is undeniable' },
      { value: 5, label: 'SZA. Raw emotion, messy honesty, no performance. That\'s real.' },
    ],
  },
  {
    id: 'm5_ht_07_v2', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    replaces: 'm5_ht_07',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Mary J. Blige or Lauryn Hill? This is a values question.',
    options: [
      { value: 1, label: 'Mary. She survived everything and kept going. That\'s the blueprint.' },
      { value: 2, label: 'Mary, but Lauryn\'s Miseducation changed my life' },
      { value: 3, label: 'Both. They represent different sides of the same truth.' },
      { value: 4, label: 'Lauryn, but Mary\'s comeback is inspirational' },
      { value: 5, label: 'Lauryn. One album. Perfection. The mystery is part of the genius.' },
    ],
  },
  {
    id: 'm5_ht_07_v3', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    replaces: 'm5_ht_07',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['latino_culture'] },
    text: 'Bad Bunny or J Balvin? And this is about more than music.',
    options: [
      { value: 1, label: 'Bad Bunny. He broke every rule and won. That\'s power.' },
      { value: 2, label: 'Bad Bunny, but Balvin opened doors for everyone' },
      { value: 3, label: 'Different vibes. Both matter.' },
      { value: 4, label: 'Balvin, but Bad Bunny\'s range is crazy' },
      { value: 5, label: 'Balvin. Consistency, collaboration, positivity. That\'s my energy.' },
    ],
  },

  // ── Replaces m5_ht_05 (gender_dynamics — partner makes more money) ──
  {
    id: 'm5_ht_05_v1', module: 5, quotient: 'HT', dimension: 'gender_dynamics', format: 'scenario',
    replaces: 'm5_ht_05',
    demographics: { age_brackets: ['established'], cultural_contexts: ['black_culture'] },
    text: 'Your partner is the primary breadwinner and you\'re building something that hasn\'t taken off yet. Can you sit in that reality comfortably?',
    options: [
      { value: 1, label: 'No. It eats at me. I need to be contributing equally.' },
      { value: 2, label: 'It\'s uncomfortable but I\'m working toward something' },
      { value: 3, label: 'We\'d need to talk about it openly so there\'s no resentment' },
      { value: 4, label: 'Yes. Partnership isn\'t always 50/50 in dollars.' },
      { value: 5, label: 'Absolutely. We\'re a team. Seasons change.' },
    ],
  },

  // ── Replaces m5_ht_03 (boundaries — going through phone) ──
  {
    id: 'm5_ht_03_v1', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    replaces: 'm5_ht_03',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['universal'] },
    text: 'Your partner leaves their phone unlocked on the table. Screen facing up. DMs visible. You...',
    options: [
      { value: 1, label: 'Don\'t look. Their phone is their business. Always.' },
      { value: 2, label: 'Glance but don\'t scroll. I\'m human.' },
      { value: 3, label: 'Depends on whether something has been off lately' },
      { value: 4, label: 'Look. If there\'s nothing to hide, it shouldn\'t matter.' },
      { value: 5, label: 'Of course I look. Open phone, open book. That\'s trust.' },
    ],
  },

  // ── Replaces m5_ht_06 (vulnerability — kids conversation timing) ──
  {
    id: 'm5_ht_06_v1', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    replaces: 'm5_ht_06',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['universal'] },
    text: 'You\'re 40 and dating again. How soon do you bring up whether they want (more) kids?',
    options: [
      { value: 1, label: 'Before the first date. My time is valuable.' },
      { value: 2, label: 'First or second date. No point wasting time.' },
      { value: 3, label: 'Within the first month, naturally.' },
      { value: 4, label: 'When it feels right. Forcing it too early kills the vibe.' },
      { value: 5, label: 'Not rushing. I\'ve learned that plans change.' },
    ],
  },
]

// ════════════════════════════════════════════
// MODULE 6 VARIANTS: Emotional Intelligence (EI)
// Base: 10 questions | Variants: 10
// ════════════════════════════════════════════

const MODULE_6_VARIANTS: QuestionVariant[] = [
  // ── Replaces m6_ei_01 (self_awareness — friend says "I'm fine") ──
  {
    id: 'm6_ei_01_v1', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    replaces: 'm6_ei_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your friend posts "I\'m good" on their story but you know for a fact they just went through a breakup. You...',
    options: [
      { value: 1, label: 'Let them process. If they want to talk, they\'ll reach out.' },
      { value: 2, label: 'React to the story but don\'t push' },
      { value: 3, label: 'DM them: "Hey, checking in. You actually good?"' },
      { value: 4, label: 'Call them. A story isn\'t a conversation.' },
      { value: 5, label: 'Show up at their door with food. Words are cheap right now.' },
    ],
  },

  // ── Replaces m6_ei_03 (self_awareness — road rage) ──
  {
    id: 'm6_ei_03_v1', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    replaces: 'm6_ei_03',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['universal'] },
    text: 'Someone is rude to you at the grocery store. How long does it follow you home?',
    options: [
      { value: 5, label: 'It doesn\'t. I\'ve already forgotten.' },
      { value: 4, label: 'A few minutes. Quick flash of annoyance, done.' },
      { value: 3, label: 'I\'ll mention it when I get home, then let it go.' },
      { value: 2, label: 'It sours my mood for the rest of the errands.' },
      { value: 1, label: 'I\'m replaying what I should have said for the rest of the night.' },
    ],
  },

  // ── Replaces m6_ei_04 (empathy — partner shares vulnerability) ──
  {
    id: 'm6_ei_04_v1', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    replaces: 'm6_ei_04',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['black_culture'] },
    text: 'Your partner opens up about growing up without a father. You had both parents. What do you do with that?',
    options: [
      { value: 1, label: 'Offer perspective. "At least you had your mom. She did amazing."' },
      { value: 2, label: 'Listen. I don\'t know what to say because I can\'t relate.' },
      { value: 3, label: 'Ask questions. I want to understand what that shaped in them.' },
      { value: 4, label: 'Don\'t try to fix or relate. Just hold the space and honor what they shared.' },
      { value: 5, label: 'Thank them for trusting me with that. And remember it mattered.' },
    ],
  },

  // ── Replaces m6_ei_06 (empathy — coworker you don't like) ──
  {
    id: 'm6_ei_06_v1', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    replaces: 'm6_ei_06',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Someone in your friend group who lowkey annoys you just got dumped publicly. Honestly, what do you feel?',
    options: [
      { value: 1, label: 'Not my problem. We\'re not that close.' },
      { value: 2, label: 'I notice but I\'m not going out of my way' },
      { value: 3, label: 'I might send a brief text but I\'m not investing emotionally' },
      { value: 4, label: 'I feel bad for them regardless of our dynamic' },
      { value: 5, label: 'I reach out. Getting humiliated is getting humiliated, no matter who you are.' },
    ],
  },

  // ── Replaces m6_ei_07 (emotional_regulation — bringing things up) ──
  {
    id: 'm6_ei_07_v1', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    replaces: 'm6_ei_07',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Your partner said something that hurt you at dinner with friends. It\'s now 11 PM. When do you bring it up?',
    options: [
      { value: 1, label: 'I probably won\'t. I\'ll just file it away.' },
      { value: 2, label: 'In a few days, when the sting fades.' },
      { value: 3, label: 'Tomorrow morning, after I\'ve slept on it.' },
      { value: 4, label: 'Before bed. I don\'t carry things overnight.' },
      { value: 5, label: 'Right now. But calmly. "Hey, that thing you said earlier..."' },
    ],
  },

  // ── Replaces m6_ei_08 (emotional_regulation — old wound triggered) ──
  {
    id: 'm6_ei_08_v1', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    replaces: 'm6_ei_08',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your partner jokingly compares you to your ex. It hits a nerve you didn\'t know was still there. What happens?',
    options: [
      { value: 1, label: 'I snap. That was out of line and they\'re hearing about it now.' },
      { value: 2, label: 'I get visibly upset and shut down for a while' },
      { value: 3, label: 'I feel the sting but can hold it together in the moment' },
      { value: 4, label: 'I say "that actually bothered me" and explain why' },
      { value: 5, label: 'I recognize it\'s my trigger, not their intent, and communicate that calmly.' },
    ],
  },

  // ── Replaces m6_ei_09 (emotional_regulation — bad day spillover) ──
  {
    id: 'm6_ei_09_v1', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    replaces: 'm6_ei_09',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'You got into it with your madre. You come home and your partner asks an innocent question. How clean is your response?',
    options: [
      { value: 1, label: 'They\'re catching the overflow. I can\'t help it.' },
      { value: 2, label: 'I\'m short. Probably snappy. I\'ll feel bad later.' },
      { value: 3, label: 'Hit or miss. Family stress hits different.' },
      { value: 4, label: 'I tell them I need a minute and separate the situations.' },
      { value: 5, label: 'I say "I had a rough one with my mom. I\'m not in a great headspace." Clean.' },
    ],
  },

  // ── Replaces m6_ei_02 (self_awareness — crying) ──
  {
    id: 'm6_ei_02_v1', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    replaces: 'm6_ei_02',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Real talk: were you raised to believe crying was weakness? And have you unlearned that?',
    options: [
      { value: 1, label: 'Yes, and honestly I still believe it a little.' },
      { value: 2, label: 'Yes, and I\'m still unlearning. It\'s a process.' },
      { value: 3, label: 'Somewhat. I cry when it\'s serious but it still feels uncomfortable.' },
      { value: 4, label: 'I was, but I\'ve done the work. I let myself feel now.' },
      { value: 5, label: 'That message never stuck. I\'ve always felt my feelings fully.' },
    ],
  },

  // ── Replaces m6_ei_05 (empathy — reading partner's mood) ──
  {
    id: 'm6_ei_05_v1', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    replaces: 'm6_ei_05',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['universal'] },
    text: 'Your partner says "I\'m not mad" but everything about their energy says otherwise. You...',
    options: [
      { value: 1, label: 'Take them at their word. If they said they\'re not mad, okay.' },
      { value: 2, label: 'Notice the disconnect but wait for them to bring it up' },
      { value: 3, label: 'Ask once more: "Are you sure?" and then drop it.' },
      { value: 4, label: 'Gently name what I\'m picking up: "Your energy feels different right now."' },
      { value: 5, label: 'I already know what\'s wrong. I can feel it. I address the real thing.' },
    ],
  },

  // ── Replaces m6_ei_10 (emotional_regulation — jealousy) ──
  {
    id: 'm6_ei_10_v1', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    replaces: 'm6_ei_10',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your partner\'s coworker is clearly flirting with them at a work event. You\'re right there. What do you do with that feeling?',
    options: [
      { value: 1, label: 'Make my presence known. Immediately. Arm around my partner.' },
      { value: 2, label: 'I\'m watching. If it continues, I\'m saying something.' },
      { value: 3, label: 'I feel the jealousy but I trust my partner to handle it.' },
      { value: 4, label: 'Note the feeling, don\'t act on it, bring it up later at home.' },
      { value: 5, label: 'Interesting. I feel it, examine why, and trust the foundation we\'ve built.' },
    ],
  },
]

// ════════════════════════════════════════════
// MODULE 7 VARIANTS: Lifestyle & Ambition (LA)
// Base: 10 questions | Variants: 10
// ════════════════════════════════════════════

const MODULE_7_VARIANTS: QuestionVariant[] = [
  // ── Replaces m7_la_01 (pace_of_life — Saturday morning) ──
  {
    id: 'm7_la_01_v1', module: 7, quotient: 'LA', dimension: 'pace_of_life', format: 'scenario',
    replaces: 'm7_la_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Sunday after a long week. Your phone is blowing up with brunch invites. You...',
    options: [
      { value: 1, label: 'Already getting ready. Social battery is full.' },
      { value: 2, label: 'Pick one and make an appearance' },
      { value: 3, label: 'Respond "maybe" to all of them and decide last minute' },
      { value: 4, label: 'Decline politely. I need this day for myself.' },
      { value: 5, label: 'Phone on do not disturb. I don\'t even see the texts until Monday.' },
    ],
  },

  // ── Replaces m7_la_02 (pace_of_life — work hours) ──
  {
    id: 'm7_la_02_v1', module: 7, quotient: 'LA', dimension: 'pace_of_life', format: 'scenario',
    replaces: 'm7_la_02',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Your partner works a 9-to-5 and clocks out mentally the second they close their laptop. You\'re building something on the side. Does that gap bother you?',
    options: [
      { value: 1, label: 'Yes. I need someone who matches my hunger.' },
      { value: 2, label: 'A little. I wish they had more drive.' },
      { value: 3, label: 'Not really, as long as they support what I\'m doing.' },
      { value: 4, label: 'No. Different rhythms can coexist.' },
      { value: 5, label: 'Not at all. Their stability balances my chaos.' },
    ],
  },

  // ── Replaces m7_la_04 (social_energy — Friday night) ──
  {
    id: 'm7_la_04_v1', module: 7, quotient: 'LA', dimension: 'social_energy', format: 'scenario',
    replaces: 'm7_la_04',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['black_culture'] },
    text: 'Your partner\'s friends are having a game night. You love your couch. Compromise or stand your ground?',
    options: [
      { value: 1, label: 'Couch. Send my love. I\'m not performing social energy tonight.' },
      { value: 2, label: 'Probably the couch, but I\'ll go if it really matters to them' },
      { value: 3, label: 'We take turns. This week theirs, next week mine.' },
      { value: 4, label: 'Game night sounds fun actually. I like their friends.' },
      { value: 5, label: 'Let\'s go! I light up around people.' },
    ],
  },

  // ── Replaces m7_la_05 (social_energy — vacation style) ──
  {
    id: 'm7_la_05_v1', module: 7, quotient: 'LA', dimension: 'social_energy', format: 'scenario',
    replaces: 'm7_la_05',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['general_pop'] },
    text: 'Dream trip: Tulum with a group of friends or solo trip to Japan?',
    options: [
      { value: 1, label: 'Tulum with the crew. The more the merrier.' },
      { value: 2, label: 'Tulum, but with a few quiet mornings to myself' },
      { value: 3, label: 'Either sounds incredible, honestly' },
      { value: 4, label: 'Japan solo. Discovery is personal.' },
      { value: 5, label: 'Solo Japan, no question. I want to get lost in my own experience.' },
    ],
  },
  {
    id: 'm7_la_05_v2', module: 7, quotient: 'LA', dimension: 'social_energy', format: 'scenario',
    replaces: 'm7_la_05',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['latino_culture'] },
    text: 'Family cruise with 30 relatives or a quiet cabin in the mountains with just your partner?',
    options: [
      { value: 1, label: 'The cruise! Family vacations are everything.' },
      { value: 2, label: 'Cruise, but I\'m sneaking away for quiet time daily' },
      { value: 3, label: 'Both sound good in different seasons' },
      { value: 4, label: 'Cabin. I need peace to actually recharge.' },
      { value: 5, label: 'Cabin. Every time. No noise, no drama, just us.' },
    ],
  },

  // ── Replaces m7_la_07 (future_vision — five-year plan) ──
  {
    id: 'm7_la_07_v1', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    replaces: 'm7_la_07',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Vision board or vibes? How do you approach your future?',
    options: [
      { value: 5, label: 'Vision board. With timelines. Laminated.' },
      { value: 4, label: 'Goals app, journal, and a loose timeline' },
      { value: 3, label: 'I know what I want but I\'m open to the path changing' },
      { value: 2, label: 'Vibes. The universe and I have an understanding.' },
      { value: 1, label: 'Plans stress me out. I follow energy and opportunity.' },
    ],
  },

  // ── Replaces m7_la_08 (future_vision — partner content in career) ──
  {
    id: 'm7_la_08_v1', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    replaces: 'm7_la_08',
    demographics: { age_brackets: ['established'], cultural_contexts: ['black_culture'] },
    text: 'Your partner chose purpose over pay. They work at a nonprofit and love it. You\'re climbing the corporate ladder. Can that work?',
    options: [
      { value: 1, label: 'Probably not. We\'d have very different lifestyles.' },
      { value: 2, label: 'It\'d be a conversation. I need financial partnership.' },
      { value: 3, label: 'If they\'re happy and contributing, we can make it work.' },
      { value: 4, label: 'Yes. Purpose-driven people are attractive.' },
      { value: 5, label: 'Absolutely. Money isn\'t the only measure of ambition.' },
    ],
  },

  // ── Replaces m7_la_09 (future_vision — dream retirement) ──
  {
    id: 'm7_la_09_v1', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    replaces: 'm7_la_09',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'Retire at 45 with less money or retire at 65 with way more? What\'s the move?',
    options: [
      { value: 1, label: '65 with the bag. I want security and legacy.' },
      { value: 2, label: 'Closer to 65. I want to build something substantial.' },
      { value: 3, label: 'Somewhere in between. Retire, then do what I love for fun.' },
      { value: 4, label: '45. Time is worth more than money.' },
      { value: 5, label: '45, easily. I\'d rather have freedom than a number in an account.' },
    ],
  },

  // ── Replaces m7_la_10 (future_vision — partner's side hustle) ──
  {
    id: 'm7_la_10_v1', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    replaces: 'm7_la_10',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['universal'] },
    text: 'Your partner wants to quit their stable job to start a business. You have a mortgage together. How do you feel?',
    options: [
      { value: 5, label: 'Excited. I believe in them and we can make it work.' },
      { value: 4, label: 'Supportive, but we need a financial plan first.' },
      { value: 3, label: 'Nervous. I need to see the numbers before I\'m on board.' },
      { value: 2, label: 'Uncomfortable. That\'s a huge risk with shared obligations.' },
      { value: 1, label: 'No. Our stability isn\'t something to gamble with.' },
    ],
  },

  // ── Replaces m7_la_03 (pace_of_life — show vs side project) ──
  {
    id: 'm7_la_03_v1', module: 7, quotient: 'LA', dimension: 'pace_of_life', format: 'scenario',
    replaces: 'm7_la_03',
    demographics: { age_brackets: ['established'], cultural_contexts: ['universal'] },
    text: 'Your partner wants a phone-free dinner every night. You\'re used to catching up on Slack while you eat. Can you commit?',
    options: [
      { value: 1, label: 'No. My work doesn\'t pause for dinner.' },
      { value: 2, label: 'I\'d try but I\'d be checking under the table' },
      { value: 3, label: 'Some nights yes, some nights I\'d need to be flexible' },
      { value: 4, label: 'Yes. I want to be more present and this would help.' },
      { value: 5, label: 'Absolutely. If I can\'t put the phone down for 30 minutes, that\'s a me problem.' },
    ],
  },
]

// ════════════════════════════════════════════
// MODULE 8 VARIANTS: Intimacy & Chemistry (IC)
// Base: 10 questions | Variants: 10
// ════════════════════════════════════════════

const MODULE_8_VARIANTS: QuestionVariant[] = [
  // ── Replaces m8_ic_01 (physical_chemistry — touch vs eye contact) ──
  {
    id: 'm8_ic_01_v1', module: 8, quotient: 'IC', dimension: 'physical_chemistry', format: 'scenario',
    replaces: 'm8_ic_01',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['universal'] },
    text: 'What builds more tension: a hand on your lower back in public or lingering eye contact across a crowded room?',
    options: [
      { value: 1, label: 'The hand. Physical contact is electric.' },
      { value: 2, label: 'The hand, but that eye contact moment is something else' },
      { value: 3, label: 'Both. Completely depends on who it is.' },
      { value: 4, label: 'The eye contact. That unspoken thing is everything.' },
      { value: 5, label: 'Eye contact. When someone locks in on you across a room? Game over.' },
    ],
  },

  // ── Replaces m8_ic_02 (physical_chemistry — chemistry on first date) ──
  {
    id: 'm8_ic_02_v1', module: 8, quotient: 'IC', dimension: 'physical_chemistry', format: 'scenario',
    replaces: 'm8_ic_02',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['universal'] },
    text: 'At this point in your life, how quickly can you tell if the physical chemistry is there?',
    options: [
      { value: 5, label: 'Immediately. Within seconds of meeting. I trust my instincts.' },
      { value: 4, label: 'First date. One conversation and I know.' },
      { value: 3, label: 'A few dates. It can take time to feel it.' },
      { value: 2, label: 'Months. Real chemistry builds with emotional safety.' },
      { value: 1, label: 'I\'ve learned chemistry can grow from nothing. I stay open.' },
    ],
  },

  // ── Replaces m8_ic_03 (physical_chemistry — soundtrack) ──
  {
    id: 'm8_ic_03_v1', module: 8, quotient: 'IC', dimension: 'physical_chemistry', format: 'scenario',
    replaces: 'm8_ic_03',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['general_pop'] },
    text: 'Setting the mood: candles and a playlist or spontaneous, no setup needed?',
    options: [
      { value: 1, label: 'Full production. Candles, playlist, vibe curated. Atmosphere matters.' },
      { value: 2, label: 'Some effort goes a long way. At least dim the lights.' },
      { value: 3, label: 'Both. Planned is beautiful, but spontaneous hits different.' },
      { value: 4, label: 'Spontaneous. The best moments aren\'t choreographed.' },
      { value: 5, label: 'Zero setup. If the energy is there, nothing else matters.' },
    ],
  },

  // ── Replaces m8_ic_04 (emotional_intimacy — worst vs deepest fear) ──
  {
    id: 'm8_ic_04_v1', module: 8, quotient: 'IC', dimension: 'emotional_intimacy', format: 'scenario',
    replaces: 'm8_ic_04',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['universal'] },
    text: 'What\'s scarier to share with a partner: your biggest failure or your biggest insecurity?',
    options: [
      { value: 1, label: 'My failure. That\'s evidence of where I fell short.' },
      { value: 2, label: 'Failure, slightly. At least insecurities feel more universal.' },
      { value: 3, label: 'Both terrifying. Both require deep trust.' },
      { value: 4, label: 'My insecurity. Failures are the past. Insecurities are right now.' },
      { value: 5, label: 'My insecurity. Letting someone see the thing you can\'t fix -- that\'s real vulnerability.' },
    ],
  },

  // ── Replaces m8_ic_05 (emotional_intimacy — letting someone see all of you) ──
  {
    id: 'm8_ic_05_v1', module: 8, quotient: 'IC', dimension: 'emotional_intimacy', format: 'scenario',
    replaces: 'm8_ic_05',
    demographics: { age_brackets: ['young_professional'], cultural_contexts: ['black_culture'] },
    text: 'How many people in your life have seen the real you -- no mask, no performance, no code-switching?',
    options: [
      { value: 1, label: 'A lot. What you see is what you get.' },
      { value: 2, label: 'My inner circle. Maybe 5-6 people.' },
      { value: 3, label: 'A few. It takes time to trust like that.' },
      { value: 4, label: 'One or two. And it took years.' },
      { value: 5, label: 'Honestly? I\'m not sure anyone has seen everything.' },
    ],
  },

  // ── Replaces m8_ic_06 (emotional_intimacy — pillow talk vs dinner) ──
  {
    id: 'm8_ic_06_v1', module: 8, quotient: 'IC', dimension: 'emotional_intimacy', format: 'scenario',
    replaces: 'm8_ic_06',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['universal'] },
    text: 'Where do the deepest conversations happen: in the car, late at night in bed, or over a long meal?',
    options: [
      { value: 1, label: 'Late at night. Something about the dark makes truth easier.' },
      { value: 2, label: 'Night time, but car talks hit different too' },
      { value: 3, label: 'All three. Depth isn\'t about location, it\'s about safety.' },
      { value: 4, label: 'Over a meal. Eye contact, intention, presence.' },
      { value: 5, label: 'Long meal. I want us both fully present, not half-asleep.' },
    ],
  },

  // ── Replaces m8_ic_07 (desire_dynamics — keeping the spark) ──
  {
    id: 'm8_ic_07_v1', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    replaces: 'm8_ic_07',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['universal'] },
    text: 'You\'ve been together 10+ years. The passion ebbs and flows. That\'s...',
    options: [
      { value: 1, label: 'Natural and fine. Real love is deeper than passion.' },
      { value: 2, label: 'Normal, but we should still put in effort when it dips' },
      { value: 3, label: 'Expected, and it takes real intention to bring it back' },
      { value: 4, label: 'A signal. If it\'s fading, something needs to change.' },
      { value: 5, label: 'Unacceptable. If we stop pursuing each other, what\'s the point?' },
    ],
  },

  // ── Replaces m8_ic_08 (desire_dynamics — communication about needs) ──
  {
    id: 'm8_ic_08_v1', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    replaces: 'm8_ic_08',
    demographics: { age_brackets: ['young_professional', 'established'], cultural_contexts: ['universal'] },
    text: 'Have you ever faked satisfaction to avoid an awkward conversation? Be honest.',
    options: [
      { value: 1, label: 'Yes. And I\'d rather keep the peace than explain.' },
      { value: 2, label: 'Yes, but I\'ve learned that helps no one' },
      { value: 3, label: 'Sometimes. Depends on how comfortable I am with the person.' },
      { value: 4, label: 'Rarely. I believe honesty makes everything better.' },
      { value: 5, label: 'Never. I refuse to perform. We either communicate or we lose.' },
    ],
  },

  // ── Replaces m8_ic_09 (desire_dynamics — trying something new) ──
  {
    id: 'm8_ic_09_v1', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    replaces: 'm8_ic_09',
    demographics: { age_brackets: ['established', 'seasoned'], cultural_contexts: ['universal'] },
    text: 'Your partner sends you an article about "keeping things exciting" with a "thoughts?" text. Your reaction?',
    options: [
      { value: 1, label: 'Uncomfortable. What\'s wrong with what we have?' },
      { value: 2, label: 'A little defensive at first, but I\'d read it' },
      { value: 3, label: 'Curious. I\'d want to talk about what specifically caught their eye.' },
      { value: 4, label: 'Appreciated. It means they\'re invested in us.' },
      { value: 5, label: 'Turned on, honestly. Proactive partners are the most attractive kind.' },
    ],
  },

  // ── Replaces m8_ic_10 (desire_dynamics — importance of physical intimacy) ──
  {
    id: 'm8_ic_10_v1', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    replaces: 'm8_ic_10',
    demographics: { age_brackets: ['seasoned'], cultural_contexts: ['universal'] },
    text: 'You love your partner deeply but the physical side of things has gone quiet for months. What do you do?',
    options: [
      { value: 1, label: 'Accept it. Connection exists on many levels.' },
      { value: 2, label: 'Wait it out. These things are cyclical.' },
      { value: 3, label: 'Bring it up gently. It matters enough to discuss.' },
      { value: 4, label: 'Have a direct conversation. This is a priority, not a bonus.' },
      { value: 5, label: 'Sound the alarm. If we\'re not addressing this, we\'re in trouble.' },
    ],
  },
]

// ════════════════════════════════════════════
// Export
// ════════════════════════════════════════════

export const ALL_VARIANTS: QuestionVariant[] = [
  ...MODULE_1_VARIANTS,
  ...MODULE_2_VARIANTS,
  ...MODULE_3_VARIANTS,
  ...MODULE_4_VARIANTS,
  ...MODULE_5_VARIANTS,
  ...MODULE_6_VARIANTS,
  ...MODULE_7_VARIANTS,
  ...MODULE_8_VARIANTS,
]

export function getVariantsForModule(moduleNum: number): QuestionVariant[] {
  return ALL_VARIANTS.filter((v) => v.module === moduleNum)
}

export function getVariantsForQuestion(baseQuestionId: string): QuestionVariant[] {
  return ALL_VARIANTS.filter((v) => v.replaces === baseQuestionId)
}

export {
  MODULE_1_VARIANTS,
  MODULE_2_VARIANTS,
  MODULE_3_VARIANTS,
  MODULE_4_VARIANTS,
  MODULE_5_VARIANTS,
  MODULE_6_VARIANTS,
  MODULE_7_VARIANTS,
  MODULE_8_VARIANTS,
}

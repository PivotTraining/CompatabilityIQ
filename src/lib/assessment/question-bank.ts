import type { AssessmentQuestion } from './types'

// ════════════════════════════════════════════
// MODULE 1: Values & Priorities (VP) — 8 questions
// FREE — Hot takes and scenarios that reveal life priorities
// Sub-scales: life_direction, moral_flexibility, relationship_priority
// ════════════════════════════════════════════
const MODULE_1: AssessmentQuestion[] = [
  // ── life_direction ──
  { id: 'm1_vp_01', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    text: 'Your partner gets a dream job offer across the country. You just got promoted. What happens?',
    options: [
      { value: 1, label: 'I stay. They can figure it out.' },
      { value: 2, label: 'We try long-distance and see what happens' },
      { value: 3, label: 'We sit down and weigh both careers seriously' },
      { value: 4, label: 'I\'d consider moving if their opportunity is bigger' },
      { value: 5, label: 'Wherever we go, we go together. Period.' },
    ] },
  { id: 'm1_vp_02', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    text: 'You just inherited $500K. No strings attached. What\'s your first move?',
    options: [
      { value: 1, label: 'Invest every penny. Let it grow.' },
      { value: 2, label: 'Pay off debt first, invest the rest' },
      { value: 3, label: 'Split it: invest some, experience some' },
      { value: 4, label: 'Take a year off and travel the world' },
      { value: 5, label: 'Take care of my family first, then figure out the rest' },
    ] },
  { id: 'm1_vp_03', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    text: 'Curb Your Enthusiasm or Martin?',
    options: [
      { value: 1, label: 'Curb, every time. The awkwardness is art.' },
      { value: 2, label: 'Curb, but I respect Martin' },
      { value: 3, label: 'Honestly depends on my mood' },
      { value: 4, label: 'Martin, but I get the Curb appeal' },
      { value: 5, label: 'Martin. Not even close.' },
    ] },

  // ── moral_flexibility ──
  { id: 'm1_vp_04', module: 1, quotient: 'VP', dimension: 'moral_flexibility', format: 'scenario',
    text: 'Should Barry Bonds be in the Hall of Fame even though he used steroids at the end of his career?',
    options: [
      { value: 1, label: 'Absolutely not. Rules are rules.' },
      { value: 2, label: 'Probably not, but the whole era was dirty' },
      { value: 3, label: 'Tough call. I genuinely can\'t decide.' },
      { value: 4, label: 'Yes, but with an asterisk' },
      { value: 5, label: 'Put him in. He was already the greatest before the juice.' },
    ] },
  { id: 'm1_vp_05', module: 1, quotient: 'VP', dimension: 'moral_flexibility', format: 'scenario',
    text: 'Your best friend tells you they cheated on their partner. They\'re crying. What do you do?',
    options: [
      { value: 1, label: 'Tell them they need to confess. Full stop.' },
      { value: 2, label: 'Comfort them, but tell them they have to make it right' },
      { value: 3, label: 'Listen without judgment first, advise later' },
      { value: 4, label: 'That\'s their business. I\'m just here for support.' },
      { value: 5, label: 'We all make mistakes. I\'m not here to judge.' },
    ] },
  { id: 'm1_vp_06', module: 1, quotient: 'VP', dimension: 'moral_flexibility', format: 'scenario',
    text: 'How someone treats a waiter tells you everything you need to know about them.',
    options: [
      { value: 5, label: 'Facts. Non-negotiable.' },
      { value: 4, label: 'Mostly true. It says a lot.' },
      { value: 3, label: 'It matters, but people have bad days' },
      { value: 2, label: 'I notice it but I don\'t read that deep into it' },
      { value: 1, label: 'That\'s a lot to put on one interaction' },
    ] },

  // ── relationship_priority ──
  { id: 'm1_vp_07', module: 1, quotient: 'VP', dimension: 'relationship_priority', format: 'scenario',
    text: 'Your career is on fire right now. Your partner says they feel neglected. Honestly, what do you feel first?',
    options: [
      { value: 1, label: 'Frustrated. They should understand this is temporary.' },
      { value: 2, label: 'Torn. I hear them, but I can\'t slow down right now.' },
      { value: 3, label: 'Guilty. I need to find a better balance.' },
      { value: 4, label: 'Concerned. If they feel it, it\'s real, and I need to adjust.' },
      { value: 5, label: 'Alarmed. Nothing matters if I\'m losing my person.' },
    ] },
  { id: 'm1_vp_08', module: 1, quotient: 'VP', dimension: 'relationship_priority', format: 'scenario',
    text: 'Real talk: a great relationship is something you fit into a great life, or something you build your life around?',
    options: [
      { value: 1, label: 'Fit into a great life. The relationship enhances, not defines.' },
      { value: 2, label: 'Mostly fit in, but make real space for it' },
      { value: 3, label: 'Somewhere in the middle. It depends on the season.' },
      { value: 4, label: 'Build around. Your person should be your foundation.' },
      { value: 5, label: 'Build around, 100%. What\'s the point of a great life alone?' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 2: Attachment Style (AS) — 8 questions
// FREE — Relationship behavior scenarios
// Sub-scales: anxiety, avoidance, security
// ════════════════════════════════════════════
const MODULE_2: AssessmentQuestion[] = [
  // ── anxiety ──
  { id: 'm2_as_01', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    text: 'Your partner hasn\'t texted back in 6 hours. You...',
    options: [
      { value: 1, label: 'Barely notice. They\'ll text when they text.' },
      { value: 2, label: 'Notice but assume they\'re busy' },
      { value: 3, label: 'Send a casual check-in. No big deal.' },
      { value: 4, label: 'Start replaying your last conversation for clues' },
      { value: 5, label: 'Already wrote the breakup speech in your head' },
    ] },
  { id: 'm2_as_02', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    text: 'How many times have you gone back to an ex? Be honest.',
    options: [
      { value: 1, label: 'Never. When it\'s done, it\'s done.' },
      { value: 2, label: 'Once. Learned my lesson.' },
      { value: 3, label: 'Twice. Don\'t judge me.' },
      { value: 4, label: 'More than twice. I have a type.' },
      { value: 5, label: 'I\'ve lost count. We always find our way back.' },
    ] },
  { id: 'm2_as_03', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    text: 'After an argument, you can\'t sleep until things are resolved. Even if it\'s 2 AM.',
    options: [
      { value: 1, label: 'Nah. I sleep fine. We\'ll talk tomorrow.' },
      { value: 2, label: 'I might toss and turn but I\'ll wait til morning' },
      { value: 3, label: 'Depends on how bad the argument was' },
      { value: 4, label: 'I\'ll probably bring it up. Sleep can wait.' },
      { value: 5, label: 'I physically cannot rest until we fix it. Every time.' },
    ] },

  // ── avoidance ──
  { id: 'm2_as_04', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    text: 'Your partner wants to combine finances after 6 months. Your gut says...',
    options: [
      { value: 5, label: 'Absolutely not. Way too soon.' },
      { value: 4, label: 'Slow down. I need to trust this more first.' },
      { value: 3, label: 'Maybe a joint account for shared bills, but not everything' },
      { value: 2, label: 'I\'m open to it if we\'re serious' },
      { value: 1, label: 'If I trust you enough to date you, I trust you with money' },
    ] },
  { id: 'm2_as_05', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    text: 'When things get emotionally intense in a relationship, your instinct is to...',
    options: [
      { value: 5, label: 'Take space immediately. I need to think alone.' },
      { value: 4, label: 'Pull back a little until I feel ready to talk' },
      { value: 3, label: 'Stay present but I\'m not going to match that energy' },
      { value: 2, label: 'Lean in. I want to work through it together.' },
      { value: 1, label: 'Get closer. Intensity doesn\'t scare me.' },
    ] },
  { id: 'm2_as_06', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    text: 'An ex once described you as "hard to read." Your honest reaction?',
    options: [
      { value: 5, label: 'They were right. I keep my cards close.' },
      { value: 4, label: 'I get it. I don\'t open up fast.' },
      { value: 3, label: 'Maybe. I share when I\'m comfortable.' },
      { value: 2, label: 'That\'s surprising. I thought I was pretty open.' },
      { value: 1, label: 'No way. I wear my heart on my sleeve.' },
    ] },

  // ── security ──
  { id: 'm2_as_07', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    text: 'Your partner is going through it. Like, really going through it. You...',
    options: [
      { value: 1, label: 'Give them space. I don\'t want to crowd them.' },
      { value: 2, label: 'Check in but keep a little distance' },
      { value: 3, label: 'Ask what they need and try to follow their lead' },
      { value: 4, label: 'Show up. Cook, listen, hold them. Whatever it takes.' },
      { value: 5, label: 'Cancel my plans. They\'re my priority right now.' },
    ] },
  { id: 'm2_as_08', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    text: 'Can you tell your partner what you actually need without worrying they\'ll think you\'re "too much"?',
    options: [
      { value: 1, label: 'No. I\'ve learned to keep my needs small.' },
      { value: 2, label: 'Sometimes. Depends on the need.' },
      { value: 3, label: 'I\'m working on it. It doesn\'t come naturally.' },
      { value: 4, label: 'Mostly yes. I\'ve gotten better at this.' },
      { value: 5, label: 'Always. If they can\'t handle my needs, they\'re not my person.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 3: Communication & Conflict (CC) — 8 questions
// FREE — How you handle disagreements
// Sub-scales: conflict_style, repair_capacity, emotional_expression
// ════════════════════════════════════════════
const MODULE_3: AssessmentQuestion[] = [
  // ── conflict_style ──
  { id: 'm3_cc_01', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    text: 'Your partner roasts you a little too hard in front of friends. You...',
    options: [
      { value: 1, label: 'Laugh it off. It\'s not that deep.' },
      { value: 2, label: 'Let it slide now, bring it up later in private' },
      { value: 3, label: 'Give them a look that says "we\'ll talk about this later"' },
      { value: 4, label: 'Roast them back harder. Game on.' },
      { value: 5, label: 'Address it right there. That was disrespectful.' },
    ] },
  { id: 'm3_cc_02', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    text: 'During a heated argument, I have a hard time stopping myself from saying things I know will hurt.',
    options: [
      { value: 1, label: 'Never. I always choose my words carefully.' },
      { value: 2, label: 'Rarely. I can usually pump the brakes.' },
      { value: 3, label: 'Sometimes. Depends on how hurt I am.' },
      { value: 4, label: 'More often than I\'d like to admit.' },
      { value: 5, label: 'When I\'m hurt, the filter comes off. I own that.' },
    ] },
  { id: 'm3_cc_03', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    text: 'Your partner says "we need to talk." Your heart rate goes from 0 to...',
    options: [
      { value: 1, label: '0. That phrase doesn\'t faze me at all.' },
      { value: 2, label: '3. Slight pause but I\'m good.' },
      { value: 3, label: '5. My mind starts running through scenarios.' },
      { value: 4, label: '8. Full body stress response activated.' },
      { value: 5, label: '10. I\'m already mentally packing my bags.' },
    ] },

  // ── repair_capacity ──
  { id: 'm3_cc_04', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    text: 'How long can you hold a grudge? Be honest.',
    options: [
      { value: 5, label: 'Hours, max. Life\'s too short.' },
      { value: 4, label: 'A day or two. Then I\'m over it.' },
      { value: 3, label: 'A week or so. I need time to process.' },
      { value: 2, label: 'Months. I remember everything.' },
      { value: 1, label: 'I\'m still mad about something from 2019.' },
    ] },
  { id: 'm3_cc_05', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    text: 'After a bad fight, who reaches out first to make up?',
    options: [
      { value: 5, label: 'Me. Every time. I hate the silence.' },
      { value: 4, label: 'Usually me. I\'d rather fix it than sit in it.' },
      { value: 3, label: '50/50. Whoever cools down first.' },
      { value: 2, label: 'Usually them. I need them to come to me.' },
      { value: 1, label: 'Them. I\'m not reaching out until I get an apology.' },
    ] },
  { id: 'm3_cc_06', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    text: 'I can genuinely apologize and mean it, even when I think I was only partly wrong.',
    options: [
      { value: 5, label: 'Always. I own my part, even the small parts.' },
      { value: 4, label: 'Usually. It\'s hard but I do it.' },
      { value: 3, label: 'Sometimes. Depends on how wrong the other person was.' },
      { value: 2, label: 'Rarely. If I apologize, I need to actually be wrong.' },
      { value: 1, label: 'No. I\'m not apologizing for something I didn\'t do.' },
    ] },

  // ── emotional_expression ──
  { id: 'm3_cc_07', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    text: 'You\'ve had a terrible day. Your partner asks how you\'re doing. You say...',
    options: [
      { value: 1, label: '"I\'m fine." And change the subject.' },
      { value: 2, label: '"Long day." And leave it at that.' },
      { value: 3, label: '"Bad day." And share the highlights if they ask.' },
      { value: 4, label: 'I vent. They\'re getting the full download.' },
      { value: 5, label: 'I break it all down. I need them to understand how I feel.' },
    ] },
  { id: 'm3_cc_08', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    text: 'You\'re feeling insecure about where things stand with your partner. Do you tell them?',
    options: [
      { value: 1, label: 'No. I\'d rather figure it out on my own.' },
      { value: 2, label: 'Probably not. I don\'t want to seem needy.' },
      { value: 3, label: 'Maybe. If I can find the right words.' },
      { value: 4, label: 'Yes, even though it makes me uncomfortable.' },
      { value: 5, label: 'Absolutely. Vulnerability is how you build trust.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 4: How You Love (LL) — 6 questions
// FREE — Forced-choice pairs + flexibility
// Sub-scales: receiving_language, giving_language
// ════════════════════════════════════════════
const MODULE_4: AssessmentQuestion[] = [
  // ── receiving_language ──
  { id: 'm4_ll_01', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'Which one would make your whole week?',
    options: [
      { value: 1, label: 'A surprise weekend getaway, just the two of you' },
      { value: 2, label: 'They cook your favorite meal and run you a bath after a long day' },
    ] },
  { id: 'm4_ll_02', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'Which hits different?',
    options: [
      { value: 1, label: 'They post you on their birthday with a paragraph about why you matter' },
      { value: 2, label: 'They write you a private love letter you find on your pillow' },
    ] },
  { id: 'm4_ll_03', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'After the worst week of your life, which heals you more?',
    options: [
      { value: 1, label: 'They pull you close and just hold you. No words needed.' },
      { value: 2, label: 'They handle everything -- groceries, laundry, dinner -- so you don\'t have to think' },
    ] },

  // ── giving_language ──
  { id: 'm4_ll_04', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'Your partner just crushed a big goal. How do you celebrate them?',
    options: [
      { value: 1, label: 'Plan a night out or experience they\'ll never forget' },
      { value: 2, label: 'Buy them something meaningful that marks the moment' },
    ] },
  { id: 'm4_ll_05', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'Random Tuesday night. How do you show love without being asked?',
    options: [
      { value: 1, label: 'Phone away, full attention, asking about their day like you mean it' },
      { value: 2, label: 'Walk up behind them, wrap your arms around them, and just stay there' },
    ] },
  { id: 'm4_ll_06', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'Your partner seems down. What\'s your first instinct?',
    options: [
      { value: 1, label: 'Tell them exactly what you love about them and why they matter' },
      { value: 2, label: 'Take something off their plate without being asked -- cook, clean, handle it' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 5: Hot Takes & Dealbreakers (HT) — 8 questions
// FREE — Pop culture + values through entertainment/culture
// Sub-scales: boundaries, gender_dynamics, vulnerability
// ════════════════════════════════════════════
const MODULE_5: AssessmentQuestion[] = [
  // ── boundaries ──
  { id: 'm5_ht_01', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    text: 'Prenup: smart move or trust issue?',
    options: [
      { value: 1, label: 'Trust issue. If you need a prenup, you\'re not ready.' },
      { value: 2, label: 'I get why people do it, but it\'s not for me' },
      { value: 3, label: 'Depends on the situation. No blanket answer.' },
      { value: 4, label: 'Smart move. Love is love, business is business.' },
      { value: 5, label: 'Non-negotiable. Protect yourself always.' },
    ] },
  { id: 'm5_ht_02', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    text: 'Your partner still talks to their ex "as friends." Red flag or green flag?',
    options: [
      { value: 1, label: 'Red flag. Full stop. No exceptions.' },
      { value: 2, label: 'Orange flag. I\'m watching closely.' },
      { value: 3, label: 'Depends on the vibe. Context matters.' },
      { value: 4, label: 'Green flag, honestly. Maturity looks like that.' },
      { value: 5, label: 'Green flag. If you can\'t be friends with an ex, that\'s the real red flag.' },
    ] },
  { id: 'm5_ht_03', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    text: 'Is it ever okay to go through your partner\'s phone?',
    options: [
      { value: 1, label: 'Never. That\'s a violation, period.' },
      { value: 2, label: 'No, but I understand the temptation' },
      { value: 3, label: 'Only if something feels really off' },
      { value: 4, label: 'If we\'re serious, phones should be open books' },
      { value: 5, label: 'We should have each other\'s passwords from day one' },
    ] },

  // ── gender_dynamics ──
  { id: 'm5_ht_04', module: 5, quotient: 'HT', dimension: 'gender_dynamics', format: 'scenario',
    text: 'Should the man always pay on the first date?',
    options: [
      { value: 1, label: 'Absolutely. That sets the tone.' },
      { value: 2, label: 'Ideally yes, but I won\'t be mad if we split' },
      { value: 3, label: 'Whoever asked should pay' },
      { value: 4, label: 'Splitting is fine. It\'s not 1955.' },
      { value: 5, label: 'It genuinely does not matter to me at all' },
    ] },
  { id: 'm5_ht_05', module: 5, quotient: 'HT', dimension: 'gender_dynamics', format: 'scenario',
    text: 'Your partner makes significantly more money than you. Does that change the dynamic?',
    options: [
      { value: 1, label: 'Yes, and I\'d struggle with it honestly' },
      { value: 2, label: 'It would take some adjusting but we\'d figure it out' },
      { value: 3, label: 'We\'d need to talk about it openly' },
      { value: 4, label: 'Not really. Money doesn\'t define a partnership.' },
      { value: 5, label: 'Not at all. More money in the house is a good thing, period.' },
    ] },

  // ── vulnerability ──
  { id: 'm5_ht_06', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    text: 'Kids or no kids -- is that a day-one conversation or a year-two conversation?',
    options: [
      { value: 1, label: 'Day one. Why waste anyone\'s time?' },
      { value: 2, label: 'Within the first month. It\'s too important to wait.' },
      { value: 3, label: 'Once things start getting serious. No rush.' },
      { value: 4, label: 'When it comes up naturally. No need to force it.' },
      { value: 5, label: 'Year two is fine. People change their minds.' },
    ] },
  { id: 'm5_ht_07', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    text: 'Beyonce or Rihanna? And this says more about you than you think.',
    options: [
      { value: 1, label: 'Beyonce. Excellence, discipline, legacy.' },
      { value: 2, label: 'Beyonce, but Rihanna is a close second' },
      { value: 3, label: 'Can\'t choose. Different vibes for different moods.' },
      { value: 4, label: 'Rihanna, but respect to Bey always' },
      { value: 5, label: 'Rihanna. Authenticity, freedom, zero apologies.' },
    ] },
  { id: 'm5_ht_08', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    text: 'Your partner gains 30 pounds. How does that actually affect things for you?',
    options: [
      { value: 1, label: 'It doesn\'t. At all. Love isn\'t conditional on a number.' },
      { value: 2, label: 'I\'d still love them, but I\'d be worried about their health' },
      { value: 3, label: 'I\'d gently encourage healthier habits together' },
      { value: 4, label: 'Physical attraction matters. I\'d struggle a little.' },
      { value: 5, label: 'I\'d be honest about it. Attraction is part of a relationship.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 6: Emotional Intelligence (EI) — 10 questions
// PAID ADD-ON — $4.99
// Sub-scales: self_awareness, empathy, emotional_regulation
// ════════════════════════════════════════════
const MODULE_6: AssessmentQuestion[] = [
  // ── self_awareness ──
  { id: 'm6_ei_01', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    text: 'Your friend is clearly going through it but says "I\'m fine." You...',
    options: [
      { value: 1, label: 'Take them at their word. They said they\'re fine.' },
      { value: 2, label: 'Note it mentally but don\'t push' },
      { value: 3, label: 'Say "You sure?" and leave the door open' },
      { value: 4, label: 'Gently call it out: "You don\'t seem fine."' },
      { value: 5, label: 'Sit with them. Make it safe enough that they don\'t have to say "I\'m fine."' },
    ] },
  { id: 'm6_ei_02', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    text: 'How often do you cry? And more importantly, do you feel weird about it?',
    options: [
      { value: 1, label: 'Rarely, and yes, it makes me uncomfortable' },
      { value: 2, label: 'Rarely, but I don\'t judge myself when I do' },
      { value: 3, label: 'Sometimes. Depends on the situation.' },
      { value: 4, label: 'When I need to. It\'s healthy.' },
      { value: 5, label: 'Freely. Tears are just feelings leaving the body.' },
    ] },
  { id: 'm6_ei_03', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    text: 'Someone cuts you off in traffic. Scale of 1-10, how long does that ruin your mood?',
    options: [
      { value: 5, label: 'About 5 seconds. I forget immediately.' },
      { value: 4, label: 'A minute or two. Quick flash of anger, then gone.' },
      { value: 3, label: '10-15 minutes. I\'m talking about it at the next red light.' },
      { value: 2, label: 'The rest of the drive. It sets my whole mood.' },
      { value: 1, label: 'I\'m telling someone about it at dinner. It lives in me.' },
    ] },

  // ── empathy ──
  { id: 'm6_ei_04', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    text: 'Your partner shares something vulnerable and you don\'t relate to it at all. You...',
    options: [
      { value: 1, label: 'Try to offer a solution or perspective' },
      { value: 2, label: 'Listen, but honestly I\'m not sure what to say' },
      { value: 3, label: 'Ask questions to understand, even if I can\'t relate' },
      { value: 4, label: 'Hold space. I don\'t need to relate to validate.' },
      { value: 5, label: 'Thank them for trusting me and let them know I see them.' },
    ] },
  { id: 'm6_ei_05', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    text: 'You can usually tell when your partner is upset before they say a single word.',
    options: [
      { value: 1, label: 'Not really. I need them to tell me.' },
      { value: 2, label: 'Sometimes. If it\'s obvious.' },
      { value: 3, label: 'About half the time.' },
      { value: 4, label: 'Most of the time. I pick up on energy shifts.' },
      { value: 5, label: 'Almost always. I\'m tuned into their frequency.' },
    ] },
  { id: 'm6_ei_06', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    text: 'A coworker you don\'t really like is having a terrible day. What\'s your honest internal reaction?',
    options: [
      { value: 1, label: 'Not my problem. We\'re not close like that.' },
      { value: 2, label: 'I notice but I don\'t go out of my way' },
      { value: 3, label: 'I might say something brief but I\'m not investing emotionally' },
      { value: 4, label: 'I feel for them even though we\'re not close' },
      { value: 5, label: 'I check on them. Being human doesn\'t require a friendship.' },
    ] },

  // ── emotional_regulation ──
  { id: 'm6_ei_07', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    text: 'You\'re upset about something your partner did. How long before you bring it up?',
    options: [
      { value: 1, label: 'I probably won\'t. I\'ll just deal with it.' },
      { value: 2, label: 'Days. I need to process alone first.' },
      { value: 3, label: 'A few hours. I need to cool down before I talk.' },
      { value: 4, label: 'Pretty soon. I don\'t like sitting on things.' },
      { value: 5, label: 'Right away. But I lead with curiosity, not accusations.' },
    ] },
  { id: 'm6_ei_08', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    text: 'Your partner says something that triggers an old wound. You feel the anger rising. What happens next?',
    options: [
      { value: 1, label: 'The filter comes off. I react before I think.' },
      { value: 2, label: 'I snap a little but try to catch myself' },
      { value: 3, label: 'I feel the trigger but can usually pause before reacting' },
      { value: 4, label: 'I name it: "That hit a nerve. Give me a second."' },
      { value: 5, label: 'I recognize the trigger, take a breath, and respond instead of react.' },
    ] },
  { id: 'm6_ei_09', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    text: 'Bad day at work. Your partner did nothing wrong but they\'re right there. How good are you at not taking it out on them?',
    options: [
      { value: 1, label: 'Terrible. They catch the overflow and I feel bad after.' },
      { value: 2, label: 'Not great. I get short and snappy.' },
      { value: 3, label: 'Hit or miss. Depends on how bad the day was.' },
      { value: 4, label: 'Pretty good. I can separate work stress from us.' },
      { value: 5, label: 'Very good. I\'ll tell them I need a minute, then come correct.' },
    ] },
  { id: 'm6_ei_10', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    text: 'When I feel myself getting jealous, I can sit with that feeling instead of immediately acting on it.',
    options: [
      { value: 1, label: 'Nah. If I\'m jealous, you\'re going to hear about it.' },
      { value: 2, label: 'I try, but it usually comes out sideways' },
      { value: 3, label: 'Sometimes. It depends on the situation.' },
      { value: 4, label: 'Usually. I can feel it without letting it drive me.' },
      { value: 5, label: 'Yes. I notice the feeling, examine it, and decide what it actually means.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 7: Lifestyle & Ambition (LA) — 10 questions
// PAID ADD-ON — $4.99
// Sub-scales: pace_of_life, social_energy, future_vision
// ════════════════════════════════════════════
const MODULE_7: AssessmentQuestion[] = [
  // ── pace_of_life ──
  { id: 'm7_la_01', module: 7, quotient: 'LA', dimension: 'pace_of_life', format: 'scenario',
    text: 'Saturday morning. No plans. You\'re most likely...',
    options: [
      { value: 1, label: 'Already up with a to-do list. Rest is for later.' },
      { value: 2, label: 'Up early but taking it slow -- coffee first, then decisions' },
      { value: 3, label: 'Sleeping in. I earned this.' },
      { value: 4, label: 'On the couch watching something. No guilt.' },
      { value: 5, label: 'Still in bed at noon. It\'s called self-care.' },
    ] },
  { id: 'm7_la_02', module: 7, quotient: 'LA', dimension: 'pace_of_life', format: 'scenario',
    text: 'How many hours a week do you work? And how many is too many for your partner to work?',
    options: [
      { value: 1, label: '50+. And my partner should match that energy.' },
      { value: 2, label: '45-50. I want a partner who\'s driven but present.' },
      { value: 3, label: '40ish. I work to live, not the other way around.' },
      { value: 4, label: 'Under 40. Balance is everything.' },
      { value: 5, label: 'As little as possible. I\'m optimizing for freedom, not hours.' },
    ] },
  { id: 'm7_la_03', module: 7, quotient: 'LA', dimension: 'pace_of_life', format: 'scenario',
    text: 'Your partner wants to binge a show tonight. You have a side project calling your name. What wins?',
    options: [
      { value: 1, label: 'The project. Always. They\'ll understand.' },
      { value: 2, label: 'One episode, then I\'m back to my thing' },
      { value: 3, label: 'Depends on the night. No default answer.' },
      { value: 4, label: 'The show. Quality time matters more.' },
      { value: 5, label: 'The show and I\'m not even thinking about the project.' },
    ] },

  // ── social_energy ──
  { id: 'm7_la_04', module: 7, quotient: 'LA', dimension: 'social_energy', format: 'scenario',
    text: 'Friday night. Your partner wants to go to a dinner party. You want the couch. Who wins?',
    options: [
      { value: 1, label: 'The couch. I\'m not performing socialization after this week.' },
      { value: 2, label: 'Probably the couch, but I\'d compromise sometimes' },
      { value: 3, label: 'We alternate. Their turn this time, my turn next time.' },
      { value: 4, label: 'The dinner party. Social life matters to me.' },
      { value: 5, label: 'We\'re going! I come alive around people.' },
    ] },
  { id: 'm7_la_05', module: 7, quotient: 'LA', dimension: 'social_energy', format: 'scenario',
    text: 'Your ideal vacation: all-inclusive resort or backpacking through a country you can\'t pronounce?',
    options: [
      { value: 1, label: 'All-inclusive. Pool, drinks, zero decisions.' },
      { value: 2, label: 'Resort with a few day trips mixed in' },
      { value: 3, label: 'Something in between. A nice hotel but lots of exploring.' },
      { value: 4, label: 'Backpacking-ish. Local food, hidden spots, real culture.' },
      { value: 5, label: 'Full backpack mode. The more uncomfortable, the better the story.' },
    ] },
  { id: 'm7_la_06', module: 7, quotient: 'LA', dimension: 'social_energy', format: 'scenario',
    text: 'How important is it that your partner and you share a social circle?',
    options: [
      { value: 1, label: 'Very. I want our worlds to overlap.' },
      { value: 2, label: 'Somewhat. Shared friends are nice but not required.' },
      { value: 3, label: 'Neutral. Some overlap, some separate friends.' },
      { value: 4, label: 'Not very. We can have our own people.' },
      { value: 5, label: 'Not at all. I prefer separate social lives.' },
    ] },

  // ── future_vision ──
  { id: 'm7_la_07', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    text: 'Five-year plan: you have one?',
    options: [
      { value: 5, label: 'Detailed. With milestones. Color-coded.' },
      { value: 4, label: 'General direction, yes. Specific steps, working on it.' },
      { value: 3, label: 'I know what I want but I\'m flexible on how I get there.' },
      { value: 2, label: 'More like a five-year vibe. I trust the process.' },
      { value: 1, label: 'Plans are suggestions. I follow what feels right.' },
    ] },
  { id: 'm7_la_08', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    text: 'Your partner is content in their career. No desire to climb higher. How do you feel?',
    options: [
      { value: 1, label: 'That would bother me. I need a partner with drive.' },
      { value: 2, label: 'I\'d want to understand why. Are they settling or satisfied?' },
      { value: 3, label: 'As long as they\'re happy, I\'m not going to push.' },
      { value: 4, label: 'I respect it. Not everyone needs to chase a title.' },
      { value: 5, label: 'Love it. Contentment is an underrated quality.' },
    ] },
  { id: 'm7_la_09', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    text: 'Your dream retirement: what does it look like?',
    options: [
      { value: 1, label: 'Still working. I\'ll never fully stop. Purpose keeps me alive.' },
      { value: 2, label: 'Consulting, mentoring, part-time passion projects' },
      { value: 3, label: 'Travel and experiences. See the world with my person.' },
      { value: 4, label: 'Somewhere warm with a porch and no deadlines' },
      { value: 5, label: 'Off the grid. Peace. Garden. Wine. Done.' },
    ] },
  { id: 'm7_la_10', module: 7, quotient: 'LA', dimension: 'future_vision', format: 'scenario',
    text: 'How do you feel about your partner having a side hustle that takes up evenings and weekends?',
    options: [
      { value: 5, label: 'Love it. Ambition is attractive.' },
      { value: 4, label: 'Supportive, as long as they still make time for us' },
      { value: 3, label: 'Fine for a season, but not forever' },
      { value: 2, label: 'I\'d rather they be present than productive' },
      { value: 1, label: 'That\'s a problem. Our time together matters more.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 8: Intimacy & Chemistry (IC) — 10 questions
// PAID ADD-ON — $4.99 (The Spicy One)
// Sub-scales: physical_chemistry, emotional_intimacy, desire_dynamics
// ════════════════════════════════════════════
const MODULE_8: AssessmentQuestion[] = [
  // ── physical_chemistry ──
  { id: 'm8_ic_01', module: 8, quotient: 'IC', dimension: 'physical_chemistry', format: 'scenario',
    text: 'Physical touch or deep eye contact -- which one sends you?',
    options: [
      { value: 1, label: 'Touch. 100%. Words are overrated.' },
      { value: 2, label: 'Touch, but eye contact is a close second' },
      { value: 3, label: 'Both equally. Depends on the moment.' },
      { value: 4, label: 'Eye contact. Someone really seeing me? Dangerous.' },
      { value: 5, label: 'Eye contact. That\'s where the real connection lives.' },
    ] },
  { id: 'm8_ic_02', module: 8, quotient: 'IC', dimension: 'physical_chemistry', format: 'scenario',
    text: 'How important is physical chemistry on a first date?',
    options: [
      { value: 5, label: 'Everything. If the spark isn\'t there, I\'m out.' },
      { value: 4, label: 'Very important. It doesn\'t have to be fireworks, but I need something.' },
      { value: 3, label: 'Important, but it can grow.' },
      { value: 2, label: 'Nice to have, but emotional connection matters more.' },
      { value: 1, label: 'Not at all. Attraction builds with time and trust.' },
    ] },
  { id: 'm8_ic_03', module: 8, quotient: 'IC', dimension: 'physical_chemistry', format: 'scenario',
    text: 'Your love life soundtrack: R&B slow jams or something more... adventurous?',
    options: [
      { value: 1, label: 'Classic R&B. Jodeci, SWV, Sade. Set the mood right.' },
      { value: 2, label: 'Neo-soul. Erykah, Frank Ocean, Daniel Caesar.' },
      { value: 3, label: 'A mix. My playlist has range.' },
      { value: 4, label: 'Something with energy. I like intensity.' },
      { value: 5, label: 'No music needed. The energy in the room is enough.' },
    ] },

  // ── emotional_intimacy ──
  { id: 'm8_ic_04', module: 8, quotient: 'IC', dimension: 'emotional_intimacy', format: 'scenario',
    text: 'What\'s more intimate: someone seeing you at your absolute worst, or someone knowing your deepest fear?',
    options: [
      { value: 1, label: 'My worst. That\'s the real me with no filter.' },
      { value: 2, label: 'My worst, slightly. Both are terrifying.' },
      { value: 3, label: 'Equally scary. Both require massive trust.' },
      { value: 4, label: 'My deepest fear. That\'s the core of who I am.' },
      { value: 5, label: 'My deepest fear. Vulnerability at that level changes everything.' },
    ] },
  { id: 'm8_ic_05', module: 8, quotient: 'IC', dimension: 'emotional_intimacy', format: 'scenario',
    text: 'How long into a relationship before you really let someone see all of you? The real, unfiltered you.',
    options: [
      { value: 1, label: 'Pretty quickly. What you see is what you get.' },
      { value: 2, label: 'A few months. Once trust is established.' },
      { value: 3, label: '6 months to a year. I open up in layers.' },
      { value: 4, label: 'Over a year. I need serious trust first.' },
      { value: 5, label: 'I\'m not sure anyone has seen all of me yet.' },
    ] },
  { id: 'm8_ic_06', module: 8, quotient: 'IC', dimension: 'emotional_intimacy', format: 'scenario',
    text: 'Pillow talk at 2 AM or a deep conversation over dinner? Which builds more connection?',
    options: [
      { value: 1, label: '2 AM pillow talk. Guards are down. That\'s where the real stuff lives.' },
      { value: 2, label: 'Pillow talk, but dinner conversations matter too' },
      { value: 3, label: 'Both equally. Different vibes, same depth.' },
      { value: 4, label: 'Dinner. I like intentional, face-to-face conversation.' },
      { value: 5, label: 'Dinner, fully. I connect better when I\'m alert and present.' },
    ] },

  // ── desire_dynamics ──
  { id: 'm8_ic_07', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    text: 'In a long-term relationship, keeping the spark alive is...',
    options: [
      { value: 1, label: 'Natural. If you\'re with the right person, it just stays.' },
      { value: 2, label: 'Mostly natural, with occasional effort' },
      { value: 3, label: 'A shared responsibility. Takes intentional work.' },
      { value: 4, label: 'Effort-heavy, and both people have to show up for it.' },
      { value: 5, label: 'A whole project. Date nights, surprises, creativity. All of it.' },
    ] },
  { id: 'm8_ic_08', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    text: 'How important is it to you that your partner openly communicates what they want in the bedroom?',
    options: [
      { value: 1, label: 'Not very. Some things should just flow naturally.' },
      { value: 2, label: 'Somewhat. A few hints here and there is enough.' },
      { value: 3, label: 'Important. Communication makes everything better.' },
      { value: 4, label: 'Very important. I need to know what works for them.' },
      { value: 5, label: 'Non-negotiable. Full transparency or we\'re both losing.' },
    ] },
  { id: 'm8_ic_09', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    text: 'If your partner said they wanted to try something new and outside your comfort zone, your first reaction would be...',
    options: [
      { value: 1, label: 'No. I know what I like and I\'m good.' },
      { value: 2, label: 'Hesitant but I\'d hear them out' },
      { value: 3, label: 'Curious. I\'d want to know more before deciding.' },
      { value: 4, label: 'Open. I\'m down to explore if we\'re both comfortable.' },
      { value: 5, label: 'Excited. Growth happens outside your comfort zone.' },
    ] },
  { id: 'm8_ic_10', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    text: 'Honest answer: how important is physical intimacy to you in a long-term relationship?',
    options: [
      { value: 1, label: 'It\'s nice but it\'s not the most important thing' },
      { value: 2, label: 'Important, but emotional connection comes first' },
      { value: 3, label: 'Very important. It\'s how I stay connected.' },
      { value: 4, label: 'Essential. If that\'s missing, something\'s wrong.' },
      { value: 5, label: 'Top priority. I need that to feel alive in a relationship.' },
    ] },
]

// ════════════════════════════════════════════
// Export
// ════════════════════════════════════════════
export const QUESTION_BANK: AssessmentQuestion[] = [
  ...MODULE_1,
  ...MODULE_2,
  ...MODULE_3,
  ...MODULE_4,
  ...MODULE_5,
  ...MODULE_6,
  ...MODULE_7,
  ...MODULE_8,
]

export function getModuleQuestions(module: number): AssessmentQuestion[] {
  return QUESTION_BANK.filter((q) => q.module === module)
}

export const FREE_MODULES = [1, 2, 3, 4, 5] as const
export const PAID_MODULES = [6, 7, 8] as const
export const PAID_MODULE_PRICE = 4.99

export {
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
  MODULE_8,
}

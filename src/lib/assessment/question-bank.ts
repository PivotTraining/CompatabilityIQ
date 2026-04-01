import type { AssessmentQuestion } from './types'

// ════════════════════════════════════════════
// MODULE 1: Values & Priorities (VP) — 16 questions
// FREE — Hot takes and scenarios that reveal life priorities
// Sub-scales: life_direction, moral_ethical, relationship_priority
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
    text: 'When making a major life decision, I prioritize stability and security over excitement and new experiences.',
    options: [
      { value: 1, label: 'Strongly disagree. I chase excitement and novelty every time.' },
      { value: 2, label: 'I lean toward new experiences, but I weigh the risks' },
      { value: 3, label: 'It depends on the decision. I balance both.' },
      { value: 4, label: 'I lean toward stability. Excitement is nice but security matters more.' },
      { value: 5, label: 'Strongly agree. Stability and security come first, always.' },
    ] },

  // ── moral_ethical ──
  { id: 'm1_vp_04', module: 1, quotient: 'VP', dimension: 'moral_ethical', format: 'scenario',
    text: 'A close friend confides they lied on their resume to get their dream job. How do you feel about it?',
    options: [
      { value: 1, label: 'Rules are rules. That\'s dishonest and completely unacceptable.' },
      { value: 2, label: 'I\'d be uncomfortable with it. Integrity matters.' },
      { value: 3, label: 'Torn. I get the temptation but it doesn\'t sit right.' },
      { value: 4, label: 'I wouldn\'t do it myself, but I understand why they did.' },
      { value: 5, label: 'The end justifies the means. They got the job -- I get it.' },
    ] },
  { id: 'm1_vp_05', module: 1, quotient: 'VP', dimension: 'moral_ethical', format: 'scenario',
    text: 'Your best friend tells you they cheated on their partner. They\'re crying. What do you do?',
    options: [
      { value: 1, label: 'Tell them they need to confess. Full stop.' },
      { value: 2, label: 'Comfort them, but tell them they have to make it right' },
      { value: 3, label: 'Listen without judgment first, advise later' },
      { value: 4, label: 'That\'s their business. I\'m just here for support.' },
      { value: 5, label: 'We all make mistakes. I\'m not here to judge.' },
    ] },
  { id: 'm1_vp_06', module: 1, quotient: 'VP', dimension: 'moral_ethical', format: 'scenario',
    reverseScored: true,
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

  // ── life_direction (continued) ──
  { id: 'm1_vp_09', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    text: 'Your partner wants to quit their stable job and start a business. Your savings would take the hit. What\'s your move?',
    options: [
      { value: 1, label: 'Hard no. Stability isn\'t something you gamble with.' },
      { value: 2, label: 'I\'d need to see a real business plan before I\'m in' },
      { value: 3, label: 'Nervous, but I\'d hear them out seriously' },
      { value: 4, label: 'Supportive if they\'ve thought it through. Dreams matter.' },
      { value: 5, label: 'Let\'s go. I\'d rather struggle chasing something real than play it safe.' },
    ] },
  { id: 'm1_vp_10', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    text: 'City energy or small-town peace? Where do you actually see yourself long-term?',
    options: [
      { value: 1, label: 'Big city forever. I need the pulse, the options, the chaos.' },
      { value: 2, label: 'City for now, maybe suburbs later when life slows down' },
      { value: 3, label: 'Wherever feels right. I\'m not married to a zip code.' },
      { value: 4, label: 'Somewhere quieter. I want space to breathe.' },
      { value: 5, label: 'Small town or country. Give me land, quiet, and real community.' },
    ] },
  { id: 'm1_vp_11', module: 1, quotient: 'VP', dimension: 'life_direction', format: 'scenario',
    text: 'You and your partner disagree on how to raise kids -- religion, discipline, screen time, all of it. What happens?',
    options: [
      { value: 1, label: 'My way. Some things aren\'t up for debate.' },
      { value: 2, label: 'We talk, but I have strong non-negotiables' },
      { value: 3, label: 'We compromise and figure out a middle ground' },
      { value: 4, label: 'I lean toward their approach if they feel strongly' },
      { value: 5, label: 'We co-create everything together. No one\'s playbook wins by default.' },
    ] },

  // ── moral_ethical (continued) ──
  { id: 'm1_vp_12', module: 1, quotient: 'VP', dimension: 'moral_ethical', format: 'scenario',
    text: 'A stranger drops a $100 bill and doesn\'t notice. Nobody else saw it. What do you actually do?',
    options: [
      { value: 1, label: 'Run it back to them. No question.' },
      { value: 2, label: 'Try to get their attention, but if they\'re gone... tough call' },
      { value: 3, label: 'Depends on my day. I\'d like to think I\'d return it.' },
      { value: 4, label: 'Pocket it. That\'s the universe providing.' },
      { value: 5, label: 'Keep it. They should\'ve been more careful.' },
    ] },
  { id: 'm1_vp_13', module: 1, quotient: 'VP', dimension: 'moral_ethical', format: 'scenario',
    text: 'Your partner tells a white lie to get out of a friend\'s boring event. How do you feel about it?',
    options: [
      { value: 1, label: 'Not okay. Lying is lying, even small ones.' },
      { value: 2, label: 'I get it but I wouldn\'t do it myself' },
      { value: 3, label: 'It\'s a white lie. Not ideal, but not a big deal.' },
      { value: 4, label: 'Smart move honestly. Social survival skill.' },
      { value: 5, label: 'I probably would\'ve made up the excuse for them.' },
    ] },

  // ── relationship_priority (continued) ──
  { id: 'm1_vp_14', module: 1, quotient: 'VP', dimension: 'relationship_priority', format: 'scenario',
    text: 'Your partner and your best friend don\'t get along. Like, at all. What do you do?',
    options: [
      { value: 1, label: 'My friend was here first. My partner needs to adjust.' },
      { value: 2, label: 'Keep them separate. Not everyone has to vibe.' },
      { value: 3, label: 'Try to mediate. I need both people in my life.' },
      { value: 4, label: 'Have a real conversation with my partner about making more effort' },
      { value: 5, label: 'My partner is my priority. If they\'re uncomfortable, I\'m addressing it.' },
    ] },
  { id: 'm1_vp_15', module: 1, quotient: 'VP', dimension: 'relationship_priority', format: 'scenario',
    text: 'You get invited to a once-in-a-lifetime trip with friends. Same weekend as your anniversary. What wins?',
    options: [
      { value: 1, label: 'The trip. We can celebrate the anniversary another day.' },
      { value: 2, label: 'The trip, but I\'m making it up to my partner big time' },
      { value: 3, label: 'Genuinely torn. I\'d need to talk it through with my partner.' },
      { value: 4, label: 'Anniversary. Some things you don\'t reschedule.' },
      { value: 5, label: 'Anniversary, no contest. My person comes first. Always.' },
    ] },
  { id: 'm1_vp_16', module: 1, quotient: 'VP', dimension: 'relationship_priority', format: 'scenario',
    text: 'How much alone time do you need in a relationship before you start feeling suffocated?',
    options: [
      { value: 1, label: 'A lot. I need multiple nights a week that are just mine.' },
      { value: 2, label: 'A fair amount. A few hours of solo time daily keeps me sane.' },
      { value: 3, label: 'Some. A healthy balance of together and apart.' },
      { value: 4, label: 'Not much. I genuinely like being around my person.' },
      { value: 5, label: 'Almost none. I want my partner to be my favorite place to be.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 2: Attachment Style (AS) — 16 questions
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

  // ── anxiety (continued) ──
  { id: 'm2_as_09', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    text: 'Your partner mentions a coworker you\'ve never heard of. A lot. Your brain goes...',
    options: [
      { value: 1, label: 'Nowhere. People have coworkers. It\'s fine.' },
      { value: 2, label: 'I notice, but I don\'t read into it' },
      { value: 3, label: 'I\'d casually ask about them. Just curious.' },
      { value: 4, label: 'I\'m already checking the coworker\'s Instagram' },
      { value: 5, label: 'Full investigation mode. I need to know everything about this person.' },
    ] },
  { id: 'm2_as_10', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    text: 'Your partner seems quieter than usual tonight. No explanation. You...',
    options: [
      { value: 1, label: 'Don\'t even notice. People have quiet nights.' },
      { value: 2, label: 'Notice, but give them space. They\'ll talk when ready.' },
      { value: 3, label: 'Ask once if they\'re okay. If they say yes, I drop it.' },
      { value: 4, label: 'Keep asking. Something is clearly wrong.' },
      { value: 5, label: 'Spiral. I\'m already convinced it\'s about me.' },
    ] },
  { id: 'm2_as_11', module: 2, quotient: 'AS', dimension: 'anxiety', format: 'scenario',
    text: 'Your partner is going on a trip with friends. No invite for you. How are you feeling?',
    options: [
      { value: 1, label: 'Great. Enjoy. I\'ve got my own plans.' },
      { value: 2, label: 'Totally fine. Everyone needs friend time.' },
      { value: 3, label: 'A little bummed I wasn\'t invited, but it\'s cool' },
      { value: 4, label: 'Low-key anxious the whole time they\'re gone' },
      { value: 5, label: 'I\'d have a hard time not checking in constantly' },
    ] },

  // ── avoidance (continued) ──
  { id: 'm2_as_12', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    text: 'Your partner wants to have "the talk" about where this is going. After two months. You...',
    options: [
      { value: 5, label: 'Two months? Way too soon. I\'m out.' },
      { value: 4, label: 'Uncomfortable. I\'d rather let things develop naturally.' },
      { value: 3, label: 'Fair question. I\'d have the conversation.' },
      { value: 2, label: 'Relieved, honestly. I was wondering the same thing.' },
      { value: 1, label: 'Finally. I\'ve been ready to define this since week three.' },
    ] },
  { id: 'm2_as_13', module: 2, quotient: 'AS', dimension: 'avoidance', format: 'scenario',
    text: 'Your partner wants to meet your family. You\'ve been dating for four months. Your gut says...',
    options: [
      { value: 5, label: 'Absolutely not. That\'s way too fast for me.' },
      { value: 4, label: 'Pump the brakes. I don\'t introduce people easily.' },
      { value: 3, label: 'Maybe. If things keep going well, sure.' },
      { value: 2, label: 'I\'m down. If I like you enough to date you, my family can meet you.' },
      { value: 1, label: 'They probably already know about you. Let\'s do it.' },
    ] },

  // ── security (continued) ──
  { id: 'm2_as_14', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    text: 'Your partner makes a decision that affects both of you without asking first. How do you handle it?',
    options: [
      { value: 1, label: 'Shut down. If they don\'t include me, why bother.' },
      { value: 2, label: 'Feel some type of way but probably won\'t bring it up' },
      { value: 3, label: 'Mention it later when things are calm' },
      { value: 4, label: 'Tell them directly that I need to be part of those decisions' },
      { value: 5, label: 'Address it right away, calmly. We\'re a team and I trust we can fix the pattern.' },
    ] },
  { id: 'm2_as_15', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    text: 'How easy is it for you to trust a new partner? Like actually trust them, not just say you do.',
    options: [
      { value: 1, label: 'Very hard. Trust is earned over years, not months.' },
      { value: 2, label: 'Takes a while. I watch patterns before I let my guard down.' },
      { value: 3, label: 'Moderate. I give people a fair shot but stay aware.' },
      { value: 4, label: 'Pretty easy. I assume good intentions until proven otherwise.' },
      { value: 5, label: 'Easy. I lead with trust. If it breaks, that\'s on them, not me.' },
    ] },
  { id: 'm2_as_16', module: 2, quotient: 'AS', dimension: 'security', format: 'scenario',
    text: 'When your partner reassures you about something, how long does that reassurance actually last?',
    options: [
      { value: 1, label: 'Minutes. Then the doubt creeps back.' },
      { value: 2, label: 'A few hours. I need to hear it more than once.' },
      { value: 3, label: 'A day or two. Then I might need a refresh.' },
      { value: 4, label: 'A good while. Once they say it, I believe it.' },
      { value: 5, label: 'It sticks. When my person tells me something, I hold onto it.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 3: Communication & Conflict (CC) — 16 questions
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
    reverseScored: true,
    text: 'During a heated argument, I have a hard time stopping myself from saying things I know will hurt.',
    options: [
      { value: 1, label: 'Never. I always choose my words carefully.' },
      { value: 2, label: 'Rarely. I can usually pump the brakes.' },
      { value: 3, label: 'Sometimes. Depends on how hurt I am.' },
      { value: 4, label: 'More often than I\'d like to admit.' },
      { value: 5, label: 'When I\'m hurt, the filter comes off. I own that.' },
    ] },
  { id: 'm3_cc_03', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    reverseScored: true,
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

  // ── conflict_style (continued) ──
  { id: 'm3_cc_09', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    text: 'You and your partner disagree about something important. They pull the "let\'s just agree to disagree" card. You...',
    options: [
      { value: 1, label: 'Accept it. Not everything needs a resolution.' },
      { value: 2, label: 'Let it go for now, but it\'ll come up again eventually' },
      { value: 3, label: 'Push back a little. I want to at least understand their side.' },
      { value: 4, label: 'Not satisfied. We need to actually work through this.' },
      { value: 5, label: 'No. That\'s a cop-out. We\'re finishing this conversation.' },
    ] },
  { id: 'm3_cc_10', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    text: 'Mid-argument, your partner starts crying. What happens to the fight?',
    options: [
      { value: 1, label: 'I keep making my point. Tears don\'t change the facts.' },
      { value: 2, label: 'I pause, but I\'m coming back to this later' },
      { value: 3, label: 'I soften my tone but don\'t abandon my point entirely' },
      { value: 4, label: 'I stop and comfort them. We can talk about this when they\'re okay.' },
      { value: 5, label: 'The argument is over. Their feelings matter more than being right.' },
    ] },
  { id: 'm3_cc_11', module: 3, quotient: 'CC', dimension: 'conflict_style', format: 'scenario',
    text: 'Your partner brings up something you did wrong... from three months ago. Your reaction?',
    options: [
      { value: 1, label: 'Shut it down. If you didn\'t say something then, you can\'t bring it up now.' },
      { value: 2, label: 'Annoyed. That should\'ve been addressed in real time.' },
      { value: 3, label: 'I\'ll listen, but I wish they\'d brought it up sooner' },
      { value: 4, label: 'If it still hurts, it still matters. I\'ll hear them out.' },
      { value: 5, label: 'No expiration date on feelings. Let\'s talk about it.' },
    ] },

  // ── repair_capacity (continued) ──
  { id: 'm3_cc_12', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    text: 'You said something hurtful in an argument. You didn\'t mean it. How fast do you own it?',
    options: [
      { value: 5, label: 'Immediately. I stop mid-fight and say "that was wrong."' },
      { value: 4, label: 'Within the hour. I need a minute but I come back to it.' },
      { value: 3, label: 'Same day. Once things cool down I acknowledge it.' },
      { value: 2, label: 'Eventually. But I struggle to admit fault in the moment.' },
      { value: 1, label: 'I might not bring it up at all. If they got over it, why reopen it?' },
    ] },
  { id: 'm3_cc_13', module: 3, quotient: 'CC', dimension: 'repair_capacity', format: 'scenario',
    text: 'After a big fight, can you still be physically affectionate? Like, can you hold their hand even though you\'re still a little mad?',
    options: [
      { value: 5, label: 'Yes. Touch is how I reconnect, even when things are tense.' },
      { value: 4, label: 'Probably. Physical closeness helps me heal faster.' },
      { value: 3, label: 'Depends on the fight. Sometimes yes, sometimes no.' },
      { value: 2, label: 'Not easily. I need to be emotionally settled first.' },
      { value: 1, label: 'No. Don\'t touch me until we\'re actually good.' },
    ] },

  // ── emotional_expression (continued) ──
  { id: 'm3_cc_14', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    text: 'Your partner does something small but thoughtful. Like, really nails a random Tuesday. Do you tell them how much it meant?',
    options: [
      { value: 1, label: 'Probably not out loud. I appreciate it internally.' },
      { value: 2, label: 'A quick "thanks babe" and keep it moving' },
      { value: 3, label: 'I\'d mention it. Maybe not a speech, but they\'d know.' },
      { value: 4, label: 'I\'d make a point to tell them exactly why it mattered.' },
      { value: 5, label: 'Full monologue. They\'re hearing every feeling I have about it.' },
    ] },
  { id: 'm3_cc_15', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    text: 'When you love someone, do they know it because you say it or because you show it?',
    options: [
      { value: 1, label: 'Show it. Actions over words, always.' },
      { value: 2, label: 'Mostly show it. I\'m not the most verbal person.' },
      { value: 3, label: 'Both. But I lean on one more depending on the day.' },
      { value: 4, label: 'Say it. I need them to hear the words.' },
      { value: 5, label: 'Both, loudly. I say it AND show it. No room for guessing.' },
    ] },
  { id: 'm3_cc_16', module: 3, quotient: 'CC', dimension: 'emotional_expression', format: 'scenario',
    text: 'You just got news that made you emotional -- good or bad. Who\'s the first person you call?',
    options: [
      { value: 1, label: 'Nobody. I process alone first.' },
      { value: 2, label: 'My best friend or a family member' },
      { value: 3, label: 'Depends on the news. Different people for different things.' },
      { value: 4, label: 'My partner. They should be the first to know.' },
      { value: 5, label: 'My partner, before I even fully process it. They\'re my person.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 4: How You Love (LL) — 16 questions
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

  // ── receiving (continued) ──
  { id: 'm4_ll_07', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'You\'re stressed about a big decision. Which calms you down more?',
    options: [
      { value: 1, label: 'They sit with you, no phone, and just listen to you think out loud' },
      { value: 2, label: 'They rub your shoulders and pull you close without saying a word' },
    ] },
  { id: 'm4_ll_08', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'It\'s your birthday. Which one makes you feel more loved?',
    options: [
      { value: 1, label: 'They planned the whole day -- every detail thought out, no effort spared' },
      { value: 2, label: 'They give you a gift that proves they actually listen to the little things you say' },
    ] },
  { id: 'm4_ll_09', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'You just had a win at work. Which response from your partner hits harder?',
    options: [
      { value: 1, label: 'They look you in the eyes and say "I\'m so proud of you" like they really mean it' },
      { value: 2, label: 'They clear your evening and take you out to celebrate, no questions asked' },
    ] },
  { id: 'm4_ll_10', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'You\'re sick on the couch. Which one says "I love you" louder?',
    options: [
      { value: 1, label: 'They cancel their plans and just stay with you all day' },
      { value: 2, label: 'They show up with soup, meds, and your favorite comfort show queued up' },
    ] },
  { id: 'm4_ll_11', module: 4, quotient: 'LL', dimension: 'receiving', format: 'forced_choice', subtype: 'receive',
    text: 'Long-distance for a month. Which keeps you going?',
    options: [
      { value: 1, label: 'Long voice notes and FaceTime calls where you talk about everything' },
      { value: 2, label: 'A care package shows up at your door with things only they\'d know to send' },
    ] },

  // ── giving (continued) ──
  { id: 'm4_ll_12', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'Your partner had a rough week. How do you show up?',
    options: [
      { value: 1, label: 'Clear the whole weekend and make it about them -- no agenda, just presence' },
      { value: 2, label: 'Write them a note or send a long text about how much they mean to you' },
    ] },
  { id: 'm4_ll_13', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'You want your partner to feel appreciated on a random day. You...',
    options: [
      { value: 1, label: 'Pick up something you know they\'ve been eyeing -- flowers, a book, their favorite snack' },
      { value: 2, label: 'Handle their chores so they come home to a clean space and nothing on their list' },
    ] },
  { id: 'm4_ll_14', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'Your partner is nervous before a big moment. How do you hype them up?',
    options: [
      { value: 1, label: 'Hold their hand, hug them tight, physical reassurance' },
      { value: 2, label: 'Look them in the eye and remind them exactly why they\'re going to crush it' },
    ] },
  { id: 'm4_ll_15', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'Anniversary time. What\'s your move?',
    options: [
      { value: 1, label: 'Plan an experience -- a trip, a surprise dinner, something you\'ll both remember' },
      { value: 2, label: 'A meaningful gift that references something special between you two' },
    ] },
  { id: 'm4_ll_16', module: 4, quotient: 'LL', dimension: 'giving', format: 'forced_choice', subtype: 'give',
    text: 'Your partner just vented about a problem. What feels more natural to you?',
    options: [
      { value: 1, label: 'Offer to help solve it -- research, make calls, fix what you can' },
      { value: 2, label: 'Just be there. Hold them. Let them feel heard without trying to fix anything.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 5: Hot Takes & Dealbreakers (HT) — 16 questions
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
    reverseScored: true,
    text: 'Kids or no kids -- is that a day-one conversation or a year-two conversation?',
    options: [
      { value: 1, label: 'Day one. Why waste anyone\'s time?' },
      { value: 2, label: 'Within the first month. It\'s too important to wait.' },
      { value: 3, label: 'Once things start getting serious. No rush.' },
      { value: 4, label: 'When it comes up naturally. No need to force it.' },
      { value: 5, label: 'Year two is fine. People change their minds.' },
    ] },
  { id: 'm5_ht_07', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    text: 'I believe showing emotional vulnerability in a relationship is a sign of strength, not weakness.',
    options: [
      { value: 1, label: 'Strongly disagree. Vulnerability gets you hurt.' },
      { value: 2, label: 'Disagree. I keep my guard up for good reason.' },
      { value: 3, label: 'Neutral. It depends on the person and the situation.' },
      { value: 4, label: 'Agree. Opening up builds trust and deepens connection.' },
      { value: 5, label: 'Strongly agree. Vulnerability is the foundation of real intimacy.' },
    ] },
  { id: 'm5_ht_08', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    reverseScored: true,
    text: 'Your partner gains 30 pounds. How does that actually affect things for you?',
    options: [
      { value: 1, label: 'It doesn\'t. At all. Love isn\'t conditional on a number.' },
      { value: 2, label: 'I\'d still love them, but I\'d be worried about their health' },
      { value: 3, label: 'I\'d gently encourage healthier habits together' },
      { value: 4, label: 'Physical attraction matters. I\'d struggle a little.' },
      { value: 5, label: 'I\'d be honest about it. Attraction is part of a relationship.' },
    ] },

  // ── boundaries (continued) ──
  { id: 'm5_ht_09', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    text: 'Your partner follows a bunch of thirst traps on social media. Dealbreaker or nah?',
    options: [
      { value: 1, label: 'Dealbreaker. That\'s disrespectful to our relationship.' },
      { value: 2, label: 'Not a dealbreaker, but I\'m bringing it up' },
      { value: 3, label: 'Depends. Are they interacting or just scrolling?' },
      { value: 4, label: 'I don\'t love it, but I\'m not policing their feed' },
      { value: 5, label: 'Who cares. Looking isn\'t touching. I\'m secure.' },
    ] },
  { id: 'm5_ht_10', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    text: 'Your partner wants to keep their location sharing off. You...',
    options: [
      { value: 1, label: 'That\'s suspicious. If you have nothing to hide, share it.' },
      { value: 2, label: 'I\'d prefer it on, but I wouldn\'t force it' },
      { value: 3, label: 'Don\'t care either way. Trust isn\'t GPS-based.' },
      { value: 4, label: 'Good for them. Privacy is healthy.' },
      { value: 5, label: 'I respect it completely. I don\'t need to track anyone.' },
    ] },
  { id: 'm5_ht_11', module: 5, quotient: 'HT', dimension: 'boundaries', format: 'scenario',
    text: 'Your partner\'s family is way too involved in your relationship. Like, opinions on everything. What do you do?',
    options: [
      { value: 1, label: 'Draw a hard line. This is between us, not them.' },
      { value: 2, label: 'Talk to my partner privately and ask them to set boundaries' },
      { value: 3, label: 'Tolerate it to a point, but speak up when it crosses a line' },
      { value: 4, label: 'Family is family. I\'d adapt and pick my battles.' },
      { value: 5, label: 'I actually like close families. The more input, the more love.' },
    ] },

  // ── gender_dynamics (continued) ──
  { id: 'm5_ht_12', module: 5, quotient: 'HT', dimension: 'gender_dynamics', format: 'scenario',
    text: 'One partner stays home with the kids while the other works. Does gender matter in who does what?',
    options: [
      { value: 1, label: 'Yes. There are natural roles and we should respect them.' },
      { value: 2, label: 'I have a preference, but I\'d flex for the right situation' },
      { value: 3, label: 'Whoever makes more sense financially and emotionally should do it' },
      { value: 4, label: 'Gender has nothing to do with it. Capabilities matter.' },
      { value: 5, label: 'We should actively challenge those assumptions. Either person could thrive in either role.' },
    ] },
  { id: 'm5_ht_13', module: 5, quotient: 'HT', dimension: 'gender_dynamics', format: 'scenario',
    text: 'Your partner cries during a movie. Like, full tears. How do you feel about it?',
    options: [
      { value: 1, label: 'Uncomfortable. I don\'t know how to handle that.' },
      { value: 2, label: 'It\'s fine, but I\'d be lying if I said it didn\'t surprise me' },
      { value: 3, label: 'Neutral. People cry. It\'s not a thing.' },
      { value: 4, label: 'I love it. Emotional openness is attractive.' },
      { value: 5, label: 'I\'m probably crying too. Let\'s grab the tissues.' },
    ] },

  // ── vulnerability (continued) ──
  { id: 'm5_ht_14', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    text: 'Therapy: green flag, red flag, or irrelevant?',
    options: [
      { value: 1, label: 'Irrelevant. Not everyone needs therapy.' },
      { value: 2, label: 'Fine if they want to, but I don\'t need to know about it' },
      { value: 3, label: 'Green flag. Shows self-awareness.' },
      { value: 4, label: 'Big green flag. I want a partner who does the work.' },
      { value: 5, label: 'Non-negotiable. If you\'re not in therapy, we might have a problem.' },
    ] },
  { id: 'm5_ht_15', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    text: 'Your partner admits they\'re struggling with their mental health. What\'s your honest first thought?',
    options: [
      { value: 1, label: 'I\'d worry about what that means for us long-term' },
      { value: 2, label: 'I\'d want to help, but I\'d need to know my limits' },
      { value: 3, label: 'I appreciate them telling me. I\'d ask how I can support.' },
      { value: 4, label: 'Respect. That takes courage. I\'m here for whatever they need.' },
      { value: 5, label: 'I\'d feel closer to them. Trust like that deepens everything.' },
    ] },
  { id: 'm5_ht_16', module: 5, quotient: 'HT', dimension: 'vulnerability', format: 'scenario',
    reverseScored: true,
    text: 'Body count conversation: do you want to know your partner\'s number?',
    options: [
      { value: 1, label: 'Yes. Full transparency. I want to know everything.' },
      { value: 2, label: 'A general idea, sure. I don\'t need specifics.' },
      { value: 3, label: 'Only if they want to share. I\'m not asking.' },
      { value: 4, label: 'I\'d rather not know. The past is the past.' },
      { value: 5, label: 'Absolutely not. That number means nothing to me.' },
    ] },
]

// ════════════════════════════════════════════
// MODULE 6: Emotional Intelligence (EI) — 16 questions
// PAID ADD-ON — $4.99
// Sub-scales: self_awareness, empathy, emotional_regulation
// ════════════════════════════════════════════
const MODULE_6: AssessmentQuestion[] = [
  // ── self_awareness ──
  { id: 'm6_ei_01', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
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

  // ── self_awareness (continued) ──
  { id: 'm6_ei_11', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    text: 'When a relationship ends, how honest are you with yourself about your part in it?',
    options: [
      { value: 1, label: 'Not very. It\'s usually the other person\'s fault.' },
      { value: 2, label: 'I see my part eventually, but it takes a while' },
      { value: 3, label: 'I try to be fair. Some of it was me, some was them.' },
      { value: 4, label: 'Pretty honest. I can name my patterns when I\'m calm enough.' },
      { value: 5, label: 'Very. I do a full debrief with myself. Growth requires honesty.' },
    ] },
  { id: 'm6_ei_12', module: 6, quotient: 'EI', dimension: 'self_awareness', format: 'scenario',
    text: 'Your partner gives you constructive feedback about something you do that bothers them. What\'s your gut reaction?',
    options: [
      { value: 1, label: 'Defensive. Why are you coming at me?' },
      { value: 2, label: 'Stung. I hear it but I don\'t want to.' },
      { value: 3, label: 'Neutral. I can take feedback if it\'s delivered right.' },
      { value: 4, label: 'Grateful. I\'d rather know than be clueless.' },
      { value: 5, label: 'Appreciative. That kind of honesty makes us stronger.' },
    ] },

  // ── empathy (continued) ──
  { id: 'm6_ei_13', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    text: 'You\'re watching the news and a story about strangers going through something terrible comes on. How much does it affect you?',
    options: [
      { value: 1, label: 'Not much. It\'s sad but I can separate myself from it.' },
      { value: 2, label: 'I feel something briefly and then move on' },
      { value: 3, label: 'It sits with me for a bit. Depends on the story.' },
      { value: 4, label: 'It genuinely weighs on me. I think about those people.' },
      { value: 5, label: 'Deeply. I feel it in my body. Other people\'s pain registers as my own.' },
    ] },
  { id: 'm6_ei_14', module: 6, quotient: 'EI', dimension: 'empathy', format: 'scenario',
    text: 'Your partner handles a situation completely differently than you would. Like, opposite approach. Can you respect it?',
    options: [
      { value: 1, label: 'Hard to. I\'d probably try to steer them my way.' },
      { value: 2, label: 'I\'d bite my tongue, but internally I\'d be judging a little' },
      { value: 3, label: 'I\'d respect it, but I\'d need to understand their reasoning' },
      { value: 4, label: 'Yes. Different doesn\'t mean wrong.' },
      { value: 5, label: 'Absolutely. I can hold their perspective without losing mine.' },
    ] },

  // ── emotional_regulation (continued) ──
  { id: 'm6_ei_15', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    text: 'You get a passive-aggressive text from your partner. The kind that\'s technically fine but you know what it means. What do you do?',
    options: [
      { value: 1, label: 'Match the energy. Two can play that game.' },
      { value: 2, label: 'Ignore it and hope it blows over' },
      { value: 3, label: 'Screenshot it and ask a friend what they think' },
      { value: 4, label: 'Call them directly. Texts can\'t resolve this.' },
      { value: 5, label: 'Name it calmly: "That felt off. Can we talk about what\'s really going on?"' },
    ] },
  { id: 'm6_ei_16', module: 6, quotient: 'EI', dimension: 'emotional_regulation', format: 'scenario',
    text: 'You\'re in a great mood and your partner comes home in a terrible one. How much does their energy shift yours?',
    options: [
      { value: 1, label: 'A lot. Their mood becomes my mood almost instantly.' },
      { value: 2, label: 'It pulls me down a bit. Hard not to absorb it.' },
      { value: 3, label: 'Somewhat. I\'m affected but I can hold my own center.' },
      { value: 4, label: 'Not much. I can be supportive without losing my vibe.' },
      { value: 5, label: 'I stay grounded. I can sit with their energy without taking it on.' },
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
  { id: 'm8_ic_03', module: 8, quotient: 'IC', dimension: 'desire_dynamics', format: 'scenario',
    text: 'How important is it that you and your partner openly discuss desires and boundaries in your intimate life?',
    options: [
      { value: 1, label: 'Not important at all. Some things are better left unspoken.' },
      { value: 2, label: 'Slightly important. I\'d rather things unfold naturally.' },
      { value: 3, label: 'Moderately important. A few key conversations go a long way.' },
      { value: 4, label: 'Very important. Clear communication makes everything better.' },
      { value: 5, label: 'Absolutely essential. Full openness about desires and boundaries is non-negotiable.' },
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
// VALIDITY CHECK ITEMS — Social Desirability Detection
// Sprinkle across modules to detect response bias
// A score of 5 on these items suggests the respondent
// is presenting an unrealistically favorable self-image
// ════════════════════════════════════════════
const VALIDITY_CHECKS: AssessmentQuestion[] = [
  { id: 'val_01', module: 1, quotient: 'VP', dimension: 'validity', format: 'scenario',
    validityCheck: true,
    text: 'I have never told even a small lie to someone I care about.',
    options: [
      { value: 1, label: 'Definitely not true. I\'ve told small lies like everyone.' },
      { value: 2, label: 'Rarely true. I try to be honest but nobody\'s perfect.' },
      { value: 3, label: 'Sometimes true. I avoid lying but it has happened.' },
      { value: 4, label: 'Mostly true. I almost never lie to people I love.' },
      { value: 5, label: 'Completely true. I have never lied to someone I care about.' },
    ] },
  { id: 'val_02', module: 2, quotient: 'AS', dimension: 'validity', format: 'scenario',
    validityCheck: true,
    text: 'I have never felt even slightly jealous in a relationship.',
    options: [
      { value: 1, label: 'Not true at all. Jealousy is a normal human feeling.' },
      { value: 2, label: 'Rarely true. I\'ve felt it even if I didn\'t act on it.' },
      { value: 3, label: 'Sometimes true. It depends on the relationship.' },
      { value: 4, label: 'Mostly true. I hardly ever feel jealous.' },
      { value: 5, label: 'Completely true. I have never experienced jealousy.' },
    ] },
  { id: 'val_03', module: 3, quotient: 'CC', dimension: 'validity', format: 'scenario',
    validityCheck: true,
    text: 'I always handle conflict perfectly without ever raising my voice or getting frustrated.',
    options: [
      { value: 1, label: 'Not true at all. Conflict is messy and I\'m human.' },
      { value: 2, label: 'Rarely true. I try but I definitely slip up.' },
      { value: 3, label: 'Sometimes true. I can stay calm in some situations.' },
      { value: 4, label: 'Mostly true. I almost never lose my composure.' },
      { value: 5, label: 'Completely true. I handle every conflict perfectly.' },
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
  ...VALIDITY_CHECKS,
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
  VALIDITY_CHECKS,
}

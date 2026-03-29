// CompatibleIQ -- Resonance Report Narrative Templates
// ~150 templates organized by dimension, score range, and purpose
// Variables use {variable_name} syntax, replaced at generation time

import type { ScoreRangeNarratives } from './types'

// ═══════════════════════════════════════════
// Dimension Compatibility Narratives
// Each dimension x 3 score ranges x 3-4 variants
// ═══════════════════════════════════════════

export const DIMENSION_NARRATIVES: Record<string, ScoreRangeNarratives> = {
  values: {
    high: [
      "Your values are remarkably aligned. You both prioritize {topSubScale} and share a deep, intuitive agreement on what matters most in life. This kind of alignment is the bedrock of a relationship that gets easier over time, not harder.",
      "When it comes to the big stuff -- what you stand for, where you're headed, how central the relationship is -- you two are reading from the same playbook. Your strongest overlap is in {topSubScale}, which means the decisions that break most couples will come naturally to you.",
      "This is rare. You both orient toward life with the same compass, especially around {topSubScale}. You won't spend years negotiating the non-negotiables, which frees you up to actually enjoy each other.",
      "Values alignment this strong means you're not just attracted to each other -- you're aimed in the same direction. Your shared conviction around {topSubScale} gives this connection a foundation that most couples spend years trying to build."
    ],
    medium: [
      "You share a solid foundation of values, though you diverge on {gapSubScale}. The good news: your core priorities overlap enough to build something real. The growth edge is learning how the other person's priorities aren't a threat to yours -- they're a different lens.",
      "Your values align where it counts, with genuine common ground in {topSubScale}. Where you differ -- {gapSubScale} -- isn't a dealbreaker, but it will require honest conversations early. Couples who name these differences thrive; couples who assume they'll resolve themselves don't.",
      "There's real compatibility in your value systems, anchored by your shared sense of {topSubScale}. The gap in {gapSubScale} is worth noting -- not because it's a problem, but because it's the kind of difference that feels small now and grows if you ignore it.",
    ],
    low: [
      "Your value systems have meaningful differences, particularly around {gapSubScale}. This doesn't mean you can't work -- it means you'll need to be intentional about respecting what the other person holds sacred, even when you don't share it.",
      "Values are the hardest thing to negotiate in a relationship, and you two see {gapSubScale} quite differently. The path forward isn't changing each other's minds -- it's deciding whether you can build a life that honors both perspectives.",
      "Where you agree on {topSubScale} gives you something to anchor to, but the gap on {gapSubScale} is real. This is the dimension that requires the most honest self-assessment: can you genuinely respect a worldview that differs from yours on something this fundamental?",
    ]
  },

  attachment: {
    high: [
      "Your attachment styles create a genuinely secure dynamic. You both bring the kind of emotional stability that lets the other person relax into the relationship instead of constantly monitoring it. This is the foundation that makes everything else easier.",
      "The way you each relate to closeness, space, and trust is remarkably compatible. Your attachment profiles suggest a relationship where neither person is chasing and neither is running -- you're both just... present.",
      "This is the attachment pairing that relationship researchers get excited about. You create emotional safety for each other naturally, which means your conflicts will resolve faster and your intimacy will deepen more easily.",
      "Your attachment compatibility is a genuine asset. The security you bring to each other means fewer misread signals, less unnecessary drama, and more energy for actually building something meaningful together."
    ],
    medium: [
      "Your attachment styles are workable, with some areas that will need awareness. Your strongest overlap is in {topSubScale}, which gives you a foundation of security. The difference in {gapSubScale} means one of you may occasionally need more reassurance or space than the other expects.",
      "There's a solid enough base here -- you're not locked into a pursue-withdraw cycle, which is the real danger zone. Your {topSubScale} alignment keeps things grounded, though the gap in {gapSubScale} will show up during stress.",
      "Your attachment pairing has real strengths, especially in {topSubScale}. The key to making this work is recognizing that when {gapSubScale} differences surface, it's not rejection or clinginess -- it's just a different nervous system responding to the same situation.",
    ],
    low: [
      "Your attachment styles create a dynamic that will require significant awareness and effort. The gap in {gapSubScale} means your default stress responses may trigger each other -- one pulling closer while the other pulls away, or both withdrawing simultaneously.",
      "This is the dimension where you'll need to be most intentional. Your {gapSubScale} difference creates a pattern where the very thing one of you does to feel safe may feel threatening to the other. The good news: attachment patterns can shift with awareness and effort.",
      "Attachment compatibility is tough to fake, and yours has some real tension points around {gapSubScale}. This isn't insurmountable -- plenty of couples with this dynamic thrive -- but it requires both of you to learn each other's emotional language instead of assuming your own is universal.",
    ]
  },

  communication: {
    high: [
      "You two communicate in a way that most couples spend years in therapy trying to achieve. Your repair skills are strong, your emotional expression is aligned, and your conflict approaches complement each other naturally. Arguments will happen -- but they won't define you.",
      "Your communication compatibility is exceptional. You both bring strong repair instincts and compatible expression styles, which means disagreements become opportunities to understand each other better rather than threats to the relationship.",
      "This is the communication dynamic that Gottman researchers would flag as highly promising. Your ability to fight well -- to repair, to express, to de-escalate -- is the single best predictor of whether a relationship survives the hard years.",
      "The way you handle conflict, express emotion, and repair after arguments is remarkably well-matched. You've got the communication toolkit that turns inevitable friction into deeper understanding."
    ],
    medium: [
      "Your communication styles are compatible enough to work well, with one key growth area: {gapSubScale}. Your strength in {topSubScale} will carry you through most disagreements, but you'll need to develop a shared playbook for the moments when your natural styles diverge.",
      "There's enough overlap in how you communicate to build a healthy dynamic, especially in {topSubScale}. The gap in {gapSubScale} is your homework -- not a problem to solve once, but a skill to practice together over time.",
      "You communicate differently in some important ways, but here's what matters: your {topSubScale} compatibility means you have the raw materials for productive conflict. The {gapSubScale} gap is where you'll do your growing.",
    ],
    low: [
      "Communication is your biggest growth area as a couple. The gap in {gapSubScale} means your default conflict patterns may escalate rather than resolve. The good news: communication is the most trainable dimension. Skills can be learned.",
      "Your communication styles create some real friction, especially around {gapSubScale}. Left unaddressed, this pattern tends to compound -- small misunderstandings become big resentments. But with awareness and practice, this is fixable.",
      "How you fight, make up, and express emotions is where you're least aligned. The {gapSubScale} difference is the core of it. The path forward is building a shared communication language -- literally agreeing on how you'll handle conflict before the next one arrives.",
    ]
  },

  emotional_intelligence: {
    high: [
      "You both bring high emotional intelligence to this relationship, and it shows. Your self-awareness, empathy, and emotional regulation are well-matched, creating a dynamic where both people feel seen and neither feels managed.",
      "This level of mutual EQ is genuinely uncommon. You both understand your own emotional patterns and can read each other's. This means fewer \"what's wrong? / nothing\" cycles and more real conversations.",
      "Your emotional intelligence alignment is a superpower. When both partners can name their feelings, regulate under stress, and extend genuine empathy, the relationship becomes a source of emotional growth rather than emotional labor.",
      "The EQ match here is striking. You're both operating at a level of emotional sophistication that means conflict stays productive, vulnerability feels safe, and neither person has to dumb down their emotional experience."
    ],
    medium: [
      "Your emotional intelligence levels are compatible, with your shared strength in {topSubScale} doing a lot of heavy lifting. The gap in {gapSubScale} means one of you may occasionally feel like they're doing more emotional work -- naming that dynamic early prevents resentment.",
      "There's genuine EQ compatibility here, especially in {topSubScale}. Where you differ on {gapSubScale}, think of it as a growth opportunity rather than a flaw -- the higher-EQ partner in that area can model, not manage.",
      "Your emotional intelligence profiles complement each other well enough to build a healthy dynamic. The {topSubScale} alignment keeps you grounded. The {gapSubScale} difference is where patience and grace will matter most.",
    ],
    low: [
      "Emotional intelligence is where you'll need the most intentional growth. The gap in {gapSubScale} means emotional situations may feel harder than they need to -- one of you processing faster or deeper while the other struggles to keep up.",
      "Your EQ profiles suggest some real mismatches in how you process and express emotions, especially around {gapSubScale}. This creates a dynamic where one person may feel emotionally invisible while the other feels emotionally overwhelmed.",
      "This dimension asks for the most honest self-reflection. The difference in {gapSubScale} will show up in every argument, every vulnerable moment, every time one of you needs the other to just get it. The gap can close, but both people have to want it to.",
    ]
  },

  lifestyle_ambition: {
    high: [
      "Your lifestyles are remarkably aligned. You want the same pace, the same social energy, and the same kind of future. This means fewer arguments about how to spend your weekends and more time actually enjoying them together.",
      "Lifestyle compatibility this strong is underrated. While everyone focuses on chemistry, this is what determines whether you actually enjoy daily life together. You're aligned on {topSubScale}, which means your default Saturdays look similar.",
      "You two want the same kind of life -- the same rhythm, the same balance of social and solo, the same relationship between ambition and ease. This is the dimension that makes a relationship feel effortless on an ordinary Tuesday.",
      "Your lifestyle alignment means you won't slowly erode each other's energy. You both want similar things from your day-to-day, and that quiet compatibility is worth more than any amount of initial spark."
    ],
    medium: [
      "Your lifestyles overlap well, with a shared approach to {topSubScale} that keeps your daily rhythms in sync. The difference in {gapSubScale} is manageable but worth discussing early -- it's the kind of thing that doesn't cause fights but does cause quiet frustration.",
      "There's real compatibility in how you want to live your lives, anchored by {topSubScale}. The {gapSubScale} gap isn't dramatic, but it's the kind of difference that shows up every weekend. Better to name it now than resent it later.",
      "You're close enough in lifestyle to enjoy daily life together, with {topSubScale} as your anchor. The divergence on {gapSubScale} is your negotiation point -- not a conflict, but a conversation you'll want to have intentionally.",
    ],
    low: [
      "Your lifestyles are notably different, particularly around {gapSubScale}. One of you wants more stimulation, social energy, or ambition than the other, and that gap will surface in how you spend your time, energy, and weekends.",
      "Lifestyle mismatch doesn't cause explosions -- it causes erosion. Your difference in {gapSubScale} means one of you may consistently feel dragged along or held back. The question is whether you can build a life that genuinely works for both rhythms.",
      "This is the dimension that shows up in the mundane moments: Saturday mornings, vacation planning, career conversations. Your gap on {gapSubScale} is real, and it's the kind that grows quietly unless you build intentional compromises.",
    ]
  },

  love_languages: {
    high: [
      "The way you naturally express love is exactly what the other person needs to feel it. This give-receive alignment means affection won't get lost in translation -- what you offer will actually land.",
      "Your love language compatibility is exceptional. You instinctively show love in the way your partner most values receiving it. This kind of alignment means your effort actually registers -- no wasted gestures, no unmet needs.",
      "Most couples have to learn each other's love languages through trial and error. You two are starting with a natural advantage: what feels like love to you is what the other person is already offering.",
      "Your love languages create a virtuous cycle -- the more naturally you express affection, the more your partner feels loved, the more they reciprocate in your language. This dynamic builds momentum instead of frustration."
    ],
    medium: [
      "Your love language compatibility has real strengths, with some areas where you'll need to stretch. The good news: your flexibility scores suggest you're both willing to adapt how you show love, which compensates for any give-receive mismatch.",
      "There's a partial love language match here that works in your favor, and both of you show the kind of flexibility that bridges the gap. You may need to explicitly tell each other what makes you feel most loved -- but you'll both actually listen.",
      "Your love languages don't perfectly align, but your willingness to adapt is high. The couples who struggle with love languages aren't the ones who differ -- they're the ones who refuse to learn. You two don't have that problem.",
    ],
    low: [
      "Your love languages are notably different -- what feels like love to you may not register at all for your partner, and vice versa. The path forward is explicit communication: telling each other exactly what you need instead of hoping they'll intuit it.",
      "This is the dimension where effort matters more than instinct. Your natural ways of expressing love don't align with what the other person most values receiving. The fix is straightforward but requires intentionality: learn their language and practice it.",
      "Love language mismatch creates a frustrating dynamic where both people feel like they're giving and neither feels like they're receiving. Your gap here is real but solvable -- the key is translating intention into the format your partner actually absorbs.",
    ]
  }
}

// ═══════════════════════════════════════════
// User Profile Templates (per dimension)
// 2-3 sentence profiles describing each user
// ═══════════════════════════════════════════

export const USER_PROFILE_TEMPLATES: Record<string, Record<string, string[]>> = {
  values: {
    high_career: [
      "{name} is driven by career ambition and building something meaningful. They prioritize growth, achievement, and financial independence, and they expect a partner who understands that drive.",
    ],
    high_family: [
      "{name} is deeply family-oriented, envisioning a life anchored by close relationships and shared rituals. The relationship isn't a part of their life -- it's the organizing principle.",
    ],
    high_adventure: [
      "{name} craves novelty and experience. They'd rather have an unpredictable, adventure-filled life than a comfortable, predictable one. Routine is the enemy.",
    ],
    high_stability: [
      "{name} values security, planning, and building a solid foundation. They find comfort in knowing what's ahead and making deliberate choices that compound over time.",
    ],
    high_moral: [
      "{name} holds strong moral convictions -- honesty, fairness, and loyalty aren't just preferences, they're non-negotiables. They notice how people treat others and hold themselves to the same standard.",
    ],
    moderate: [
      "{name} has a balanced value system that doesn't skew heavily in any one direction. They're adaptable in their priorities, which can be an asset -- or a sign they haven't had to choose yet.",
    ],
    high_relationship_priority: [
      "{name} puts the relationship at the center of their life. They want a partner who shows up fully, checks in before major decisions, and treats the relationship as the main event -- not a side plot.",
    ],
    low_relationship_priority: [
      "{name} values independence within a relationship. They need space for their own friendships, goals, and identity, and they see a great partnership as something that enhances an already full life.",
    ],
  },

  attachment: {
    secure: [
      "{name} brings a secure attachment style to relationships. They're comfortable with both closeness and independence, trust their partner's intentions, and can self-soothe during conflict without withdrawing or escalating.",
    ],
    anxious_preoccupied: [
      "{name} tends toward an anxious attachment pattern -- they crave closeness, need more reassurance than average, and can interpret silence or distance as rejection. When they feel secure, they're deeply attentive partners.",
    ],
    dismissive_avoidant: [
      "{name} leans toward avoidant attachment -- they value independence, can find too much closeness suffocating, and may withdraw under emotional pressure. When they trust, though, their loyalty runs deep.",
    ],
    fearful_avoidant: [
      "{name} has a fearful-avoidant attachment pattern -- they want closeness but are wary of it. This creates an approach-avoid cycle that can be confusing for partners. With self-awareness, this pattern can evolve.",
    ],
    earned_secure: [
      "{name} has earned security -- they've done the inner work to develop a secure base despite earlier patterns. This self-awareness is a genuine relationship asset.",
    ],
  },

  communication: {
    confronter: [
      "{name} is a direct communicator who leans into conflict. When something's wrong, they bring it up -- even at the risk of starting an argument. They'd rather fight it out than let resentment build.",
    ],
    avoider: [
      "{name} tends to avoid conflict, preferring to let things settle rather than hash them out in the moment. This isn't about weakness -- it's a genuine preference for processing internally first.",
    ],
    collaborator: [
      "{name} approaches conflict as a problem to solve together. They're naturally inclined toward compromise and finding solutions that work for both people -- even if it takes longer.",
    ],
    accommodator: [
      "{name} tends to accommodate in conflict, prioritizing their partner's comfort over their own position. This can be generous or self-sacrificing depending on whether it's a choice or a pattern.",
    ],
    high_repair: [
      "Notably, {name} scores very high on repair attempts -- they're quick to reach out after a fight, able to apologize genuinely, and don't hold grudges.",
    ],
    low_repair: [
      "One area to watch: {name} scores lower on repair attempts, meaning they may struggle to be the first to reconnect after conflict or to let go of grievances quickly.",
    ],
    high_expression: [
      "{name} is emotionally transparent -- their partner always knows where they stand. They share openly and expect the same in return.",
    ],
    low_expression: [
      "{name} tends to keep their emotional cards close. They process internally and may say \"I'm fine\" when they're not. Partners sometimes wish they were easier to read.",
    ],
  },

  emotional_intelligence: {
    high: [
      "{name} demonstrates strong emotional intelligence across the board. They understand their own triggers, can read their partner's emotional state, and regulate effectively under stress.",
    ],
    moderate: [
      "{name} shows solid emotional intelligence with room to grow. Their strongest area is {topSubScale}, while {gapSubScale} is where they'll benefit most from intentional development.",
    ],
    low: [
      "{name} is still developing their emotional intelligence toolkit, particularly around {gapSubScale}. This doesn't mean they don't care -- it means the skills need building.",
    ],
  },

  lifestyle_ambition: {
    high_pace: [
      "{name} runs at a fast pace -- they're ambitious, action-oriented, and restless when things slow down. Their ideal weekend is packed, not open-ended.",
    ],
    low_pace: [
      "{name} prefers a measured, intentional pace of life. They value presence over productivity and would rather do less, better, than cram every moment full.",
    ],
    high_social: [
      "{name} thrives on social energy -- they want an active social life as a couple, love hosting and going out, and recharge through connection with others.",
    ],
    low_social: [
      "{name} needs significant solo time to feel like themselves. They're selectively social and would often choose a quiet night in over a dinner party.",
    ],
    high_future: [
      "{name} is a planner with a clear vision for where they're headed. They track goals, think in five-year increments, and want a partner who matches their ambition.",
    ],
    low_future: [
      "{name} takes life as it comes. They trust spontaneity over planning and believe the best things in life aren't mapped out in advance.",
    ],
  },

  love_languages: {
    words_of_affirmation: [
      "{name}'s primary love language is Words of Affirmation. They feel most loved when their partner is specific, verbal, and expressive about what they appreciate and admire.",
    ],
    acts_of_service: [
      "{name}'s primary love language is Acts of Service. Actions speak louder than words for them -- when a partner handles responsibilities or takes something off their plate, that's love.",
    ],
    receiving_gifts: [
      "{name}'s primary love language is Receiving Gifts. It's not about the price tag -- it's about a partner who noticed, remembered, and translated that into something tangible.",
    ],
    quality_time: [
      "{name}'s primary love language is Quality Time. Undivided attention, phones away, fully present -- that's what makes them feel most connected.",
    ],
    physical_touch: [
      "{name}'s primary love language is Physical Touch. Holding hands, a hand on the small of the back, pulling close without being asked -- that's how they feel loved.",
    ],
  },
}

// ═══════════════════════════════════════════
// Strength Narratives (top 3 dimensions)
// 3 variants per dimension = 18 templates
// ═══════════════════════════════════════════

export const STRENGTH_NARRATIVES: Record<string, string[]> = {
  values: [
    "You both operate from the same value system, which is the single strongest predictor of long-term relationship success. When the big decisions arrive -- career moves, family planning, financial priorities -- you'll be working from shared assumptions instead of competing worldviews.",
    "Your values alignment means the things that matter most to you are the same things that matter most to them. This creates a relationship where you feel understood at the deepest level, not just the surface.",
    "Shared values are the one thing couples can't manufacture through effort alone. You either see the world the same way or you don't. You do -- and that's your greatest asset.",
  ],
  attachment: [
    "Your attachment compatibility creates a naturally secure dynamic. Neither of you has to work overtime to feel safe, which frees up emotional energy for growth, fun, and deepening intimacy.",
    "The way you each handle closeness and space is remarkably complementary. You create a natural rhythm of connection and independence that feels organic, not negotiated.",
    "Attachment security is the invisible infrastructure of a great relationship. Yours is solid, which means conflict won't spiral, vulnerability won't backfire, and trust will build faster than average.",
  ],
  communication: [
    "How you fight -- and more importantly, how you make up -- is your superpower as a couple. Your communication styles create a natural repair cycle that turns disagreements into deeper understanding.",
    "Your communication compatibility means you can have the hard conversations without them becoming relationship-threatening events. This skill compounds over time -- the more you practice it, the safer it gets.",
    "Most couples name communication as their biggest challenge. For you two, it's actually a strength. Your natural styles of expressing, confronting, and repairing complement each other beautifully.",
  ],
  emotional_intelligence: [
    "You both bring high emotional intelligence to this relationship, which means fewer blind spots, faster recovery from conflict, and a deeper capacity for genuine intimacy.",
    "Your mutual EQ is a force multiplier. When both people can name what they feel, regulate under stress, and extend real empathy, the relationship becomes a source of emotional growth rather than emotional labor.",
    "Emotional intelligence isn't just about understanding feelings -- it's about navigating them skillfully. You both do this well, which creates a relationship where vulnerability feels safe and conflict stays productive.",
  ],
  lifestyle_ambition: [
    "You want the same kind of life. That sounds simple, but it's the thing that determines whether your daily experience together feels like teamwork or tug-of-war. Your aligned lifestyle means more enjoying, less negotiating.",
    "Lifestyle compatibility is what makes a relationship feel easy. You share a similar pace, similar social needs, and a similar vision for the future -- which means your default days together actually look alike.",
    "While other couples argue about how to spend their weekends, you'll be spending them the same way. Your lifestyle alignment eliminates the quiet friction that erodes so many otherwise strong connections.",
  ],
  love_languages: [
    "The way you naturally show love is exactly what the other person needs to feel it. This give-receive alignment means your affection actually lands -- no wasted effort, no missed signals.",
    "Your love language compatibility means you'll spend less time guessing what the other person needs and more time actually meeting those needs. It's the difference between effort that registers and effort that gets lost in translation.",
    "Love language alignment this strong is rare. Most couples have to deliberately learn each other's language -- you two are already speaking it naturally.",
  ],
}

// ═══════════════════════════════════════════
// Friction Narratives (bottom 2 dimensions)
// 3 variants per dimension = 18 templates
// ═══════════════════════════════════════════

export const FRICTION_NARRATIVES: Record<string, string[]> = {
  values: [
    "Your values don't fully align, and that's the one area where compromise has limits. You can negotiate habits and preferences, but core beliefs about what matters in life need genuine respect, not reluctant tolerance. The conversation to have now: where are you flexible, and where are you not?",
    "Values differences are the slow-burn challenge of relationships. You won't fight about them daily, but they'll shape every major decision. Start by understanding each other's non-negotiables -- not to change them, but to know where the real boundaries are.",
    "The gap in your values is worth taking seriously -- not as a dealbreaker, but as something that requires ongoing dialogue. The couples who thrive with value differences are the ones who stop trying to convert each other and start trying to understand.",
  ],
  attachment: [
    "Your attachment styles create a dynamic that will need conscious navigation. When stress hits, your default responses may pull you in opposite directions. The antidote is learning each other's nervous system -- not just their words, but what they need when they're triggered.",
    "Attachment mismatch is the source of the \"why are we having the same fight again?\" cycle. Your patterns may lock into a chase-distance dynamic under stress. Breaking that cycle starts with both of you naming what you need instead of reacting to what you fear.",
    "Your attachment styles are the dimension most likely to create recurring friction. The key insight: what feels like rejection to one of you may be the other person's way of self-regulating. Naming this pattern out loud is the first step toward changing it.",
  ],
  communication: [
    "Communication style is where you'll need to do the most intentional work. Your natural approaches to conflict, expression, and repair don't fully mesh. The good news: this is the most trainable dimension. Consider it a skill to build together, not a flaw to fix.",
    "How you handle disagreements is your primary growth edge. Left on autopilot, your communication styles may create a pattern where arguments feel unproductive or unresolved. The fix: build explicit agreements about how you'll fight before the next fight happens.",
    "Your communication gap is real but fixable. The most important thing isn't matching styles -- it's building a shared repair practice. If you can learn to consistently reconnect after conflict, the style difference matters much less.",
  ],
  emotional_intelligence: [
    "Emotional intelligence is where you have the most room to grow together. The gap in your EQ levels means one of you may feel like they're doing more emotional heavy-lifting. The fix: the higher-EQ partner models, not manages; the lower-EQ partner stays curious, not defensive.",
    "Your EQ difference will show up in vulnerable moments -- when one of you needs the other to just get it and the other person genuinely doesn't. Patience and explicit communication bridge this gap, but it takes both people being willing to stretch.",
    "EQ mismatches create a specific kind of loneliness in a relationship -- feeling emotionally seen by your partner some of the time but not all of it. Building this dimension together is possible, but it requires treating emotional skills like any other skill: learn, practice, repeat.",
  ],
  lifestyle_ambition: [
    "Your lifestyles are where you'll find the most day-to-day friction. It's not dramatic -- it's the slow accumulation of mismatched weekends, different social needs, and divergent relationships with ambition. The conversation to have: what does a good week look like for each of you?",
    "Lifestyle mismatch is death by a thousand paper cuts. You won't break up over it, but you might start resenting the other person's idea of a good time. The fix: build a shared weekly rhythm that gives both of you enough of what you need.",
    "Your lifestyle gap is the dimension most likely to cause quiet dissatisfaction. One of you wants more stimulation, social energy, or planning than the other. Name it, negotiate it, and build intentional compromises before it becomes a sore spot.",
  ],
  love_languages: [
    "Your love languages are mismatched, which means your natural expressions of love may not register with your partner. The fix is surprisingly simple: ask each other \"what makes you feel most loved?\" and then actually do that thing, even when it doesn't come naturally.",
    "Love language differences create a frustrating dynamic where both people feel like they're giving but neither feels like they're receiving. Your task: learn each other's language and practice it deliberately. It feels awkward at first and becomes natural with repetition.",
    "Your love language gap is your most actionable growth area. Unlike values or attachment, this one has a clear, concrete solution: learn what your partner needs, tell them what you need, and practice showing up in each other's language consistently.",
  ],
}

// ═══════════════════════════════════════════
// Conversation Starters (5 per dimension)
// ═══════════════════════════════════════════

export const CONVERSATION_STARTERS: Record<string, string[]> = {
  values: [
    "Ask {partnerName} to describe their ideal life in 10 years -- not their career, but the shape of a regular Thursday. Their answer will reveal more about their priorities than any direct question.",
    "You both scored {scoreLabel} on values alignment. Ask them: \"What's one thing you'd never compromise on in a relationship, even if everything else was perfect?\"",
    "Try this one over dinner: \"If you had to choose between a once-in-a-lifetime opportunity and stability with someone you love, which way do you lean?\" Their instinct matters more than their answer.",
    "Ask {partnerName}: \"What's the most important thing your parents got right about how they lived? And what would you do differently?\" Values are inherited, but the best ones are chosen.",
    "You share strong values around {topSubScale}. Ask them: \"When did you first realize that was non-negotiable for you?\" The story behind the value is where the real connection happens.",
  ],
  attachment: [
    "Ask {partnerName}: \"When you're stressed about the relationship, what do you need most -- space to think or closeness to feel safe?\" Their answer is the cheat code to their attachment style.",
    "Try this: \"What does a partner do that makes you feel truly secure?\" Listen for specific behaviors, not abstractions. That's their attachment language.",
    "Ask them: \"Think about your best relationship moment. What was happening, and why did it feel so good?\" Secure attachment is built in moments like the one they describe.",
    "You scored {scoreLabel} on attachment compatibility. Ask: \"When we disagree, what's the one thing I could do that would help you feel like we're still okay?\"",
    "Over a relaxed moment, ask: \"Do you tend to move toward people or away from people when you're upset?\" Their self-awareness about this pattern tells you a lot.",
  ],
  communication: [
    "Ask {partnerName}: \"When you're upset about something in a relationship, how long do you usually need before you're ready to talk about it?\" Respecting that timeline prevents 80% of communication conflicts.",
    "Try this: \"What's the worst way a past partner handled a disagreement with you?\" What they describe is the thing they're most vigilant about -- and the thing you should avoid.",
    "You scored {scoreLabel} on communication. Ask: \"If I do something that bothers you, would you rather I bring it up immediately or wait for a calm moment?\"",
    "Ask them: \"Do you feel more understood when someone validates your feelings first, or when they jump to solving the problem?\" This one question prevents years of miscommunication.",
    "Over coffee, ask: \"What does a good apology look like to you?\" Everyone has a different repair language, and knowing theirs will serve you for the entire relationship.",
  ],
  emotional_intelligence: [
    "Ask {partnerName}: \"When you're having a bad day, what helps most -- talking about it, being distracted from it, or just having someone nearby?\" EQ compatibility starts with knowing this.",
    "Try: \"What emotion is hardest for you to express in a relationship?\" Their answer reveals their growing edge -- and your opportunity to make them feel safe.",
    "You scored {scoreLabel} on emotional intelligence compatibility. Ask: \"What's something you've learned about yourself emotionally in the last few years?\" Growth-oriented people make the best partners.",
    "Ask them: \"Can you usually tell why you're in a bad mood, or does it sometimes feel random?\" Self-awareness is the foundation of EQ -- their answer tells you where they are on that spectrum.",
    "Over a walk, ask: \"How do you know when you're starting to shut down emotionally?\" Partners who can name their patterns can change them.",
  ],
  lifestyle_ambition: [
    "Ask {partnerName} about their ideal Sunday morning -- the one with zero obligations. Their answer reveals everything about their pace-of-life preference.",
    "You scored {scoreLabel} on lifestyle compatibility. Ask: \"If you could design the perfect weekend with a partner, what would Saturday look like? What about Sunday?\"",
    "Try: \"How do you feel about having a packed social calendar as a couple versus more nights in, just the two of you?\" This question surfaces social energy compatibility instantly.",
    "Ask them: \"Where do you see yourself career-wise in five years -- and how much does that matter to you?\" Ambition alignment (or comfortable misalignment) is worth establishing early.",
    "Over dinner, ask: \"Do you recharge by doing things or by doing nothing?\" Simple question, profound implications for how you'll share your lives.",
  ],
  love_languages: [
    "Ask {partnerName}: \"What's the most loved you've ever felt in a relationship? What was the person doing?\" Their answer is their love language in action.",
    "You scored {scoreLabel} on love language compatibility. Ask: \"If I could only show you I love you in one way for the rest of our lives, what would you want that way to be?\"",
    "Try: \"Do you feel more loved when someone tells you how they feel about you, or when they show it through actions?\" This binary question cuts to the core of their receiving language.",
    "Ask them: \"What's something small a partner did that made you feel incredibly loved?\" The \"small\" detail is the real data -- it reveals their primary language without them having to categorize it.",
    "Over a quiet moment, ask: \"Is there a way past partners have tried to show love that didn't really land for you?\" What doesn't work is just as revealing as what does.",
  ],
}

// ═══════════════════════════════════════════
// Trajectory Templates
// 3 phases x 3 score ranges = 9 templates
// ═══════════════════════════════════════════

export const TRAJECTORY_TEMPLATES = {
  earlyPhase: {
    high: [
      "Your first three months should feel unusually natural. With strong alignment across your core dimensions, the typical early-relationship anxiety -- \"do they really like me?\" \"are we compatible?\" -- will be quieter than usual. Use this ease to build real intimacy, not just comfort. The danger of high compatibility isn't conflict -- it's coasting.",
      "The early phase will likely feel like a relief -- the kind of connection where you don't have to perform or filter. Your compatibility means the getting-to-know-you phase will go deeper faster. Lean into that. Ask the hard questions now while everything feels safe.",
      "Expect the first few months to feel surprisingly easy. Your alignment means fewer miscommunications and more moments of \"you get me.\" The one thing to watch: don't mistake compatibility for completion. You're well-matched, not finished products.",
    ],
    medium: [
      "Your first three months will have a healthy mix of connection and discovery. You'll find real common ground quickly, especially around your strongest dimensions. You'll also notice some differences that need navigating. The key: address them with curiosity now, before they harden into patterns.",
      "The early phase will feel exciting with some productive friction. Your compatibility gives you enough common ground to build trust, while your differences give you enough to learn about. Treat the friction as information, not warning signs.",
      "Expect the first few months to be engaging -- not effortless, but rewarding. You'll click on the things that matter most and bump up against a few differences that require conversation. That's actually ideal: too much ease means you're not going deep enough.",
    ],
    low: [
      "The first three months will require more intentional effort than average. Your differences will surface early, and how you handle them will set the tone for everything that follows. The couples who make it through compatibility gaps aren't the ones who ignore them -- they're the ones who name them honestly.",
      "Your early phase will feel stimulating but challenging. The attraction may be strong, but you'll notice differences in daily rhythms and emotional patterns that need addressing. Don't panic -- just communicate. Early honesty prevents late resentment.",
      "Expect the first few months to test your communication skills. Your compatibility profile suggests you'll need to build understanding actively rather than assuming it. This isn't a flaw -- it's just a relationship that requires more intention and less autopilot.",
    ],
  },
  buildingPhase: {
    high: [
      "Between months three and twelve, your relationship should deepen naturally. Your strong foundation means you can start having the conversations that scare most couples -- future plans, dealbreakers, real vulnerability -- without them feeling like a test. This is where your compatibility stops being a feeling and starts being a partnership.",
      "The building phase is where high-compatibility couples have the biggest advantage: you can focus on growing together instead of just getting along. Use this period to build shared rituals, navigate your first real disagreements, and establish how you'll handle the hard stuff.",
      "Months 3-12 will likely feel like your relationship is gaining momentum rather than losing it. Your alignment means the deepening process feels natural, not forced. The one risk: avoid the trap of assuming you don't need to work at it because it feels easy.",
    ],
    medium: [
      "The 3-12 month window is your development phase. Your strengths will solidify, and your growth areas will demand attention. This is normal and healthy. The couples who use this period to build communication practices around their differences end up stronger than couples who had no differences to navigate.",
      "Between months three and twelve, expect your relationship to oscillate between \"we're perfect together\" and \"we're so different.\" Both are true. Your job in this phase is to build a shared language for navigating the gaps while reinforcing the strengths.",
      "The building phase is where your relationship's real character emerges. You'll need to have some uncomfortable conversations about the areas where you don't naturally align. The payoff: a relationship built on honesty rather than hopeful assumptions.",
    ],
    low: [
      "Months 3-12 are critical. Your compatibility gaps will become harder to ignore and easier to resent. This is the make-or-break phase: couples who commit to understanding each other's differences -- really understanding, not just tolerating -- build something resilient. Couples who hope the differences will fade usually fade themselves.",
      "The building phase will test whether your connection is strong enough to hold your differences. You'll need structured conversations, mutual flexibility, and probably some moments of real frustration. The question isn't whether you'll struggle -- it's whether you'll struggle together or apart.",
      "Between months three and twelve, your relationship will require above-average effort. The compatibility gaps won't resolve themselves -- they need active navigation. Consider building explicit agreements about your highest-friction areas before they become recurring arguments.",
    ],
  },
  longTerm: {
    high: [
      "Long-term, you have the compatibility profile that research associates with lasting satisfaction. Your aligned values, compatible emotional styles, and shared vision for life create a flywheel: the longer you're together, the more your compatibility compounds. The relationships that look like this at the data level tend to be the ones people describe as \"it just works.\"",
      "Your long-term outlook is genuinely strong. The dimensions where you're aligned are the ones that predict staying power -- values, attachment, and communication. As life throws curveballs (career changes, family shifts, personal growth), your shared foundation will adapt rather than crack.",
      "A year and beyond, your relationship has the kind of structural integrity that weathers real life. You're not just compatible in the honeymoon phase -- you're compatible in the messy, unglamorous, \"who's picking up the kids\" phase. That's the compatibility that actually matters.",
    ],
    medium: [
      "Long-term, your relationship has a solid base with some areas that will require ongoing attention. The good news: the dimensions where you're strong are strong enough to carry you through the inevitable challenges. The dimensions where you diverge will need periodic recalibration, not just one-time fixes.",
      "Your long-term trajectory is positive but not automatic. The compatibility you have provides a strong starting point; the areas where you differ will require the kind of intentional, ongoing conversation that most couples avoid until it's too late. Don't be most couples.",
      "Over the long haul, your relationship will likely find a rhythm that works -- but it'll take active building, not passive hoping. Your strengths provide enough common ground to weather storms, and your growth areas provide enough challenge to keep you both engaged.",
    ],
    low: [
      "Long-term success with your compatibility profile isn't impossible, but it requires both partners to commit to ongoing growth. The couples who make this work are the ones who treat their differences as a project they're working on together -- not as evidence that they chose wrong.",
      "Your long-term trajectory depends heavily on what you both do in the first year. If you build strong communication practices and genuine respect for each other's differences early, you can create a relationship that's more resilient than one that was easy from the start. If you don't, the gaps will widen.",
      "Over the long term, your relationship will need more intentional maintenance than a higher-compatibility pairing. That's not a death sentence -- some of the deepest relationships are the ones that required the most deliberate work. But it is a commitment, and both people have to make it.",
    ],
  },
}

// ═══════════════════════════════════════════
// Overall Summary Templates
// ═══════════════════════════════════════════

export const OVERALL_SUMMARY_TEMPLATES = {
  rare: [
    "You and {partnerName} scored {score}/100 -- placing you in the Rare tier. This level of compatibility appears in roughly 8% of matches. Your strongest alignment is in {topDimension}, while your main growth area is {bottomDimension}. This is a connection worth investing in.",
    "With a score of {score}/100, you and {partnerName} are in Rare territory. Your compatibility is exceptional across nearly every dimension, with particular strength in {topDimension}. Even your lowest dimension -- {bottomDimension} -- is above average. This is the real deal.",
  ],
  synergistic: [
    "You and {partnerName} scored {score}/100 -- placing you in the Synergistic tier. Your strongest alignment is in {topDimension}, which gives you a powerful foundation. Your main growth area is {bottomDimension}, where some intentional attention will pay dividends.",
    "At {score}/100, you and {partnerName} are a Synergistic match. You're aligned where it matters most, especially in {topDimension}, and your growth area in {bottomDimension} is the kind of challenge that strengthens relationships when both people lean in.",
  ],
  compatible: [
    "You and {partnerName} scored {score}/100 -- placing you in the Compatible tier. You have real common ground, particularly in {topDimension}, and meaningful differences in {bottomDimension} that will require honest conversation and mutual flexibility.",
    "At {score}/100, you and {partnerName} are Compatible. Your {topDimension} alignment is a genuine strength. Your {bottomDimension} gap is worth taking seriously -- not as a dealbreaker, but as the area where your relationship will do its growing.",
  ],
  misaligned: [
    "You and {partnerName} scored {score}/100, which places you in the Misaligned tier. Your strongest overlap is {topDimension}, and your most significant gap is in {bottomDimension}. This doesn't mean the connection isn't real -- it means it will require above-average effort and self-awareness from both of you.",
    "At {score}/100, you and {partnerName} face some genuine compatibility challenges, particularly around {bottomDimension}. Your {topDimension} alignment gives you something to build on, but this relationship will need intentional work to thrive.",
  ],
}

// ═══════════════════════════════════════════
// Helper: Score range label mapping
// ═══════════════════════════════════════════

export const SCORE_LABELS: Record<string, string> = {
  high: 'strongly',
  medium: 'moderately',
  low: 'differently',
}

# Te Reo Academy - Game Requirements

## Core Gameplay Requirements

### 1. Card Distribution Guarantee

**REQUIREMENT**: Every challenge MUST provide the player with at least one card of each color/type needed to complete the target sentence.

**Implementation**:
- The `requiredCards` array contains ALL word IDs needed for the target sentence
- These cards are ALWAYS included in the player's hand
- Variation cards (similar words of the same type) are added for difficulty
- Total hand = Required cards + Variation cards (2 per type when available)

**Example**:
```
Target: "I kai au" (I ate)
Required: I (tense_marker), kai (verb), au (pronoun)
Hand includes:
  - I (yellow, tense_marker) - REQUIRED
  - kai (green, verb) - REQUIRED
  - au (red, pronoun) - REQUIRED
  - Kua (yellow, tense_marker) - VARIATION
  - Ka (yellow, tense_marker) - VARIATION
  - haere (green, verb) - VARIATION
  - mahi (green, verb) - VARIATION
  - koe (red, pronoun) - VARIATION
  - ia (red, pronoun) - VARIATION
```

**Guarantees**:
1. ✅ Player ALWAYS has the correct cards to complete the sentence
2. ✅ Variation cards make it challenging (must select correct words)
3. ✅ No impossible challenges (missing required cards)
4. ✅ Consistent difficulty (2 variations per type)

### 2. Card Color Coding

Cards are color-coded by type for visual learning:

| Color | Type | Examples | Modules |
|-------|------|----------|---------|
| **Purple** | Particles | Ko, He | 1 |
| **Gray** | Articles | te, ngā | 1 |
| **Blue** | Nouns | whare, kuri, kura | 1, 2 |
| **Red** | Pronouns | au, koe, ia, mātou | 1, 2 |
| **Orange** | Demonstratives | tēnei, tēnā, tērā | 1 |
| **Yellow** | Tense Markers | Kei te, I, Kua, Ka | 2, 3 |
| **Green** | Verbs | kai, haere, mahi | 2 |
| **Light Blue** | Adjectives | pai, harikoa, ngenge | 2 |
| **Pink** | Intensifiers | tino, āhua | 2 |
| **Brown** | Locatives | i, ki | 2 |
| **Teal** | Time Words | inanahi, āpōpō, ināianei | 3 |

### 3. Challenge Difficulty Progression

**Easy** (Tutorial/Practice):
- 2-3 card sentences
- 1-2 variation cards per type
- Clear hints provided

**Medium** (Practice):
- 3-4 card sentences
- 2 variation cards per type
- Moderate hints

**Hard** (Challenge):
- 4-6 card sentences
- 2-3 variation cards per type
- Minimal hints

### 4. Validation Patterns Supported

The system supports 7 validation patterns:

1. **Ko** - Identity sentences (Ko + te/ngā + noun)
2. **He** - Classification sentences (He + noun + pronoun/demonstrative)
3. **Equative** - Ko + pronoun + te/ngā + noun
4. **Kei te** - Present continuous (Kei te + verb/adj + pronoun)
5. **Past Tense** - I/Kua + verb + pronoun
6. **Future Tense** - Ka + verb + pronoun
7. **Mixed Tense** - Combination of past/present/future

### 5. Word Library Coverage

**Total Words**: 63 across 3 modules

**Module 1** (21 words):
- 2 particles, 2 articles, 11 nouns, 3 pronouns, 3 demonstratives

**Module 2** (35 words):
- 1 tense marker, 10 adjectives, 7 verbs, 2 locatives, 2 intensifiers, 2 nouns, 4 pronouns (plural), 7 verbs

**Module 3** (7 words):
- 3 tense markers (I, Kua, Ka), 4 time words

**Note**: Module 3 challenges can use words from Modules 1 & 2 (verbs, pronouns, etc.)

## Technical Implementation

### Card Generation Process

```typescript
// 1. Parse target sentence into words
const words = targetMaori.split(' ');

// 2. Map each word to its word library ID
const requiredCards = words.map(word => getWordId(word));

// 3. Find all unique types in sentence
const types = new Set(requiredCards.map(id => getWordById(id).type));

// 4. Add variation cards (2 per type)
const variationCards = types.flatMap(type =>
  getWordsByType(type)
    .filter(w => !requiredCards.includes(w.id))
    .slice(0, 2)
    .map(w => w.id)
);

// 5. Combine and shuffle
const allCards = [...requiredCards, ...variationCards];
const shuffled = shuffle(allCards);
```

### Validation Process

```typescript
// 1. User builds sentence by placing cards in slots
const userSentence = sentenceSlots.map(card => card.maori).join(' ');

// 2. Route to appropriate validator based on pattern_type
const validator = getValidator(challenge.pattern_type);

// 3. Validate and provide feedback
const result = validator.validate(userSentence, challenge.target);

// 4. Show feedback to user
displayFeedback(result);

// 5. Save progress to database
saveAttempt(lessonId, challengeId, result.isCorrect);
```

## Quality Assurance

### Testing Checklist

For each new challenge:

- [ ] All required cards appear in hand
- [ ] At least 2 variation cards per type (when available)
- [ ] Sentence can be completed with provided cards
- [ ] Validation works correctly
- [ ] Feedback is helpful and accurate
- [ ] Progress saves to database
- [ ] Colors match word types correctly

### Known Edge Cases

1. **Single-word types**: Some types only have 1 word (e.g., "Kei te"). Variation cards may be fewer than 2.
2. **Multi-word tense markers**: "Kei te" is treated as a single card, not two.
3. **Macrons**: Words with macrons (ā, ē, ī, ō, ū) must be normalized for ID lookup.

---

_Last Updated: 2025-11-10_

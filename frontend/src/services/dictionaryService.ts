export interface WordDefinition {
  word: string;
  lemma: string;
  pos: string; // Part of speech (Sustantivo, Verbo, Adjetivo, etc.)
  translation: string;
  grammarNote?: string;
}

// Built-in offline dictionary mapping lowercase Spanish words to English translations & grammatical nuances
const DICTIONARY_ENTRIES: Record<string, { lemma: string; pos: string; translation: string; grammarNote?: string }> = {
  // Common verbs and conjugated forms
  'hablar': { lemma: 'hablar', pos: 'Verbo (Infinitivo)', translation: 'to speak, to talk', grammarNote: '1ª conjugación (-ar)' },
  'hablo': { lemma: 'hablar', pos: 'Verbo', translation: 'I speak', grammarNote: '1ª pers. sing. presente de indicativo' },
  'hablas': { lemma: 'hablar', pos: 'Verbo', translation: 'you speak', grammarNote: '2ª pers. sing. presente de indicativo' },
  'habla': { lemma: 'hablar', pos: 'Verbo', translation: 'he/she/it speaks', grammarNote: '3ª pers. sing. presente de indicativo' },
  'hablamos': { lemma: 'hablar', pos: 'Verbo', translation: 'we speak', grammarNote: '1ª pers. plural presente de indicativo' },
  'hablan': { lemma: 'hablar', pos: 'Verbo', translation: 'they speak', grammarNote: '3ª pers. plural presente de indicativo' },
  'hablé': { lemma: 'hablar', pos: 'Verbo', translation: 'I spoke', grammarNote: '1ª pers. sing. pretérito indefinido' },
  'habló': { lemma: 'hablar', pos: 'Verbo', translation: 'he/she spoke', grammarNote: '3ª pers. sing. pretérito indefinido' },
  
  'ser': { lemma: 'ser', pos: 'Verbo (Infinitivo)', translation: 'to be (essential/permanent)', grammarNote: 'Verbo copulativo irregular' },
  'soy': { lemma: 'ser', pos: 'Verbo', translation: 'I am', grammarNote: '1ª pers. sing. presente' },
  'eres': { lemma: 'ser', pos: 'Verbo', translation: 'you are', grammarNote: '2ª pers. sing. presente' },
  'es': { lemma: 'ser', pos: 'Verbo', translation: 'he/she/it is', grammarNote: '3ª pers. sing. presente' },
  'somos': { lemma: 'ser', pos: 'Verbo', translation: 'we are', grammarNote: '1ª pers. plural presente' },
  'son': { lemma: 'ser', pos: 'Verbo', translation: 'they are', grammarNote: '3ª pers. plural presente' },
  'fue': { lemma: 'ser / ir', pos: 'Verbo', translation: 'was / went', grammarNote: '3ª pers. sing. pretérito indefinido' },
  'fueron': { lemma: 'ser / ir', pos: 'Verbo', translation: 'they were / they went', grammarNote: '3ª pers. plural pretérito indefinido' },
  'era': { lemma: 'ser', pos: 'Verbo', translation: 'was / used to be', grammarNote: '1ª/3ª pers. sing. pretérito imperfecto' },
  'sea': { lemma: 'ser', pos: 'Verbo', translation: 'be / may be', grammarNote: 'Presente de subjuntivo' },
  'sean': { lemma: 'ser', pos: 'Verbo', translation: 'they be', grammarNote: '3ª pers. plural presente de subjuntivo' },

  'estar': { lemma: 'estar', pos: 'Verbo (Infinitivo)', translation: 'to be (location/state)', grammarNote: 'Verbo copulativo de estado/lugar' },
  'estoy': { lemma: 'estar', pos: 'Verbo', translation: 'I am (located/feeling)', grammarNote: '1ª pers. sing. presente' },
  'estás': { lemma: 'estar', pos: 'Verbo', translation: 'you are', grammarNote: '2ª pers. sing. presente' },
  'está': { lemma: 'estar', pos: 'Verbo', translation: 'is (located/feeling)', grammarNote: '3ª pers. sing. presente' },
  'estamos': { lemma: 'estar', pos: 'Verbo', translation: 'we are', grammarNote: '1ª pers. plural presente' },
  'están': { lemma: 'estar', pos: 'Verbo', translation: 'they are', grammarNote: '3ª pers. plural presente' },
  'estuvo': { lemma: 'estar', pos: 'Verbo', translation: 'was (located)', grammarNote: '3ª pers. sing. pretérito indefinido' },
  'estaba': { lemma: 'estar', pos: 'Verbo', translation: 'was / was located', grammarNote: 'Pretérito imperfecto' },
  'esté': { lemma: 'estar', pos: 'Verbo', translation: 'be', grammarNote: 'Presente de subjuntivo' },

  'hacer': { lemma: 'hacer', pos: 'Verbo (Infinitivo)', translation: 'to do, to make', grammarNote: 'Verbo irregular' },
  'hago': { lemma: 'hacer', pos: 'Verbo', translation: 'I do / I make', grammarNote: '1ª pers. sing. presente' },
  'hace': { lemma: 'hacer', pos: 'Verbo', translation: 'he/she does / makes', grammarNote: '3ª pers. sing. presente' },
  'hacemos': { lemma: 'hacer', pos: 'Verbo', translation: 'we do / we make', grammarNote: '1ª pers. plural presente' },
  'hizo': { lemma: 'hacer', pos: 'Verbo', translation: 'did / made', grammarNote: '3ª pers. sing. pretérito indefinido (raíz hiz-)' },
  'hice': { lemma: 'hacer', pos: 'Verbo', translation: 'I did / made', grammarNote: '1ª pers. sing. pretérito indefinido' },
  'hicieron': { lemma: 'hacer', pos: 'Verbo', translation: 'they did / made', grammarNote: '3ª pers. plural pretérito indefinido' },
  'haga': { lemma: 'hacer', pos: 'Verbo', translation: 'do / make (subjunctive)', grammarNote: 'Presente de subjuntivo' },

  'tener': { lemma: 'tener', pos: 'Verbo (Infinitivo)', translation: 'to have, to possess', grammarNote: 'Verbo irregular' },
  'tengo': { lemma: 'tener', pos: 'Verbo', translation: 'I have', grammarNote: '1ª pers. sing. presente' },
  'tienes': { lemma: 'tener', pos: 'Verbo', translation: 'you have', grammarNote: '2ª pers. sing. presente' },
  'tiene': { lemma: 'tener', pos: 'Verbo', translation: 'he/she/it has', grammarNote: '3ª pers. sing. presente' },
  'tenemos': { lemma: 'tener', pos: 'Verbo', translation: 'we have', grammarNote: '1ª pers. plural presente' },
  'tienen': { lemma: 'tener', pos: 'Verbo', translation: 'they have', grammarNote: '3ª pers. plural presente' },
  'tuvo': { lemma: 'tener', pos: 'Verbo', translation: 'had', grammarNote: '3ª pers. sing. pretérito indefinido' },
  'tenía': { lemma: 'tener', pos: 'Verbo', translation: 'had / used to have', grammarNote: 'Pretérito imperfecto' },
  'tenga': { lemma: 'tener', pos: 'Verbo', translation: 'have (subjunctive)', grammarNote: 'Presente de subjuntivo' },
  'tuviera': { lemma: 'tener', pos: 'Verbo', translation: 'had / were to have', grammarNote: 'Pretérito imperfecto de subjuntivo' },
  'tuviese': { lemma: 'tener', pos: 'Verbo', translation: 'had', grammarNote: 'Variante en -se del imperfecto de subjuntivo' },

  'haber': { lemma: 'haber', pos: 'Verbo auxiliar', translation: 'to have (auxiliary) / there is', grammarNote: 'Verbo auxiliar compuesto' },
  'hay': { lemma: 'haber', pos: 'Verbo impersonal', translation: 'there is, there are', grammarNote: 'Presente existencial' },
  'he': { lemma: 'haber', pos: 'Verbo', translation: 'I have (done)', grammarNote: '1ª pers. sing. pretérito perfecto' },
  'has': { lemma: 'haber', pos: 'Verbo', translation: 'you have (done)', grammarNote: '2ª pers. sing. pretérito perfecto' },
  'ha': { lemma: 'haber', pos: 'Verbo', translation: 'has (done)', grammarNote: '3ª pers. sing. pretérito perfecto' },
  'hemos': { lemma: 'haber', pos: 'Verbo', translation: 'we have (done)', grammarNote: '1ª pers. plural pretérito perfecto' },
  'han': { lemma: 'haber', pos: 'Verbo', translation: 'they have (done)', grammarNote: '3ª pers. plural pretérito perfecto' },
  'había': { lemma: 'haber', pos: 'Verbo', translation: 'had (done) / there was', grammarNote: 'Pretérito imperfecto' },
  'haya': { lemma: 'haber', pos: 'Verbo', translation: 'have (subjunctive)', grammarNote: 'Presente de subjuntivo' },
  'hubiera': { lemma: 'haber', pos: 'Verbo', translation: 'had / would have', grammarNote: 'Imperfecto de subjuntivo' },
  'hubiese': { lemma: 'haber', pos: 'Verbo', translation: 'had', grammarNote: 'Imperfecto de subjuntivo (-se)' },
  'habría': { lemma: 'haber', pos: 'Verbo', translation: 'would have', grammarNote: 'Condicional compuesto' },
  'hubiere': { lemma: 'haber', pos: 'Verbo', translation: 'should have / were to have', grammarNote: 'Futuro de subjuntivo (arcaísmo jurídico)' },

  'llegar': { lemma: 'llegar', pos: 'Verbo (Infinitivo)', translation: 'to arrive, to reach', grammarNote: 'Regular' },
  'llega': { lemma: 'llegar', pos: 'Verbo', translation: 'arrives', grammarNote: '3ª pers. sing. presente' },
  'llegó': { lemma: 'llegar', pos: 'Verbo', translation: 'arrived', grammarNote: '3ª pers. sing. pretérito indefinido' },
  'llegado': { lemma: 'llegar', pos: 'Participio', translation: 'arrived', grammarNote: 'Participio pasado invariable' },
  'llegue': { lemma: 'llegar', pos: 'Verbo', translation: 'arrive (subjunctive)', grammarNote: 'Presente de subjuntivo (conector temporal)' },

  'decir': { lemma: 'decir', pos: 'Verbo (Infinitivo)', translation: 'to say, to tell', grammarNote: 'Irregular' },
  'digo': { lemma: 'decir', pos: 'Verbo', translation: 'I say, I tell', grammarNote: '1ª pers. sing. presente' },
  'dice': { lemma: 'decir', pos: 'Verbo', translation: 'he/she says', grammarNote: '3ª pers. sing. presente' },
  'dijo': { lemma: 'decir', pos: 'Verbo', translation: 'said, told', grammarNote: 'Pretérito indefinido' },
  'digas': { lemma: 'decir', pos: 'Verbo', translation: 'say, tell (subjunctive / negative imperative)', grammarNote: 'Imperativo negativo / subjuntivo' },
  'dímelo': { lemma: 'decir', pos: 'Verbo con clíticos', translation: 'tell it to me', grammarNote: 'Imperativo afirmativo di + me (OI) + lo (OD)' },

  'tomar': { lemma: 'tomar', pos: 'Verbo (Infinitivo)', translation: 'to take, to drink', grammarNote: '1ª conjugación' },
  'toma': { lemma: 'tomar', pos: 'Verbo', translation: 'takes / drinks', grammarNote: '3ª pers. sing. presente' },
  'tome': { lemma: 'tomar', pos: 'Verbo', translation: 'take (subjunctive)', grammarNote: 'Presente de subjuntivo tras verbo de influencia' },
  'tomó': { lemma: 'tomar', pos: 'Verbo', translation: 'took', grammarNote: 'Pretérito indefinido' },

  'saber': { lemma: 'saber', pos: 'Verbo (Infinitivo)', translation: 'to know (facts/skills)', grammarNote: 'Irregular' },
  'sé': { lemma: 'saber', pos: 'Verbo', translation: 'I know', grammarNote: '1ª pers. sing. presente' },
  'sabe': { lemma: 'saber', pos: 'Verbo', translation: 'he/she knows', grammarNote: '3ª pers. sing. presente' },
  'supo': { lemma: 'saber', pos: 'Verbo', translation: 'found out / knew', grammarNote: 'Pretérito indefinido' },
  'sabido': { lemma: 'saber', pos: 'Participio', translation: 'known', grammarNote: 'Participio' },
  'sepamos': { lemma: 'saber', pos: 'Verbo', translation: 'we know (subjunctive)', grammarNote: '1ª pers. plural presente de subjuntivo' },

  'comprar': { lemma: 'comprar', pos: 'Verbo (Infinitivo)', translation: 'to buy, to purchase', grammarNote: 'Regular' },
  'compro': { lemma: 'comprar', pos: 'Verbo', translation: 'I buy', grammarNote: 'Presente' },
  'compró': { lemma: 'comprar', pos: 'Verbo', translation: 'bought', grammarNote: 'Pretérito indefinido' },
  'compraron': { lemma: 'comprar', pos: 'Verbo', translation: 'they bought', grammarNote: '3ª pers. plural pretérito indefinido' },

  'leer': { lemma: 'leer', pos: 'Verbo (Infinitivo)', translation: 'to read', grammarNote: '2ª conjugación' },
  'lee': { lemma: 'leer', pos: 'Verbo', translation: 'reads', grammarNote: '3ª pers. sing. presente' },
  'leyó': { lemma: 'leer', pos: 'Verbo', translation: 'read (past)', grammarNote: 'Pretérito indefinido con cambio ortográfico y' },

  'escribir': { lemma: 'escribir', pos: 'Verbo (Infinitivo)', translation: 'to write', grammarNote: '3ª conjugación' },
  'escribe': { lemma: 'escribir', pos: 'Verbo', translation: 'writes', grammarNote: '3ª pers. sing. presente' },
  'escrito': { lemma: 'escribir', pos: 'Participio', translation: 'written', grammarNote: 'Participio irregular' },

  'servir': { lemma: 'servir', pos: 'Verbo (Infinitivo)', translation: 'to serve', grammarNote: 'Cambio vocálico e -> i' },
  'sirve': { lemma: 'servir', pos: 'Verbo', translation: 'serves', grammarNote: '3ª pers. sing. presente' },

  'esperar': { lemma: 'esperar', pos: 'Verbo (Infinitivo)', translation: 'to wait, to hope, to expect', grammarNote: 'Regular' },
  'esperan': { lemma: 'esperar', pos: 'Verbo', translation: 'they wait / hope', grammarNote: 'Presente' },

  'insistir': { lemma: 'insistir', pos: 'Verbo (Infinitivo)', translation: 'to insist', grammarNote: 'Rige preposición en' },
  'insiste': { lemma: 'insistir', pos: 'Verbo', translation: 'insists', grammarNote: '3ª pers. sing. presente' },

  'presentar': { lemma: 'presentar', pos: 'Verbo (Infinitivo)', translation: 'to present, introduce', grammarNote: 'Regular' },
  'presente': { lemma: 'presentar', pos: 'Verbo / Sustantivo', translation: 'present (subjunctive / noun)', grammarNote: 'Subjuntivo o sustantivo temporal' },

  'resultar': { lemma: 'resultar', pos: 'Verbo (Infinitivo)', translation: 'to turn out, to result', grammarNote: 'Verbo copulativo' },
  'resulten': { lemma: 'resultar', pos: 'Verbo', translation: 'they turn out (subjunctive)', grammarNote: 'Subjuntivo concesivo' },

  'emitir': { lemma: 'emitir', pos: 'Verbo (Infinitivo)', translation: 'to issue, deliver (verdict), broadcast', grammarNote: '3ª conjugación' },
  'emitió': { lemma: 'emitir', pos: 'Verbo', translation: 'issued, delivered', grammarNote: 'Pretérito indefinido' },

  'concluir': { lemma: 'concluir', pos: 'Verbo (Infinitivo)', translation: 'to conclude, to finish', grammarNote: 'Irregular' },
  'concluidas': { lemma: 'concluir', pos: 'Participio adjetival', translation: 'having concluded / finished', grammarNote: 'Femenino plural en cláusula absoluta' },

  'quebrantar': { lemma: 'quebrantar', pos: 'Verbo (Infinitivo)', translation: 'to breach, violate, break', grammarNote: 'Formal' },
  'quebrantado': { lemma: 'quebrantar', pos: 'Participio', translation: 'breached, violated', grammarNote: 'Participio' },

  'responder': { lemma: 'responder', pos: 'Verbo (Infinitivo)', translation: 'to answer, to be liable', grammarNote: 'Formal' },
  'responderá': { lemma: 'responder', pos: 'Verbo', translation: 'shall answer / be liable', grammarNote: 'Futuro simple con matiz imperativo legal' },

  'acabar': { lemma: 'acabar', pos: 'Verbo (Infinitivo)', translation: 'to finish, to end', grammarNote: 'En perífrasis acabar de + inf' },
  'acaba': { lemma: 'acabar', pos: 'Verbo', translation: 'just (did something)', grammarNote: 'Presente de perífrasis aspectual' },

  // Nouns
  'café': { lemma: 'café', pos: 'Sustantivo masculino', translation: 'coffee', grammarNote: 'Singular' },
  'camarero': { lemma: 'camarero', pos: 'Sustantivo masculino', translation: 'waiter', grammarNote: 'Singular' },
  'mañana': { lemma: 'mañana', pos: 'Sustantivo femenino / Adverbio', translation: 'morning / tomorrow', grammarNote: 'la mañana (morning), mañana (tomorrow)' },
  'tarde': { lemma: 'tarde', pos: 'Sustantivo femenino / Adverbio', translation: 'afternoon / evening / late', grammarNote: 'la tarde' },
  'terraza': { lemma: 'terraza', pos: 'Sustantivo femenino', translation: 'terrace, outdoor patio', grammarNote: 'Singular' },
  'mercado': { lemma: 'mercado', pos: 'Sustantivo masculino', translation: 'market', grammarNote: 'Singular' },
  'puesto': { lemma: 'puesto', pos: 'Sustantivo masculino', translation: 'stall, stand, position', grammarNote: 'Singular' },
  'fruta': { lemma: 'fruta', pos: 'Sustantivo femenino', translation: 'fruit', grammarNote: 'Singular' },
  'frutas': { lemma: 'fruta', pos: 'Sustantivo femenino', translation: 'fruits', grammarNote: 'Plural' },
  'manzana': { lemma: 'manzana', pos: 'Sustantivo femenino', translation: 'apple', grammarNote: 'Singular' },
  'manzanas': { lemma: 'manzana', pos: 'Sustantivo femenino', translation: 'apples', grammarNote: 'Plural' },
  'merienda': { lemma: 'merienda', pos: 'Sustantivo femenino', translation: 'afternoon snack', grammarNote: 'Singular' },
  'hermano': { lemma: 'hermano', pos: 'Sustantivo masculino', translation: 'brother', grammarNote: 'Singular' },
  'biblioteca': { lemma: 'biblioteca', pos: 'Sustantivo femenino', translation: 'library', grammarNote: 'Singular' },
  'examen': { lemma: 'examen', pos: 'Sustantivo masculino', translation: 'exam, test', grammarNote: 'Singular' },
  'clase': { lemma: 'clase', pos: 'Sustantivo femenino', translation: 'class, classroom', grammarNote: 'Singular' },
  'idioma': { lemma: 'idioma', pos: 'Sustantivo masculino', translation: 'language', grammarNote: 'Termina en -ma pero es masculino: el idioma' },
  'idiomas': { lemma: 'idioma', pos: 'Sustantivo masculino', translation: 'languages', grammarNote: 'Plural' },
  'profesora': { lemma: 'profesora', pos: 'Sustantivo femenino', translation: 'teacher (female)', grammarNote: 'Singular' },
  'libro': { lemma: 'libro', pos: 'Sustantivo masculino', translation: 'book', grammarNote: 'Singular' },
  'tren': { lemma: 'tren', pos: 'Sustantivo masculino', translation: 'train', grammarNote: 'Singular' },
  'pasajeros': { lemma: 'pasajero', pos: 'Sustantivo masculino', translation: 'passengers', grammarNote: 'Plural' },
  'estación': { lemma: 'estación', pos: 'Sustantivo femenino', translation: 'station, season', grammarNote: 'la estación' },
  'vía': { lemma: 'vía', pos: 'Sustantivo femenino', translation: 'track, railway, route', grammarNote: 'Singular' },
  'reserva': { lemma: 'reserva', pos: 'Sustantivo femenino', translation: 'reservation, booking', grammarNote: 'Singular' },
  'restaurante': { lemma: 'restaurante', pos: 'Sustantivo masculino', translation: 'restaurant', grammarNote: 'Singular' },
  'amigo': { lemma: 'amigo', pos: 'Sustantivo masculino', translation: 'friend', grammarNote: 'Singular' },
  'amigos': { lemma: 'amigo', pos: 'Sustantivo masculino', translation: 'friends', grammarNote: 'Plural' },
  'supermercado': { lemma: 'supermercado', pos: 'Sustantivo masculino', translation: 'supermarket', grammarNote: 'Singular' },
  'médico': { lemma: 'médico', pos: 'Sustantivo masculino', translation: 'doctor', grammarNote: 'Singular' },
  'doctor': { lemma: 'doctor', pos: 'Sustantivo masculino', translation: 'doctor', grammarNote: 'Singular' },
  'paciente': { lemma: 'paciente', pos: 'Sustantivo común', translation: 'patient', grammarNote: 'Invariable en género' },
  'medicación': { lemma: 'medicación', pos: 'Sustantivo femenino', translation: 'medication', grammarNote: 'Singular' },
  'horas': { lemma: 'hora', pos: 'Sustantivo femenino', translation: 'hours, times', grammarNote: 'Plural' },
  'novedades': { lemma: 'novedad', pos: 'Sustantivo femenino', translation: 'updates, news, novelties', grammarNote: 'Plural' },
  'proyecto': { lemma: 'proyecto', pos: 'Sustantivo masculino', translation: 'project', grammarNote: 'Singular' },
  'comité': { lemma: 'comité', pos: 'Sustantivo masculino', translation: 'committee', grammarNote: 'Singular' },
  'tratado': { lemma: 'tratado', pos: 'Sustantivo masculino', translation: 'treaty, pact', grammarNote: 'Singular' },
  'delegación': { lemma: 'delegación', pos: 'Sustantivo femenino', translation: 'delegation', grammarNote: 'Singular' },
  'objeciones': { lemma: 'objeción', pos: 'Sustantivo femenino', translation: 'objections', grammarNote: 'Plural' },
  'condiciones': { lemma: 'condición', pos: 'Sustantivo femenino', translation: 'conditions, terms', grammarNote: 'Plural' },
  'contrato': { lemma: 'contrato', pos: 'Sustantivo masculino', translation: 'contract', grammarNote: 'Singular' },
  'razón': { lemma: 'razón', pos: 'Sustantivo femenino', translation: 'reason', grammarNote: 'la razón' },
  'tesis': { lemma: 'tesis', pos: 'Sustantivo femenino', translation: 'thesis', grammarNote: 'Invariable en plural' },
  'postulados': { lemma: 'postulado', pos: 'Sustantivo masculino', translation: 'postulates, propositions', grammarNote: 'Plural' },
  'rigor': { lemma: 'rigor', pos: 'Sustantivo masculino', translation: 'rigor, strictness', grammarNote: 'el rigor' },
  'deliberaciones': { lemma: 'deliberación', pos: 'Sustantivo femenino', translation: 'deliberations', grammarNote: 'Plural' },
  'tribunal': { lemma: 'tribunal', pos: 'Sustantivo masculino', translation: 'court, tribunal', grammarNote: 'Singular' },
  'veredicto': { lemma: 'veredicto', pos: 'Sustantivo masculino', translation: 'verdict', grammarNote: 'Singular' },
  'pacto': { lemma: 'pacto', pos: 'Sustantivo masculino', translation: 'pact, agreement', grammarNote: 'Singular' },
  'términos': { lemma: 'término', pos: 'Sustantivo masculino', translation: 'terms, conditions', grammarNote: 'Plural' },

  // Adjectives
  'caliente': { lemma: 'caliente', pos: 'Adjetivo', translation: 'hot, warm', grammarNote: 'Invariable en género (-e)' },
  'calientes': { lemma: 'caliente', pos: 'Adjetivo', translation: 'hot (plural)', grammarNote: 'Plural de caliente' },
  'frío': { lemma: 'frío', pos: 'Adjetivo / Sustantivo', translation: 'cold', grammarNote: 'Masculino singular' },
  'fría': { lemma: 'frío', pos: 'Adjetivo', translation: 'cold', grammarNote: 'Femenino singular' },
  'rojo': { lemma: 'rojo', pos: 'Adjetivo', translation: 'red', grammarNote: 'Masculino singular' },
  'roja': { lemma: 'rojo', pos: 'Adjetivo', translation: 'red', grammarNote: 'Femenino singular' },
  'rojas': { lemma: 'rojo', pos: 'Adjetivo', translation: 'red', grammarNote: 'Femenino plural' },
  'rojos': { lemma: 'rojo', pos: 'Adjetivo', translation: 'red', grammarNote: 'Masculino plural' },
  'verde': { lemma: 'verde', pos: 'Adjetivo', translation: 'green', grammarNote: 'Invariable en género' },
  'interesante': { lemma: 'interesante', pos: 'Adjetivo', translation: 'interesting', grammarNote: 'Invariable en género' },
  'delicioso': { lemma: 'delicioso', pos: 'Adjetivo', translation: 'delicious', grammarNote: 'Masculino singular' },
  'deliciosas': { lemma: 'delicioso', pos: 'Adjetivo', translation: 'delicious', grammarNote: 'Femenino plural' },
  'principal': { lemma: 'principal', pos: 'Adjetivo', translation: 'main, primary', grammarNote: 'Invariable en género' },
  'céntrico': { lemma: 'céntrico', pos: 'Adjetivo', translation: 'downtown, central', grammarNote: 'Masculino singular' },
  'necesario': { lemma: 'necesario', pos: 'Adjetivo', translation: 'necessary', grammarNote: 'Masculino singular' },
  'debidas': { lemma: 'debido', pos: 'Adjetivo', translation: 'due, appropriate', grammarNote: 'Femenino plural' },
  'constitucionales': { lemma: 'constitucional', pos: 'Adjetivo', translation: 'constitutional', grammarNote: 'Plural' },
  'contractuales': { lemma: 'contractual', pos: 'Adjetivo', translation: 'contractual', grammarNote: 'Plural' },
  'plausible': { lemma: 'plausible', pos: 'Adjetivo', translation: 'plausible, credible', grammarNote: 'Formal' },
  'convincentes': { lemma: 'convincente', pos: 'Adjetivo', translation: 'convincing', grammarNote: 'Plural' },
  'metodológico': { lemma: 'metodológico', pos: 'Adjetivo', translation: 'methodological', grammarNote: 'Masculino singular' },
  'preliminares': { lemma: 'preliminar', pos: 'Adjetivo', translation: 'preliminary', grammarNote: 'Plural' },
  'irrevocable': { lemma: 'irrevocable', pos: 'Adjetivo', translation: 'irrevocable, final', grammarNote: 'Formal' },

  // Pronouns, Articles, Prepositions & Connectors
  'el': { lemma: 'el', pos: 'Artículo determinado', translation: 'the', grammarNote: 'Masculino singular' },
  'la': { lemma: 'el', pos: 'Artículo determinado / Pronombre', translation: 'the / her, it', grammarNote: 'Femenino singular' },
  'los': { lemma: 'el', pos: 'Artículo determinado / Pronombre', translation: 'the / them', grammarNote: 'Masculino plural' },
  'las': { lemma: 'el', pos: 'Artículo determinado / Pronombre', translation: 'the / them', grammarNote: 'Femenino plural' },
  'un': { lemma: 'uno', pos: 'Artículo indeterminado', translation: 'a, an, one', grammarNote: 'Masculino singular' },
  'una': { lemma: 'uno', pos: 'Artículo indeterminado', translation: 'a, an, one', grammarNote: 'Femenino singular' },
  'unos': { lemma: 'uno', pos: 'Artículo indeterminado', translation: 'some, a few', grammarNote: 'Masculino plural' },
  'unas': { lemma: 'uno', pos: 'Artículo indeterminado', translation: 'some, a few', grammarNote: 'Femenino plural' },
  'yo': { lemma: 'yo', pos: 'Pronombre personal', translation: 'I', grammarNote: '1ª pers. singular sujeto' },
  'tú': { lemma: 'tú', pos: 'Pronombre personal', translation: 'you (informal)', grammarNote: '2ª pers. singular sujeto' },
  'él': { lemma: 'él', pos: 'Pronombre personal', translation: 'he, him', grammarNote: '3ª pers. masc. singular' },
  'ella': { lemma: 'ella', pos: 'Pronombre personal', translation: 'she, her', grammarNote: '3ª pers. fem. singular' },
  'nosotros': { lemma: 'nosotros', pos: 'Pronombre personal', translation: 'we, us', grammarNote: '1ª pers. plural' },
  'ellos': { lemma: 'ellos', pos: 'Pronombre personal', translation: 'they, them', grammarNote: '3ª pers. plural' },
  'me': { lemma: 'me', pos: 'Pronombre clítico', translation: 'me, to me, myself', grammarNote: 'Objeto directo / indirecto' },
  'te': { lemma: 'te', pos: 'Pronombre clítico', translation: 'you, to you, yourself', grammarNote: 'Objeto directo / indirecto' },
  'se': { lemma: 'se', pos: 'Pronombre clítico / reflexivo', translation: 'himself, herself, themselves / to him/her (before lo)', grammarNote: 'Reflexivo o alomorfo de dativo' },
  'lo': { lemma: 'lo', pos: 'Pronombre de objeto directo', translation: 'it, him', grammarNote: 'Acusativo masculino neutro' },
  'le': { lemma: 'le', pos: 'Pronombre de objeto indirecto', translation: 'to him, to her, to you', grammarNote: 'Dativo de 3ª persona' },
  'les': { lemma: 'le', pos: 'Pronombre de objeto indirecto', translation: 'to them, to you all', grammarNote: 'Dativo plural' },
  'nos': { lemma: 'nos', pos: 'Pronombre clítico', translation: 'us, to us, ourselves', grammarNote: '1ª pers. plural' },
  
  'por': { lemma: 'por', pos: 'Preposición', translation: 'for, by, through, along, because of', grammarNote: 'Causa, medio, duración, agente pasivo' },
  'para': { lemma: 'para', pos: 'Preposición', translation: 'for, in order to, towards', grammarNote: 'Propósito, destino, fecha límite' },
  'con': { lemma: 'con', pos: 'Preposición', translation: 'with', grammarNote: 'Compañía, instrumento' },
  'de': { lemma: 'de', pos: 'Preposición', translation: 'of, from, about', grammarNote: 'Posesión, origen, material' },
  'en': { lemma: 'en', pos: 'Preposición', translation: 'in, on, at', grammarNote: 'Lugar, tiempo' },
  'a': { lemma: 'a', pos: 'Preposición', translation: 'to, at', grammarNote: 'Dirección, hora, objeto directo personal' },
  'hasta': { lemma: 'hasta', pos: 'Preposición', translation: 'until, up to, even', grammarNote: 'Límite espacial o temporal' },
  'sin': { lemma: 'sin', pos: 'Preposición', translation: 'without', grammarNote: 'Privación' },
  'sobre': { lemma: 'sobre', pos: 'Preposición', translation: 'on, about, above', grammarNote: 'Lugar o tema' },

  'no': { lemma: 'no', pos: 'Adverbio de negación', translation: 'no, not', grammarNote: 'Preverbal en cláusulas negativas' },
  'sí': { lemma: 'sí', pos: 'Adverbio de afirmación', translation: 'yes', grammarNote: 'Con tilde diacrítica' },
  'muy': { lemma: 'muy', pos: 'Adverbio intensificador', translation: 'very', grammarNote: 'Modifica adjetivos y adverbios' },
  'mucho': { lemma: 'mucho', pos: 'Adjetivo / Adverbio', translation: 'much, a lot', grammarNote: 'Modifica sustantivos o verbos' },
  'más': { lemma: 'más', pos: 'Adverbio comparativo', translation: 'more', grammarNote: 'Comparativo de superioridad' },
  'menos': { lemma: 'menos', pos: 'Adverbio comparativo', translation: 'less, fewer', grammarNote: 'Comparativo de inferioridad' },
  'ayer': { lemma: 'ayer', pos: 'Adverbio temporal', translation: 'yesterday', grammarNote: 'Marcador del pretérito indefinido' },
  'hoy': { lemma: 'hoy', pos: 'Adverbio temporal', translation: 'today', grammarNote: 'Marcador de presente' },
  'todavía': { lemma: 'todavía', pos: 'Adverbio de aspecto', translation: 'still, yet', grammarNote: 'Continuidad temporal' },
  'ya': { lemma: 'ya', pos: 'Adverbio de aspecto', translation: 'already, now', grammarNote: 'Acción cumplida' },
  'ahora': { lemma: 'ahora', pos: 'Adverbio temporal', translation: 'now', grammarNote: 'Momento presente' },
  'jamás': { lemma: 'jamás', pos: 'Adverbio de negación enfática', translation: 'never, ever', grammarNote: 'Negación categórica' },
  'nunca': { lemma: 'nunca', pos: 'Adverbio de negación', translation: 'never', grammarNote: 'Negación temporal' },

  'que': { lemma: 'que', pos: 'Conjunción subordinante / Relativo', translation: 'that, which, who', grammarNote: 'Nexo oracional universal' },
  'cuando': { lemma: 'cuando', pos: 'Conjunción temporal / Adverbio', translation: 'when', grammarNote: '+ indicativo (pasado/hábito) o + subjuntivo (futuro)' },
  'si': { lemma: 'si', pos: 'Conjunción condicional', translation: 'if, whether', grammarNote: 'Sin tilde. Introduce prótasis condicional' },
  'porque': { lemma: 'porque', pos: 'Conjunción causal', translation: 'because', grammarNote: 'Causa' },
  'aunque': { lemma: 'aunque', pos: 'Conjunción concesiva', translation: 'although, even though', grammarNote: 'Concesión (+ ind o subj)' },
  'quienquiera': { lemma: 'quienquiera', pos: 'Pronombre indefinido relativo', translation: 'whosoever, whoever', grammarNote: 'Formal/literario' },

  // A1-C1 Curriculum Target Vocabulary & Blanks
  'amarga': { lemma: 'amargo', pos: 'Adjetivo (Femenino)', translation: 'bitter', grammarNote: 'Concordancia fem. sing.' },
  'cansado': { lemma: 'cansado', pos: 'Participio / Adjetivo', translation: 'tired', grammarNote: 'Estado transitorio con estar' },
  'contentos': { lemma: 'contento', pos: 'Adjetivo (Plural)', translation: 'happy, glad', grammarNote: 'Masc. pl. (-os)' },
  'blanca': { lemma: 'blanco', pos: 'Adjetivo (Femenino)', translation: 'white', grammarNote: 'Fem. sing. (-a)' },
  'rápidos': { lemma: 'rápido', pos: 'Adjetivo (Plural)', translation: 'fast, quick', grammarNote: 'Masc. pl. (-os)' },
  'negra': { lemma: 'negro', pos: 'Adjetivo (Femenino)', translation: 'black', grammarNote: 'Fem. sing. (-a)' },
  'nuevos': { lemma: 'nuevo', pos: 'Adjetivo (Plural)', translation: 'new', grammarNote: 'Masc. pl. (-os)' },
  'amarillas': { lemma: 'amarillo', pos: 'Adjetivo (Plural)', translation: 'yellow', grammarNote: 'Fem. pl. (-as)' },
  'alto': { lemma: 'alto', pos: 'Adjetivo', translation: 'tall, high', grammarNote: 'Masc. sing. (-o)' },
  'pequeña': { lemma: 'pequeño', pos: 'Adjetivo (Femenino)', translation: 'small, little', grammarNote: 'Fem. sing. (-a)' },
  'fresca': { lemma: 'fresco', pos: 'Adjetivo (Femenino)', translation: 'fresh, cool', grammarNote: 'Concordancia femenina con agua' },
  'grandes': { lemma: 'grande', pos: 'Adjetivo (Plural)', translation: 'big, large', grammarNote: 'Plural de adjetivo en -e (-es)' },
  'azul': { lemma: 'azul', pos: 'Adjetivo', translation: 'blue', grammarNote: 'Invariable en género' },
  'difícil': { lemma: 'difícil', pos: 'Adjetivo', translation: 'difficult, hard', grammarNote: 'Invariable en género, acento en -í-' },
  'soleado': { lemma: 'soleado', pos: 'Adjetivo', translation: 'sunny', grammarNote: 'Masc. sing. con día' },
  'abrimos': { lemma: 'abrir', pos: 'Verbo', translation: 'we open', grammarNote: '1ª pers. pl. presente (-ir)' },
  'compras': { lemma: 'comprar', pos: 'Verbo', translation: 'you buy', grammarNote: '2ª pers. sing. presente (-ar)' },
  'llegan': { lemma: 'llegar', pos: 'Verbo', translation: 'they arrive', grammarNote: '3ª pers. pl. presente (-ar)' },
  'comprende': { lemma: 'comprender', pos: 'Verbo', translation: 'understands', grammarNote: '3ª pers. sing. presente (-er)' },
  'cenamos': { lemma: 'cenar', pos: 'Verbo', translation: 'we have dinner', grammarNote: '1ª pers. pl. presente (-ar)' },
  'empieza': { lemma: 'empezar', pos: 'Verbo', translation: 'starts, begins', grammarNote: '3ª pers. sing. presente (e -> ie)' },
  'camino': { lemma: 'caminar', pos: 'Verbo', translation: 'I walk', grammarNote: '1ª pers. sing. presente (-ar)' },
  'estudio': { lemma: 'estudiar', pos: 'Verbo', translation: 'I study', grammarNote: '1ª pers. sing. presente (-ar)' },
  'visitó': { lemma: 'visitar', pos: 'Verbo', translation: 'visited', grammarNote: '3ª pers. sing. pretérito indefinido' },
  'sonó': { lemma: 'sonar', pos: 'Verbo', translation: 'rang, sounded', grammarNote: '3ª pers. sing. pretérito indefinido' },
  'comí': { lemma: 'comer', pos: 'Verbo', translation: 'I ate', grammarNote: '1ª pers. sing. pretérito indefinido' },
  'volvimos': { lemma: 'volver', pos: 'Verbo', translation: 'we returned', grammarNote: '1ª pers. pl. pretérito indefinido' },
  'salí': { lemma: 'salir', pos: 'Verbo', translation: 'I left / I went out', grammarNote: '1ª pers. sing. pretérito indefinido' },
  'vivía': { lemma: 'vivir', pos: 'Verbo', translation: 'lived / used to live', grammarNote: 'Pretérito imperfecto' },
  'jugábamos': { lemma: 'jugar', pos: 'Verbo', translation: 'we used to play', grammarNote: '1ª pers. pl. pretérito imperfecto' },
  'abierto': { lemma: 'abrir', pos: 'Participio', translation: 'opened, open', grammarNote: 'Participio irregular terminado en -to' },
  'vuelto': { lemma: 'volver', pos: 'Participio', translation: 'returned', grammarNote: 'Participio irregular terminado en -to' },
  'mejor': { lemma: 'mejor', pos: 'Adjetivo comparativo', translation: 'better, best', grammarNote: 'Comparativo sintético de bueno' },
  'peor': { lemma: 'peor', pos: 'Adjetivo comparativo', translation: 'worse, worst', grammarNote: 'Comparativo sintético de malo' },
  'mayor': { lemma: 'mayor', pos: 'Adjetivo comparativo', translation: 'older, elder, greater', grammarNote: 'Comparativo sintético de edad' },
  'menor': { lemma: 'menor', pos: 'Adjetivo comparativo', translation: 'younger, smaller', grammarNote: 'Comparativo sintético de edad/tamaño' },
  'deberías': { lemma: 'deber', pos: 'Verbo', translation: 'you should', grammarNote: '2ª pers. sing. condicional de consejo' },
  'gustaría': { lemma: 'gustar', pos: 'Verbo', translation: 'would like', grammarNote: 'Condicional de cortesía' },
  'haría': { lemma: 'hacer', pos: 'Verbo', translation: 'would do, would make', grammarNote: 'Condicional simple (har-)' },
  'querría': { lemma: 'querer', pos: 'Verbo', translation: 'would want, would like', grammarNote: 'Condicional de cortesía (querr-)' },
  'podríais': { lemma: 'poder', pos: 'Verbo', translation: 'you (plural) could', grammarNote: 'Condicional simple vosotros' },
  'serían': { lemma: 'ser', pos: 'Verbo', translation: 'would be / probably were', grammarNote: 'Condicional de probabilidad pasada' },
  'diría': { lemma: 'decir', pos: 'Verbo', translation: 'would say', grammarNote: 'Condicional simple (dir-)' },
  'tendría': { lemma: 'tener', pos: 'Verbo', translation: 'would have', grammarNote: 'Condicional simple (tendr-)' },
  'importaría': { lemma: 'importar', pos: 'Verbo', translation: 'would mind', grammarNote: 'Fórmula de cortesía' },
  'haz': { lemma: 'hacer', pos: 'Verbo (Imperativo)', translation: 'do! make!', grammarNote: 'Imperativo afirmativo irregular de tú' },
  'pase': { lemma: 'pasar', pos: 'Verbo (Imperativo)', translation: 'come in! pass!', grammarNote: 'Imperativo formal usted' },
  'escúchame': { lemma: 'escuchar', pos: 'Verbo con clítico', translation: 'listen to me!', grammarNote: 'Imperativo escucha + me (enclisis)' },
  'olvide': { lemma: 'olvidar', pos: 'Verbo (Subjuntivo)', translation: 'forget (formal)', grammarNote: 'Imperativo negativo usted (no olvide)' },
  've': { lemma: 'ir', pos: 'Verbo (Imperativo)', translation: 'go!', grammarNote: 'Imperativo afirmativo irregular de tú' },
  'toques': { lemma: 'tocar', pos: 'Verbo (Subjuntivo)', translation: 'touch (negative)', grammarNote: 'Imperativo negativo tú (no toques)' },
  'pon': { lemma: 'poner', pos: 'Verbo (Imperativo)', translation: 'put! place!', grammarNote: 'Imperativo afirmativo irregular de tú' },
  'ayúdame': { lemma: 'ayudar', pos: 'Verbo con clítico', translation: 'help me!', grammarNote: 'Imperativo ayuda + me (enclisis)' },
  'fuéramos': { lemma: 'ser / ir', pos: 'Verbo', translation: 'were / went', grammarNote: '1ª pers. pl. imperfecto de subjuntivo' },
  'pudiera': { lemma: 'poder', pos: 'Verbo', translation: 'could / were able to', grammarNote: 'Imperfecto de subjuntivo (pud-)' },
  'fuera': { lemma: 'ser / ir', pos: 'Verbo', translation: 'were / went', grammarNote: 'Imperfecto de subjuntivo' },
  'hiciesen': { lemma: 'hacer', pos: 'Verbo', translation: 'did / made', grammarNote: 'Imperfecto de subjuntivo variante -se' },
  'existiera': { lemma: 'existir', pos: 'Verbo', translation: 'existed / were to exist', grammarNote: 'Imperfecto de subjuntivo' },
  'estuvieras': { lemma: 'estar', pos: 'Verbo', translation: 'were (state/location)', grammarNote: 'Imperfecto de subjuntivo (estuv-)' },
  'pusiera': { lemma: 'poner', pos: 'Verbo', translation: 'put / placed', grammarNote: 'Imperfecto de subjuntivo (pus-)' },
  'viniera': { lemma: 'venir', pos: 'Verbo', translation: 'came', grammarNote: 'Imperfecto de subjuntivo (vin-)' },
  'aceptaría': { lemma: 'aceptar', pos: 'Verbo', translation: 'would accept', grammarNote: 'Condicional simple' },
  'hubiéramos': { lemma: 'haber', pos: 'Verbo auxiliar', translation: 'had (we)', grammarNote: '1ª pers. pl. pluscuamperfecto subjuntivo' },
  'acabamos': { lemma: 'acabar', pos: 'Verbo', translation: 'we just finished', grammarNote: 'Perífrasis acabar de + inf' },
  'solemos': { lemma: 'soler', pos: 'Verbo', translation: 'we usually / are accustomed to', grammarNote: 'Perífrasis de hábito' },
  'conozca': { lemma: 'conocer', pos: 'Verbo', translation: 'knows / may know', grammarNote: 'Presente de subjuntivo con relativo negado' },
  'reúna': { lemma: 'reunir', pos: 'Verbo', translation: 'gathers / meets criteria', grammarNote: 'Presente de subjuntivo' },
  'apenas': { lemma: 'apenas', pos: 'Adverbio', translation: 'barely, scarcely, as soon as', grammarNote: 'Inversión temporal culta' },
  'obstante': { lemma: 'obstante', pos: 'Locución adversativa', translation: 'nevertheless, however', grammarNote: 'No obstante (formal)' },
  'ende': { lemma: 'ende', pos: 'Conector consecutivo', translation: 'therefore, hence', grammarNote: 'Por ende (culto/jurídico)' },
  'ramas': { lemma: 'rama', pos: 'Sustantivo (Plural)', translation: 'branches', grammarNote: 'Andarse por las ramas (modismo)' },
  'borrajas': { lemma: 'borraja', pos: 'Sustantivo (Plural)', translation: 'borage plant', grammarNote: 'Agua de borrajas (modismo)' },
  'susodicho': { lemma: 'susodicho', pos: 'Adjetivo deíctico', translation: 'aforementioned', grammarNote: 'Registro forense/culto' },
  'fe': { lemma: 'fe', pos: 'Sustantivo', translation: 'faith, trust, formal witness', grammarNote: 'En fe de lo cual (notarial)' },
  'votó': { lemma: 'votar', pos: 'Verbo', translation: 'voted', grammarNote: '3ª pers. sing. pretérito indefinido' },
};

export class DictionaryService {
  private dictMap: Map<string, WordDefinition> = new Map();

  constructor() {
    for (const [key, value] of Object.entries(DICTIONARY_ENTRIES)) {
      this.dictMap.set(key.toLowerCase(), {
        word: key,
        lemma: value.lemma,
        pos: value.pos,
        translation: value.translation,
        grammarNote: value.grammarNote,
      });
    }
  }

  // Normalize string by stripping surrounding punctuation, quotes, brackets
  public cleanWord(raw: string): string {
    return raw
      .trim()
      .replace(/^[¿¡"'(«\s.,;!?:)[\]]+|[¿¡"'(«\s.,;!?:)[\]]+$/g, '')
      .toLowerCase();
  }

  // Fast O(1) lookup with smart lemmatization fallbacks
  public lookup(rawWord: string): WordDefinition | null {
    const clean = this.cleanWord(rawWord);
    if (!clean || clean.length < 1) return null;

    // 1. Direct match
    if (this.dictMap.has(clean)) {
      return this.dictMap.get(clean)!;
    }

    // 2. Remove trailing punctuation attached inside words
    const stripped = clean.replace(/[.,;!?:¿¡]/g, '');
    if (this.dictMap.has(stripped)) {
      return this.dictMap.get(stripped)!;
    }

    // 3. Check plural forms ending in -s or -es
    if (stripped.endsWith('es') && stripped.length > 3) {
      const singular = stripped.slice(0, -2);
      if (this.dictMap.has(singular)) {
        const item = this.dictMap.get(singular)!;
        return {
          word: stripped,
          lemma: item.lemma,
          pos: `${item.pos} (Plural)`,
          translation: `${item.translation} (plural)`,
          grammarNote: 'Forma plural flexionada (-es)',
        };
      }
    }

    if (stripped.endsWith('s') && stripped.length > 2) {
      const singular = stripped.slice(0, -1);
      if (this.dictMap.has(singular)) {
        const item = this.dictMap.get(singular)!;
        return {
          word: stripped,
          lemma: item.lemma,
          pos: `${item.pos} (Plural)`,
          translation: `${item.translation} (plural)`,
          grammarNote: 'Forma plural flexionada (-s)',
        };
      }
    }

    // 4. Check feminine forms ending in -a -> -o
    if (stripped.endsWith('a') && stripped.length > 2) {
      const masc = stripped.slice(0, -1) + 'o';
      if (this.dictMap.has(masc)) {
        const item = this.dictMap.get(masc)!;
        return {
          word: stripped,
          lemma: item.lemma,
          pos: `${item.pos} (Femenino)`,
          translation: item.translation,
          grammarNote: 'Flexión de género femenino (-a)',
        };
      }
    }

    // 5. Check adverbs ending in -mente
    if (stripped.endsWith('mente') && stripped.length > 6) {
      const baseAdj = stripped.replace(/mente$/, '');
      return {
        word: stripped,
        lemma: baseAdj,
        pos: 'Adverbio modal',
        translation: `${baseAdj}-ly`,
        grammarNote: 'Formación adverbial con sufijo -mente',
      };
    }

    // 6. Common prefixes or root deduction
    return null;
  }
}

export const dictionaryService = new DictionaryService();

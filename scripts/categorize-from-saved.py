"""Re-categorize from saved raw data and print grid."""
import json
import re
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

TELUGU_RANGE = re.compile(r"[\u0C00-\u0C7F]")

def detect_language(text):
    if not text:
        return "english"
    telugu_chars = len(TELUGU_RANGE.findall(text))
    total_alpha = len(re.findall(r"[a-zA-Z\u0C00-\u0C7F]", text))
    if total_alpha == 0:
        return "english"
    ratio = telugu_chars / total_alpha
    if ratio > 0.3:
        return "telugu"
    elif ratio > 0.05:
        return "mixed"
    return "english"

# ============================================================
# CATEGORY PATTERNS (title-only matching for main categories)
# ============================================================

# Gita checked FIRST (before Bhagavatam) since "bhagavad" overlaps
GITA_PATTERNS = [
    r"bh[aā]*g[aā]*v[aā]*d\s*g[eiē]+th?[aā]",
    r"bh[aā]*g[aā]*v[aā]*d\s*g[eiē]+t[aā]",
    r"g[eiē]+th?[aā]\s*(?:chapter|adhyaya|slok)",
    r"భగవద్గీత",
    r"గీతా",
]

BHAGAVATAM_PATTERNS = [
    r"bh[aā]+g[aā]*v[aā]*th",
    r"bh[aā]+g[aā]*v[aā]*t[aā]*m",
    r"srimad\s*bh[aā]*g",
    r"శ్రీమద్భాగవత",
    r"భాగవత",
    r"భాగవతం",
]

RAMAYANA_PATTERNS = [
    r"r[aā]+m[aā]*y[aā]*n",
    r"valmiki\s*r[aā]+m",
    r"రామాయణ",
    r"రామాయనం",
    r"వాల్మీకి",
]

MAHABHARATA_PATTERNS = [
    r"m[aā]*h[aā]+bh[aā]*r[aā]*t",
    r"m[aā]*h[aā]+bh[aā]*r[aā]+[mn]",  # mahabharam, mahabharaam
    r"andhra\s*m[aā]*h[aā]+bh",          # andhramahabh*
    r"bh[aā]+r[aā]*th[aā]*mlo",
    r"bh[aā]+r[aā]+rh[aā]*mlo",
    r"మహాభారత",
    r"మహాభరత",
    r"మహాభాత",                            # missing ర
    r"భారతం",
    r"భారత",
]

# ============================================================
# SKANDHA MAP (12 Skandhas of Srimad Bhagavatam)
# All spelling variants from actual video titles
# ============================================================
SKANDHA_MAP = {
    # 1st - Prathama
    "prathama": "Prathama Skandha", "pradhama": "Prathama Skandha",
    "pratham": "Prathama Skandha",
    # 2nd - Dvitiya
    "dvitiya": "Dvitiya Skandha", "dvitheeya": "Dvitiya Skandha",
    "dwitiya": "Dvitiya Skandha", "dwiteeya": "Dvitiya Skandha",
    "dwitewya": "Dvitiya Skandha",
    # 3rd - Tritiya
    "tritiya": "Tritiya Skandha", "thritheeya": "Tritiya Skandha",
    "tritheeya": "Tritiya Skandha", "thruteeya": "Tritiya Skandha",
    "truteeya": "Tritiya Skandha", "thrutheeya": "Tritiya Skandha",
    "thruteea": "Tritiya Skandha",
    # 4th - Chaturtha
    "chaturtha": "Chaturtha Skandha", "chathurdha": "Chaturtha Skandha",
    "chathurtha": "Chaturtha Skandha", "chaturdha": "Chaturtha Skandha",
    "chathurda": "Chaturtha Skandha", "chathrdha": "Chaturtha Skandha",
    "chathudha": "Chaturtha Skandha", "chathurdga": "Chaturtha Skandha",
    "chathursha": "Chaturtha Skandha",
    # 5th - Panchama
    "panchama": "Panchama Skandha",
    # 6th - Shashtha
    "shashtha": "Shashtha Skandha", "shashta": "Shashtha Skandha",
    "shastama": "Shashtha Skandha", "shashtama": "Shashtha Skandha",
    # 7th - Saptama
    "saptama": "Saptama Skandha", "sapthama": "Saptama Skandha",
    "saphama": "Saptama Skandha", "saphtama": "Saptama Skandha",
    "saptma": "Saptama Skandha",
    # 8th - Ashtama
    "ashtama": "Ashtama Skandha", "astama": "Ashtama Skandha",
    # 9th - Navama
    "navama": "Navama Skandha", "nanama": "Navama Skandha",
    "nawama": "Navama Skandha",
    # 10th - Dashama
    "dashama": "Dashama Skandha", "dasama": "Dashama Skandha",
    "dasema": "Dashama Skandha", "dasma": "Dashama Skandha",
    # 11th - Ekadasha
    "ekadasha": "Ekadasha Skandha", "ekaadasa": "Ekadasha Skandha",
    "ekaadasha": "Ekadasha Skandha", "ekaadase": "Ekadasha Skandha",
    "ekadasa": "Ekadasha Skandha",
    # 12th - Dvadasha
    "dvadasha": "Dvadasha Skandha", "dwaadasa": "Dvadasha Skandha",
    "dwaadasha": "Dvadasha Skandha", "dwadasa": "Dvadasha Skandha",
}

# ============================================================
# KANDA MAP (7 Kandas of Ramayana)
# All spelling variants from actual video titles
# ============================================================
KANDA_MAP = {
    # Bala
    "bala": "Bala Kanda", "baala": "Bala Kanda",
    # Ayodhya
    "ayodhya": "Ayodhya Kanda", "ayodhyaa": "Ayodhya Kanda",
    "ayodya": "Ayodhya Kanda",
    # Aranya
    "aranya": "Aranya Kanda", "aaranya": "Aranya Kanda",
    "arany": "Aranya Kanda",
    # Kishkindha
    "kishkindha": "Kishkindha Kanda", "kishkinda": "Kishkindha Kanda",
    "kishkindhaa": "Kishkindha Kanda",
    # Sundara
    "sundara": "Sundara Kanda", "sundhara": "Sundara Kanda",
    # Yuddha
    "yuddha": "Yuddha Kanda", "yudhdha": "Yuddha Kanda",
    "yudhha": "Yuddha Kanda", "yudha": "Yuddha Kanda",
    "yudda": "Yuddha Kanda", "udda": "Yuddha Kanda",
    # Uttara
    "uttara": "Uttara Kanda", "utthara": "Uttara Kanda",
    "uthara": "Uttara Kanda", "urhara": "Uttara Kanda",
}

# ============================================================
# PARVA MAP (18 Parvas of Mahabharata)
# All spelling variants from actual video titles
# ============================================================
PARVA_MAP = {
    # 1. Adi
    "adi": "Adi Parva", "aadi": "Adi Parva", "aadhi": "Adi Parva", "adhi": "Adi Parva",
    # 2. Sabha
    "sabha": "Sabha Parva", "sabhaa": "Sabha Parva",
    # 3. Vana (Aranya)
    "vana": "Vana Parva", "aranya": "Vana Parva", "aaranya": "Vana Parva",
    # 4. Virata
    "virata": "Virata Parva", "viraata": "Virata Parva",
    # 5. Udyoga
    "udyoga": "Udyoga Parva", "udhyoga": "Udyoga Parva",
    # 6. Bhishma
    "bhishma": "Bhishma Parva", "bheeshma": "Bhishma Parva", "bhiishma": "Bhishma Parva",
    # 7. Drona
    "drona": "Drona Parva", "dhronaa": "Drona Parva", "dhrona": "Drona Parva",
    # 8. Karna
    "karna": "Karna Parva", "karnaa": "Karna Parva", "katna": "Karna Parva",
    # 9. Shalya
    "shalya": "Shalya Parva", "shalyaa": "Shalya Parva", "salya": "Shalya Parva",
    "shelya": "Shalya Parva",
    # 10. Sauptika
    "sauptika": "Sauptika Parva", "saupthika": "Sauptika Parva",
    "sowpthika": "Sauptika Parva", "soupthika": "Sauptika Parva",
    "souphika": "Sauptika Parva", "souptika": "Sauptika Parva",
    "soupthoka": "Sauptika Parva",
    # 11. Stri
    "stri": "Stri Parva", "sthree": "Stri Parva", "stree": "Stri Parva",
    # 12. Shanti
    "saanthi": "Shanti Parva", "shaanthi": "Shanti Parva", "shanti": "Shanti Parva",
    "santhi": "Shanti Parva", "saanti": "Shanti Parva", "santha": "Shanti Parva",
    # 13. Anushasana
    "anushasana": "Anushasana Parva", "anusaasana": "Anushasana Parva",
    "anushaasana": "Anushasana Parva", "aanusasanika": "Anushasana Parva",
    "aanusasinaka": "Anushasana Parva",
    # 14. Ashvamedhika
    "ashvamedhika": "Ashvamedhika Parva", "aswamedhika": "Ashvamedhika Parva",
    "ashwamedha": "Ashvamedhika Parva", "aswemedha": "Ashvamedhika Parva",
    # 15. Ashramavasika
    "ashramavasika": "Ashramavasika Parva", "aashramavasika": "Ashramavasika Parva",
    "aasramavasa": "Ashramavasika Parva",
    # 16. Mausala
    "mausala": "Mausala Parva", "mowsala": "Mausala Parva", "mousala": "Mausala Parva",
    # 17. Mahaprasthanika
    "mahaprasthanika": "Mahaprasthanika Parva", "mahaaprasthaanika": "Mahaprasthanika Parva",
    "mahaprasthana": "Mahaprasthanika Parva",
    # 18. Svargarohana
    "svargarohana": "Svargarohana Parva", "swargarohana": "Svargarohana Parva",
    "swargaarohana": "Svargarohana Parva",
}

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def matches_any(text, patterns):
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            return True
    return False

def has_parva_keyword(tl):
    """Check if title contains any variant of 'parva/parvam/paravam'."""
    return bool(re.search(r"parv|parav|patvam|పర్వ", tl))

def has_kanda_keyword(tl):
    """Check if title contains any variant of 'kanda/kaanda'."""
    return bool(re.search(r"kaand|kand|kaanda|కాండ", tl))

def has_skandha_keyword(tl):
    """Check if title contains any variant of 'skandha/schandam'."""
    return bool(re.search(r"schand|skand|skandh|స్కంధ", tl))

# Telugu subcategory maps
TELUGU_SKANDHA_MAP = {
    "ప్రథమ": "Prathama Skandha",
    "ద్వితీయ": "Dvitiya Skandha",
    "తృతీయ": "Tritiya Skandha",
    "చతుర్థ": "Chaturtha Skandha",
    "పంచమ": "Panchama Skandha",
    "షష్ఠ": "Shashtha Skandha",
    "సప్తమ": "Saptama Skandha",
    "అష్టమ": "Ashtama Skandha",
    "నవమ": "Navama Skandha",
    "దశమ": "Dashama Skandha",
    "ఏకాదశ": "Ekadasha Skandha",
    "ద్వాదశ": "Dvadasha Skandha",
}

TELUGU_KANDA_MAP = {
    "బాల": "Bala Kanda",
    "అయోధ్య": "Ayodhya Kanda",
    "అరణ్య": "Aranya Kanda", "ఆరణ్య": "Aranya Kanda",
    "కిష్కింధ": "Kishkindha Kanda",
    "సుందర": "Sundara Kanda",
    "యుద్ధ": "Yuddha Kanda",
    "ఉత్తర": "Uttara Kanda",
}

TELUGU_PARVA_MAP = {
    "ఆది": "Adi Parva",
    "సభా": "Sabha Parva", "సభ": "Sabha Parva",
    "వన": "Vana Parva", "ఆరణ్య": "Vana Parva", "అరణ్య": "Vana Parva",
    "విరాట": "Virata Parva",
    "ఉద్యోగ": "Udyoga Parva",
    "భీష్మ": "Bhishma Parva",
    "ద్రోణ": "Drona Parva",
    "కర్ణ": "Karna Parva",
    "శల్య": "Shalya Parva",
    "సౌప్తిక": "Sauptika Parva",
    "స్త్రీ": "Stri Parva",
    "శాంతి": "Shanti Parva", "శాంథి": "Shanti Parva",
    "అనుశాసన": "Anushasana Parva",
    "ఆశ్వమేధిక": "Ashvamedhika Parva",
    "ఆశ్రమవాసిక": "Ashramavasika Parva",
    "మౌసల": "Mausala Parva",
    "మహాప్రస్థానిక": "Mahaprasthanika Parva",
    "స్వర్గారోహణ": "Svargarohana Parva",
}

def find_telugu_skandha(title):
    for key, val in TELUGU_SKANDHA_MAP.items():
        if key in title:
            return val
    return None

def find_telugu_kanda(title):
    for key in sorted(TELUGU_KANDA_MAP.keys(), key=len, reverse=True):
        # Match కాండ, కాం డ (with space), or సర్గ (sarga) as section indicator
        if key in title and re.search(r"కాండ|కాం\s*డ|సర్గ", title):
            return TELUGU_KANDA_MAP[key]
    return None

def find_telugu_parva(title):
    for key in sorted(TELUGU_PARVA_MAP.keys(), key=len, reverse=True):
        if key in title and re.search(r"పర్వ", title):
            return TELUGU_PARVA_MAP[key]
    # Also try "ఆరాన్య" variant of "ఆరణ్య"
    if "ఆరాన్య" in title and "పర్వ" in title:
        return "Vana Parva"
    return None

def find_skandha(title):
    tl = title.lower()
    # First try: skandha keyword + ordinal name
    for key in sorted(SKANDHA_MAP.keys(), key=len, reverse=True):
        if key in tl and has_skandha_keyword(tl):
            return SKANDHA_MAP[key]
    # Second try: compound words like "Astamaschanda", "thruteeyaschandam"
    # (ordinal joined directly with schand/skand)
    for key in sorted(SKANDHA_MAP.keys(), key=len, reverse=True):
        if re.search(key + r"\s*schand", tl) or re.search(key + r"\s*skand", tl):
            return SKANDHA_MAP[key]
    # Third try: "sarga" (chapter marker) + ordinal name
    for key in sorted(SKANDHA_MAP.keys(), key=len, reverse=True):
        if key in tl and "sarg" in tl:
            return SKANDHA_MAP[key]
    # Fourth try: ordinal name alone if long enough to be unambiguous
    for key in sorted(SKANDHA_MAP.keys(), key=len, reverse=True):
        if len(key) >= 7 and key in tl:
            return SKANDHA_MAP[key]
    # Fifth try: Telugu script (including mixed Telugu+Latin)
    result = find_telugu_skandha(title)
    if result:
        return result
    # Sixth try: Telugu transliterations in Latin script for mixed titles
    # e.g., "ఏకదసే SCHANDAM" — extract Telugu ordinal
    telugu_ordinal_map = {
        "ఏకదసే": "Ekadasha Skandha", "ఏకాదశ": "Ekadasha Skandha",
        "ద్వాదశ": "Dvadasha Skandha", "దశమ": "Dashama Skandha",
        "నవమ": "Navama Skandha", "అష్టమ": "Ashtama Skandha",
        "సప్తమ": "Saptama Skandha", "షష్ఠ": "Shashtha Skandha",
        "పంచమ": "Panchama Skandha", "చతుర్థ": "Chaturtha Skandha",
        "తృతీయ": "Tritiya Skandha", "ద్వితీయ": "Dvitiya Skandha",
        "ప్రథమ": "Prathama Skandha",
    }
    for tel_key, val in telugu_ordinal_map.items():
        if tel_key in title:
            return val
    return "General"

def find_kanda(title):
    tl = title.lower()
    # First try: kanda keyword + name
    for key in sorted(KANDA_MAP.keys(), key=len, reverse=True):
        if key in tl and has_kanda_keyword(tl):
            return KANDA_MAP[key]
    # Second try: "sarga" (chapter marker) + name
    for key in sorted(KANDA_MAP.keys(), key=len, reverse=True):
        if key in tl and "sarg" in tl:
            return KANDA_MAP[key]
    # Third try: name alone if long enough to be unambiguous
    for key in sorted(KANDA_MAP.keys(), key=len, reverse=True):
        if len(key) >= 7 and key in tl:
            return KANDA_MAP[key]
    return None  # Return None instead of "General" so caller can try fallback

def find_parva(title):
    tl = title.lower()
    # First try: parva keyword + name
    for key in sorted(PARVA_MAP.keys(), key=len, reverse=True):
        if key in tl and has_parva_keyword(tl):
            return PARVA_MAP[key]
    # Second try: name alone if long enough (>= 7 chars) to be unambiguous
    for key in sorted(PARVA_MAP.keys(), key=len, reverse=True):
        if len(key) >= 7 and key in tl:
            return PARVA_MAP[key]
    return None  # Return None instead of "General" so caller can try fallback

def find_ramayana_sub(title):
    """Find Ramayana subcategory: try kanda first, then parva, then Telugu."""
    result = find_kanda(title)
    if result:
        return result
    # Fallback: some Ramayana titles use parva terminology
    result = find_parva(title)
    if result:
        return result
    # Telugu script detection
    result = find_telugu_kanda(title)
    if result:
        return result
    result = find_telugu_parva(title)
    if result:
        return result
    return "General"

def find_mahabharata_sub(title):
    """Find Mahabharata subcategory: try parva first, then kanda, then Telugu."""
    result = find_parva(title)
    if result:
        return result
    # Fallback: some Mahabharata titles use kanda terminology
    result = find_kanda(title)
    if result:
        return result
    # Telugu script detection
    result = find_telugu_parva(title)
    if result:
        return result
    result = find_telugu_kanda(title)
    if result:
        return result
    return "General"

def find_gita_chapter(title):
    m = re.search(r"(?:chapter|adhyaya|adhyaayam)\s*(\d+)", title, re.IGNORECASE)
    if m:
        ch = int(m.group(1))
        if 1 <= ch <= 18:
            return f"Chapter {ch}"
    # Try Telugu numerals or other patterns
    m = re.search(r"(\d+)\s*(?:va|th|st|nd|rd)\s*(?:chapter|adhyaya)", title, re.IGNORECASE)
    if m:
        ch = int(m.group(1))
        if 1 <= ch <= 18:
            return f"Chapter {ch}"
    return "General"

# ============================================================
# DISCOURSE TOPICS (for Spiritual Discourses catch-all)
# ============================================================
DISCOURSE_TOPICS = [
    (r"thiruppavai|thiruppaavai|thirppavai|tiruppavai|tiruppaavai", "Thiruppavai"),
    (r"m[aā]+gh[aā]*\s*pur[aā]+n[aā]*m|magha\s*puranam", "Magha Puranam"),
    (r"godakalyaanam|goda\s*kalyanam|goda\s*kalyaanam", "Goda Kalyanam"),
    (r"vaikunt[th]*a|vaikuntt|vaikuntaekadasi", "Vaikunta Ekadashi"),
    (r"narayaniyam|naarayaniyam|narayaneeyam", "Narayaniyam"),
    (r"vishnu\s*sahasranama|vishnusahasra", "Vishnu Sahasranamam"),
    (r"lalitha\s*sahasranama|lalithasahasra", "Lalitha Sahasranamam"),
    (r"hanuman\s*chalisa|hanumanchalisa", "Hanuman Chalisa"),
    (r"devi\s*bhagavat|devi\s*mahatm|devibhagavat", "Devi Bhagavatam"),
    (r"garuda\s*puran|garudapuran", "Garuda Puranam"),
    (r"siva\s*puran|shiva\s*puran|sivapuran|shivapuran", "Shiva Puranam"),
    (r"vishnu\s*puran|vishnupuran", "Vishnu Puranam"),
    (r"skanda\s*puran|skandapuran", "Skanda Puranam"),
    (r"k[aā]+r[th]*[iī]*k[aā]*\s*pur[aā]+n|karthikapuran", "Karthika Puranam"),
    (r"radiogee*th?[aā]*m|radio\s*geetham", "Radio Geetham"),
    (r"shastipoorthi|shashtipoorthi|shashtipurthi", "Shastipoorthi"),
    (r"ramana[vw]ami|rama\s*navami|sriramanavami|ramanavami", "Sri Rama Navami"),
    (r"guru\s*pour[n]*ima|gurupournima|gurupurnima", "Guru Pournima"),
    (r"sankranthi|sankranti|makara\s*sankra", "Sankranthi"),
    (r"ugadi|ugaadi", "Ugadi"),
    (r"diwali|deepavali|deepawali", "Deepavali"),
    (r"navaratri|navaraatri|dasara|dussehra", "Navaratri"),
    (r"shivaratri|sivaraatri|mahashivaratri|mahasivaratri", "Shivaratri"),
    (r"sundara\s*kanda|sundarakanda", "Sundara Kandam (Discourse)"),
    (r"aditya\s*hrudayam|adityahrudayam", "Aditya Hrudayam"),
    (r"sampoorna\s*ramayanam|sampoorna\s*ramayan", "Sampoorna Ramayanam"),
    (r"upanishad|upanishat", "Upanishads"),
    (r"stot[rh]*am|stotram|stothram", "Stotrams"),
    (r"suprabhatam|suprabhaatam", "Suprabhatam"),
    (r"satyanarayana\s*vrat|satyanarayana\s*pooja", "Satyanarayana Vratam"),
    (r"rudrabhishek|rudram", "Rudram"),
    (r"ashtothram|ashtottaram", "Ashtottaram"),
]

def extract_discourse_topic(title):
    for pattern, topic in DISCOURSE_TOPICS:
        if re.search(pattern, title, re.IGNORECASE):
            return topic
    # Video2126/* and similar numbered titles
    if re.match(r"^(video\s*\d+|vid\s*\d+|vedio\s*\d+|\d{4}/\d+)$", title, re.IGNORECASE):
        return "Untitled Discourses"
    if re.match(r"^video\s*\d+/", title, re.IGNORECASE):
        return "Untitled Discourses"
    if re.match(r"^videi\d+/", title, re.IGNORECASE):
        return "Untitled Discourses"
    # Date-only titles (e.g., "May 22, 2021", "April 15, 2021")
    if re.match(r"^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d", title, re.IGNORECASE):
        return "Untitled Discourses"
    if re.match(r"^\d{1,2}\s+(జనవరి|ఫిబ్రవరి|మార్చి|ఏప్రిల్|మే|జూన్|జూలై|ఆగస్టు|సెప్టెంబర్|అక్టోబర్|నవంబర్|డిసెంబర్)", title):
        return "Untitled Discourses"
    if re.match(r"^\d{1,2}\s+\w+\s+\d{4}$", title, re.IGNORECASE):
        return "Untitled Discourses"
    # Karthika Puranam variants (various capitalizations/spellings)
    if re.search(r"k[aā]*[r]*th[iī]*[ck]*[aā]*\s*p[uo]r[aā]*n", title, re.IGNORECASE):
        return "Karthika Puranam"
    if re.search(r"k[aā]*[r]*thee*ka\s*p[uo]r[aā]*n", title, re.IGNORECASE):
        return "Karthika Puranam"
    # Sai charitra / Sai-related titles
    if re.search(r"sai\s*chari", title, re.IGNORECASE):
        return "Sai Charitra"
    if re.search(r"guru\s*chari", title, re.IGNORECASE):
        return "Guru Charitra"
    # Satsangam titles
    if re.search(r"^సత్సంగ", title):
        return "Satsangam"
    if re.match(r"^satsangam", title, re.IGNORECASE):
        return "Satsangam"
    # Temple events and celebrations
    if re.search(r"kalyanam|kalyanothsav|shobha\s*yatra|celebrations|haarathi|harathi", title, re.IGNORECASE):
        return "Temple Events"
    if re.search(r"seva\s+(at|on)|ekaanthaseva|ekantaseva|pavvalimpu|pavvavimpu", title, re.IGNORECASE):
        return "Temple Events"
    # Clean up title to extract meaningful topic
    cleaned = re.sub(r"\s*(part|chapter|sarga|sloka|slokam|pravachanam|yadhatadham|episode)\s*\d*.*$", "", title, flags=re.IGNORECASE).strip()
    if cleaned and len(cleaned) > 2:
        return cleaned[:60]
    return "Other Discourses"

# ============================================================
# MAIN CATEGORIZATION FUNCTION
# ============================================================

def categorize_video(title, description=""):
    """Categorize using TITLE ONLY for main category (avoids description false positives)."""
    # Check Gita FIRST (before Bhagavatam, since "bhagavad" is in both)
    if matches_any(title, GITA_PATTERNS):
        return "bhagavadgeetha", "Bhagavadgeetha", find_gita_chapter(title)
    # Check Bhagavatam
    if matches_any(title, BHAGAVATAM_PATTERNS):
        return "srimadbhagavatam", "Srimadbhagavatam", find_skandha(title)
    # Check Ramayana
    if matches_any(title, RAMAYANA_PATTERNS):
        return "ramayanam", "Ramayanam", find_ramayana_sub(title)
    # Check Mahabharata
    if matches_any(title, MAHABHARATA_PATTERNS):
        return "mahabharatam", "Mahabharatam", find_mahabharata_sub(title)
    # Fallback: check description too (but only for these 4 main categories)
    if description:
        if matches_any(description, GITA_PATTERNS):
            return "bhagavadgeetha", "Bhagavadgeetha", find_gita_chapter(title)
        if matches_any(description, BHAGAVATAM_PATTERNS):
            return "srimadbhagavatam", "Srimadbhagavatam", find_skandha(title)
        if matches_any(description, RAMAYANA_PATTERNS):
            return "ramayanam", "Ramayanam", find_ramayana_sub(title)
        if matches_any(description, MAHABHARATA_PATTERNS):
            return "mahabharatam", "Mahabharatam", find_mahabharata_sub(title)
    # Catch-all: Spiritual Discourses
    return "spiritual-discourses", "Spiritual Discourses", extract_discourse_topic(title)

# ============================================================
# MAIN EXECUTION
# ============================================================

with open("data/raw/all-videos.json", encoding="utf-8") as f:
    videos = json.load(f)

print(f"Loaded {len(videos)} videos from raw data\n")

categories = defaultdict(lambda: defaultdict(list))
lang_counts = {"english": 0, "telugu": 0, "mixed": 0}

for v in videos:
    cat_id, cat_name, sub_name = categorize_video(v["title"], v.get("description", ""))
    lang = detect_language(v["title"] + " " + v.get("description", ""))
    v["category"] = cat_id
    v["categoryName"] = cat_name
    v["subcategory"] = sub_name
    v["language"] = lang
    categories[cat_name][sub_name].append(v)
    lang_counts[lang] += 1

# ============================================================
# PRINT GRID
# ============================================================
print("=" * 80)
print(f"{'Category':<25} {'Subcategory':<40} {'Videos':>8}")
print("-" * 80)

grand_total = 0
for cat_name in ["Srimadbhagavatam", "Ramayanam", "Mahabharatam", "Bhagavadgeetha", "Spiritual Discourses"]:
    subs = categories.get(cat_name, {})
    cat_total = sum(len(v) for v in subs.values())
    grand_total += cat_total
    sorted_subs = sorted(subs.items(), key=lambda x: -len(x[1]))
    first = True
    for sub_name, sub_videos in sorted_subs:
        dn = sub_name[:38] if len(sub_name) > 38 else sub_name
        if first:
            print(f"{cat_name:<25} {dn:<40} {len(sub_videos):>8}")
            first = False
        else:
            print(f"{'':25} {dn:<40} {len(sub_videos):>8}")
    print(f"{'':25} {'--- TOTAL ---':<40} {cat_total:>8}")
    print("-" * 80)

print(f"{'GRAND TOTAL':<25} {'':40} {grand_total:>8}")
print(f"\nLanguage: EN={lang_counts['english']}, TE={lang_counts['telugu']}, MX={lang_counts['mixed']}")

# Show "General" counts for analysis
print(f"\n{'='*60}")
print("GENERAL BUCKET ANALYSIS (videos needing better matching):")
print(f"{'='*60}")
for cat_name in ["Srimadbhagavatam", "Ramayanam", "Mahabharatam", "Bhagavadgeetha"]:
    gen_count = len(categories.get(cat_name, {}).get("General", []))
    total = sum(len(v) for v in categories.get(cat_name, {}).values())
    pct = (gen_count / total * 100) if total > 0 else 0
    print(f"  {cat_name:<25} General: {gen_count:>5} / {total:>5}  ({pct:.1f}%)")

# Show sample General titles for debugging
print(f"\n--- Sample General titles (first 5 per category) ---")
for cat_name in ["Srimadbhagavatam", "Ramayanam", "Mahabharatam", "Bhagavadgeetha"]:
    gen = categories.get(cat_name, {}).get("General", [])
    if gen:
        print(f"\n  {cat_name}:")
        for v in gen[:5]:
            print(f"    - {v['title'][:80]}")

# Save categorized
with open("data/raw/categorized-videos.json", "w", encoding="utf-8") as f:
    json.dump(videos, f, ensure_ascii=False, indent=2)
print(f"\nSaved categorized data to data/raw/categorized-videos.json")

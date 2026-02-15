"""
Fetch ALL videos from Sivananda Sastry's YouTube channel and categorize them.
Uses fuzzy matching on video titles (English + Telugu script) to classify into:
  1. Srimadbhagavatam (by Skandha)
  2. Ramayanam (by Kanda)
  3. Mahabharatam (by Parva)
  4. Bhagavadgeetha (by Chapter)
  5. Spiritual Discourses (catch-all, sub-grouped by topic)
"""

import json
import re
import os
import sys
import urllib.request
import time
from collections import defaultdict

API_KEY = os.environ.get("YOUTUBE_API_KEY", "AIzaSyCrcRfMO8gpB_3L8FmgBs44IrfGJ3QNC3Y")
PLAYLIST_ID = "UU66P5nHcEvcx0oJr-nBT0xg"  # Uploads playlist
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

# ============================================================
# CATEGORY DEFINITIONS WITH FUZZY PATTERNS
# ============================================================

# --- SRIMADBHAGAVATAM ---
BHAGAVATAM_PATTERNS = [
    r"bh[aā]+g[aā]*v[aā]*th",       # bhaagavatha, bhagavatha, bhagavatham
    r"bh[aā]+g[aā]*v[aā]*t[aā]*m",  # bhagavatam, bhagavatham
    r"srimad\s*bh[aā]*g",            # srimadbhagavatham
    r"శ్రీమద్భాగవత",                 # Telugu: Srimad Bhagavatam
    r"భాగవత",                         # Telugu: Bhagavata
]

# Skandha (section) mapping - Telugu transliterations of Sanskrit ordinals
SKANDHA_MAP = {
    "prathama": "Prathama Skandha",
    "pradhama": "Prathama Skandha",
    "pratham":  "Prathama Skandha",
    "first":   "Prathama Skandha",
    "1st":     "Prathama Skandha",
    "dvitiya":  "Dvitiya Skandha",
    "dvitheeya":"Dvitiya Skandha",
    "dwitiya":  "Dvitiya Skandha",
    "second":   "Dvitiya Skandha",
    "2nd":      "Dvitiya Skandha",
    "tritiya":   "Tritiya Skandha",
    "thritheeya":"Tritiya Skandha",
    "tritheeya": "Tritiya Skandha",
    "third":     "Tritiya Skandha",
    "3rd":       "Tritiya Skandha",
    "chaturtha":  "Chaturtha Skandha",
    "chathurdha":  "Chaturtha Skandha",
    "chathurtha":  "Chaturtha Skandha",
    "chaturdha":   "Chaturtha Skandha",
    "chathurda":   "Chaturtha Skandha",
    "fourth":      "Chaturtha Skandha",
    "4th":         "Chaturtha Skandha",
    "panchama":  "Panchama Skandha",
    "fifth":     "Panchama Skandha",
    "5th":       "Panchama Skandha",
    "shashtha":  "Shashtha Skandha",
    "shashta":   "Shashtha Skandha",
    "sixth":     "Shashtha Skandha",
    "6th":       "Shashtha Skandha",
    "saptama":   "Saptama Skandha",
    "sapthama":  "Saptama Skandha",
    "seventh":   "Saptama Skandha",
    "7th":       "Saptama Skandha",
    "ashtama":   "Ashtama Skandha",
    "eighth":    "Ashtama Skandha",
    "8th":       "Ashtama Skandha",
    "navama":    "Navama Skandha",
    "nanama":    "Navama Skandha",    # common typo
    "nawama":    "Navama Skandha",
    "ninth":     "Navama Skandha",
    "9th":       "Navama Skandha",
    "dashama":   "Dashama Skandha",
    "dasama":    "Dashama Skandha",
    "dasema":    "Dashama Skandha",
    "dasma":     "Dashama Skandha",
    "tenth":     "Dashama Skandha",
    "10th":      "Dashama Skandha",
    "ekadasha":   "Ekadasha Skandha",
    "ekaadasa":   "Ekadasha Skandha",
    "ekaadasha":  "Ekadasha Skandha",
    "eleventh":   "Ekadasha Skandha",
    "11th":       "Ekadasha Skandha",
    "dvadasha":    "Dvadasha Skandha",
    "dwaadasa":    "Dvadasha Skandha",
    "dwaadasha":   "Dvadasha Skandha",
    "dwadasa":     "Dvadasha Skandha",
    "twelfth":     "Dvadasha Skandha",
    "12th":        "Dvadasha Skandha",
}

# Regex to find skandha references: "navama schandam", "Ashtama skandham", etc.
SKANDHA_REGEX = re.compile(
    r"(" + "|".join(re.escape(k) for k in sorted(SKANDHA_MAP.keys(), key=len, reverse=True)) +
    r")\s*(?:s[ck]h?[aā]nd[aā]*[mh]?|skandh[aā]*[mh]?|sarg[aā]*)",
    re.IGNORECASE
)

# --- RAMAYANAM ---
RAMAYANA_PATTERNS = [
    r"r[aā]+m[aā]*y[aā]*n",         # ramayanam, raamayanam, ramayana
    r"valmiki\s*r[aā]+m",            # valmikiramayana
    r"రామాయణ",                        # Telugu: Ramayanam
    r"వాల్మీకి",                       # Telugu: Valmiki
]

# Kanda (book) mapping
KANDA_MAP = {
    "bala":      "Bala Kanda",
    "baala":     "Bala Kanda",
    "ayodhya":   "Ayodhya Kanda",
    "ayodhyaa":  "Ayodhya Kanda",
    "aranya":    "Aranya Kanda",
    "aaranya":   "Aranya Kanda",
    "kishkindha":"Kishkindha Kanda",
    "kishkinda": "Kishkindha Kanda",
    "kishkindhaa":"Kishkindha Kanda",
    "sundara":   "Sundara Kanda",
    "sundhara":  "Sundara Kanda",
    "yuddha":    "Yuddha Kanda",
    "yudhdha":   "Yuddha Kanda",
    "yudhha":    "Yuddha Kanda",
    "uttara":    "Uttara Kanda",
    "utthara":   "Uttara Kanda",
    "uthara":    "Uttara Kanda",
}

KANDA_REGEX = re.compile(
    r"(" + "|".join(re.escape(k) for k in sorted(KANDA_MAP.keys(), key=len, reverse=True)) +
    r")\s*(?:k[aā]+nd[aā]*[mh]?)",
    re.IGNORECASE
)

# --- MAHABHARATAM ---
MAHABHARATA_PATTERNS = [
    r"m[aā]*h[aā]+bh[aā]*r[aā]*t",  # mahabharatam, mahabharatha
    r"bh[aā]+r[aā]*th[aā]*mlo",      # bhaarathamlo, bharathamlo
    r"bh[aā]+r[aā]+rh[aā]*mlo",      # bhaararhamlo
    r"మహాభారత",                        # Telugu: Mahabharata
    r"భారత",                           # Telugu: Bharata
]

# Parva (book) mapping - all 18 parvas of Mahabharata
PARVA_MAP = {
    "adi":         "Adi Parva",
    "aadi":        "Adi Parva",
    "aadhi":       "Adi Parva",
    "adhi":        "Adi Parva",
    "sabha":       "Sabha Parva",
    "sabhaa":      "Sabha Parva",
    "vana":        "Vana Parva",
    "van":         "Vana Parva",
    "aranya":      "Vana Parva",       # Aranya Parva = Vana Parva
    "aaranya":     "Vana Parva",
    "virata":      "Virata Parva",
    "viraata":     "Virata Parva",
    "udyoga":      "Udyoga Parva",
    "udhyoga":     "Udyoga Parva",
    "bhishma":     "Bhishma Parva",
    "bheeshma":    "Bhishma Parva",
    "bhiishma":    "Bhishma Parva",
    "drona":       "Drona Parva",
    "dhronaa":     "Drona Parva",
    "dhrona":      "Drona Parva",
    "karna":       "Karna Parva",
    "karnaa":      "Karna Parva",
    "shalya":      "Shalya Parva",
    "shalyaa":     "Shalya Parva",
    "salya":       "Shalya Parva",
    "sauptika":    "Sauptika Parva",
    "saupthika":   "Sauptika Parva",
    "sowpthika":   "Sauptika Parva",
    "stri":        "Stri Parva",
    "sthree":      "Stri Parva",
    "stree":       "Stri Parva",
    "saanthi":     "Shanti Parva",
    "shaanthi":    "Shanti Parva",
    "shanti":      "Shanti Parva",
    "santhi":      "Shanti Parva",
    "saanti":      "Shanti Parva",
    "anushasana":  "Anushasana Parva",
    "anusaasana":  "Anushasana Parva",
    "anushaasana": "Anushasana Parva",
    "ashvamedhika":"Ashvamedhika Parva",
    "aswamedhika": "Ashvamedhika Parva",
    "ashwamedha":  "Ashvamedhika Parva",
    "ashramavasika":"Ashramavasika Parva",
    "aashramavasika":"Ashramavasika Parva",
    "mausala":     "Mausala Parva",
    "mowsala":     "Mausala Parva",
    "mahaprasthanika":"Mahaprasthanika Parva",
    "mahaaprasthaanika":"Mahaprasthanika Parva",
    "svargarohana":"Svargarohana Parva",
    "swargarohana":"Svargarohana Parva",
    "swargaarohana":"Svargarohana Parva",
}

PARVA_REGEX = re.compile(
    r"(" + "|".join(re.escape(k) for k in sorted(PARVA_MAP.keys(), key=len, reverse=True)) +
    r")\s*(?:p[aā]*rv[aā]*[mh]?)",
    re.IGNORECASE
)

# --- BHAGAVADGEETHA ---
GITA_PATTERNS = [
    r"bh[aā]*g[aā]*v[aā]*d\s*g[eiē]+th?[aā]",  # bhagavadgeetha, bhagavad gita
    r"bh[aā]*g[aā]*v[aā]*d\s*g[eiē]+t[aā]",     # bhagavadgita
    r"g[eiē]+th?[aā]\s*(?:chapter|adhyaya|slok)",  # geetha chapter, geeta sloka
    r"భగవద్గీత",                                    # Telugu: Bhagavad Gita
    r"గీతా",                                        # Telugu: Gita
]

# ============================================================
# LANGUAGE DETECTION
# ============================================================

TELUGU_RANGE = re.compile(r"[\u0C00-\u0C7F]")

def detect_language(text):
    """Detect language based on Telugu Unicode character ratio."""
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
# CATEGORIZATION ENGINE
# ============================================================

def matches_any(text, patterns):
    """Check if text matches any of the given regex patterns."""
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False

def find_skandha(title):
    """Extract Skandha (section) from Bhagavatam video title."""
    title_lower = title.lower()
    # Try regex for "navama schandam" etc.
    m = SKANDHA_REGEX.search(title_lower)
    if m:
        key = m.group(1).lower()
        if key in SKANDHA_MAP:
            return SKANDHA_MAP[key]
    # Fallback: check each key as substring
    for key in sorted(SKANDHA_MAP.keys(), key=len, reverse=True):
        if key in title_lower and ("schand" in title_lower or "skand" in title_lower or "sarg" in title_lower):
            return SKANDHA_MAP[key]
    return "General"

def find_kanda(title):
    """Extract Kanda (book) from Ramayana video title."""
    title_lower = title.lower()
    m = KANDA_REGEX.search(title_lower)
    if m:
        key = m.group(1).lower()
        if key in KANDA_MAP:
            return KANDA_MAP[key]
    # Fallback: check each key + "kaand" or "kand"
    for key in sorted(KANDA_MAP.keys(), key=len, reverse=True):
        if key in title_lower and ("kaand" in title_lower or "kand" in title_lower or "kaanda" in title_lower):
            return KANDA_MAP[key]
    return "General"

def find_parva(title):
    """Extract Parva (book) from Mahabharata video title."""
    title_lower = title.lower()
    m = PARVA_REGEX.search(title_lower)
    if m:
        key = m.group(1).lower()
        if key in PARVA_MAP:
            return PARVA_MAP[key]
    # Fallback: check each key + "parv"
    for key in sorted(PARVA_MAP.keys(), key=len, reverse=True):
        if key in title_lower and "parv" in title_lower:
            return PARVA_MAP[key]
    return "General"

def find_gita_chapter(title):
    """Extract chapter number from Bhagavad Gita video title."""
    m = re.search(r"chapter\s*(\d+)", title, re.IGNORECASE)
    if m:
        ch = int(m.group(1))
        if 1 <= ch <= 18:
            return f"Chapter {ch}"
    m = re.search(r"adhyaya\s*(\d+)", title, re.IGNORECASE)
    if m:
        ch = int(m.group(1))
        if 1 <= ch <= 18:
            return f"Chapter {ch}"
    return "General"

def extract_discourse_topic(title):
    """For Spiritual Discourses catch-all, group by topic name."""
    title_lower = title.lower().strip()

    # Known topic patterns (fuzzy)
    TOPIC_PATTERNS = [
        (r"thiruppavai|thiruppaavai|thirppavai|tiruppavai|తిరుప్పావై", "Thiruppavai"),
        (r"m[aā]+gh[aā]*pur[aā]+n[aā]*m|మాఘపురాణ", "Magha Puranam"),
        (r"godakalyaanam|goda\s*kalyanam|గోదాకల్యాణ", "Goda Kalyanam"),
        (r"vaikunt[th]*a|vaikuntt|వైకుంఠ", "Vaikunta Ekadashi"),
        (r"narayaniyam|naarayaniyam|నారాయణీయ", "Narayaniyam"),
        (r"vishnu\s*sahasranama|విష్ణుసహస్ర", "Vishnu Sahasranamam"),
        (r"lalitha\s*sahasranama|లలితాసహస్ర", "Lalitha Sahasranamam"),
        (r"sundara\s*kaanda|సుందరకాండ", "Sundara Kanda Parayanam"),
        (r"hanuman\s*chalisa|హనుమాన్\s*చాలీసా", "Hanuman Chalisa"),
        (r"devi\s*bhagavat|devi\s*mahatmya|దేవీభాగవత", "Devi Bhagavatam"),
        (r"garuda\s*puran|గరుడపురాణ", "Garuda Puranam"),
        (r"siva\s*puran|shiva\s*puran|శివపురాణ", "Shiva Puranam"),
        (r"vishnu\s*puran|విష్ణుపురాణ", "Vishnu Puranam"),
        (r"bhagavat\s*puran|భాగవతపురాణ", "Bhagavata Puranam"),
        (r"skanda\s*puran|స్కందపురాణ", "Skanda Puranam"),
        (r"dakshinamurthy|దక్షిణామూర్తి", "Dakshinamurthy Stotram"),
        (r"adhyatma\s*ramayan|ఆధ్యాత్మరామాయణ", "Adhyatma Ramayanam"),
        (r"stotra|stotram|స్తోత్ర", "Stotras"),
        (r"bhajan|భజన", "Bhajans"),
    ]

    for pattern, topic in TOPIC_PATTERNS:
        if re.search(pattern, title, re.IGNORECASE):
            return topic

    # If title starts with "Video" + number → "Untitled Discourses"
    if re.match(r"^video\s*\d+", title_lower):
        return "Untitled Discourses"

    # Extract first meaningful word(s) as topic
    # Remove common suffixes like "part N", "chapter N", etc.
    cleaned = re.sub(r"\s*(part|chapter|sarga|sloka|pravachanam|yadhatadham)\s*\d*.*$", "", title, flags=re.IGNORECASE).strip()
    if cleaned and len(cleaned) > 2:
        # Capitalize properly
        return cleaned[:60]  # Truncate long titles

    return "Other Discourses"

def categorize_video(title, description=""):
    """Categorize a video based on its title (and optionally description)."""
    combined = f"{title} {description}"

    # Priority order: check main 4 categories first
    # 1. BHAGAVADGEETHA (check before Bhagavatam to avoid confusion)
    if matches_any(combined, GITA_PATTERNS):
        subcategory = find_gita_chapter(title)
        return "bhagavadgeetha", "Bhagavadgeetha", subcategory

    # 2. SRIMADBHAGAVATAM
    if matches_any(combined, BHAGAVATAM_PATTERNS):
        subcategory = find_skandha(title)
        return "srimadbhagavatam", "Srimadbhagavatam", subcategory

    # 3. RAMAYANAM
    if matches_any(combined, RAMAYANA_PATTERNS):
        subcategory = find_kanda(title)
        return "ramayanam", "Ramayanam", subcategory

    # 4. MAHABHARATAM
    if matches_any(combined, MAHABHARATA_PATTERNS):
        subcategory = find_parva(title)
        return "mahabharatam", "Mahabharatam", subcategory

    # 5. SPIRITUAL DISCOURSES (catch-all)
    subcategory = extract_discourse_topic(title)
    return "spiritual-discourses", "Spiritual Discourses", subcategory

# ============================================================
# YOUTUBE API FETCHER
# ============================================================

def fetch_all_videos():
    """Fetch ALL videos from the channel's uploads playlist."""
    videos = []
    page_token = ""
    page_num = 0

    while True:
        url = (
            f"https://www.googleapis.com/youtube/v3/playlistItems"
            f"?part=snippet&playlistId={PLAYLIST_ID}&maxResults=50"
            f"&key={API_KEY}"
        )
        if page_token:
            url += f"&pageToken={page_token}"

        # Retry up to 3 times on transient errors
        data = None
        for attempt in range(3):
            try:
                req = urllib.request.urlopen(url, timeout=30)
                data = json.loads(req.read())
                break
            except Exception as e:
                if attempt < 2:
                    time.sleep(2 * (attempt + 1))
                else:
                    print(f"\n  ERROR on page {page_num} after 3 retries: {e}")

        if data is None:
            break

        items = data.get("items", [])
        for item in items:
            snippet = item["snippet"]
            vid = snippet.get("resourceId", {}).get("videoId", "")
            if not vid:
                continue

            title = snippet.get("title", "")
            description = snippet.get("description", "")
            published = snippet.get("publishedAt", "")[:10]
            thumbnail = snippet.get("thumbnails", {}).get("medium", {}).get("url", "")

            videos.append({
                "id": vid,
                "title": title,
                "description": description,
                "published": published,
                "thumbnail": thumbnail,
            })

        page_num += 1
        total = len(videos)
        sys.stdout.write(f"\r  Fetched {total} videos ({page_num} pages)...")
        sys.stdout.flush()

        page_token = data.get("nextPageToken", "")
        if not page_token:
            break

        # Small delay to be nice to the API
        time.sleep(0.1)

    print(f"\n  Done! Total: {len(videos)} videos")
    return videos

# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 60)
    print("SIVANANDA SASTRY - VIDEO FETCH & CATEGORIZE")
    print("=" * 60)

    # Step 1: Fetch all videos
    print("\n[1/3] Fetching ALL videos from YouTube API...")
    videos = fetch_all_videos()

    # Save raw data
    os.makedirs(os.path.join(OUTPUT_DIR, "raw"), exist_ok=True)
    raw_path = os.path.join(OUTPUT_DIR, "raw", "all-videos.json")
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)
    print(f"  Saved raw data to {raw_path}")

    # Step 2: Categorize
    print("\n[2/3] Categorizing videos...")
    categories = defaultdict(lambda: defaultdict(list))
    lang_counts = {"english": 0, "telugu": 0, "mixed": 0}

    for video in videos:
        cat_id, cat_name, sub_name = categorize_video(video["title"], video["description"])
        lang = detect_language(video["title"] + " " + video["description"])
        video["category"] = cat_id
        video["categoryName"] = cat_name
        video["subcategory"] = sub_name
        video["language"] = lang
        categories[cat_name][sub_name].append(video)
        lang_counts[lang] += 1

    # Step 3: Print categorization grid
    print("\n[3/3] CATEGORIZATION RESULTS")
    print("=" * 70)
    print(f"{'Category':<25} {'Subcategory':<30} {'Videos':>8}")
    print("-" * 70)

    grand_total = 0
    for cat_name in ["Srimadbhagavatam", "Ramayanam", "Mahabharatam", "Bhagavadgeetha", "Spiritual Discourses"]:
        subs = categories.get(cat_name, {})
        cat_total = sum(len(v) for v in subs.values())
        grand_total += cat_total

        # Sort subcategories
        sorted_subs = sorted(subs.items(), key=lambda x: -len(x[1]))
        first = True
        for sub_name, sub_videos in sorted_subs:
            if first:
                print(f"{cat_name:<25} {sub_name:<30} {len(sub_videos):>8}")
                first = False
            else:
                print(f"{'':.<25} {sub_name:<30} {len(sub_videos):>8}")

        print(f"{'':.<25} {'--- TOTAL ---':<30} {cat_total:>8}")
        print("-" * 70)

    print(f"{'GRAND TOTAL':<25} {'':.<30} {grand_total:>8}")
    print(f"\nLanguage: English={lang_counts['english']}, Telugu={lang_counts['telugu']}, Mixed={lang_counts['mixed']}")

    # Save categorized data
    categorized_path = os.path.join(OUTPUT_DIR, "raw", "categorized-videos.json")
    with open(categorized_path, "w", encoding="utf-8") as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)
    print(f"\nSaved categorized data to {categorized_path}")

    # Print sample titles for each category (for verification)
    print("\n" + "=" * 70)
    print("SAMPLE TITLES PER CATEGORY (first 3 each)")
    print("=" * 70)
    for cat_name in ["Srimadbhagavatam", "Ramayanam", "Mahabharatam", "Bhagavadgeetha", "Spiritual Discourses"]:
        subs = categories.get(cat_name, {})
        print(f"\n--- {cat_name} ---")
        for sub_name, sub_videos in sorted(subs.items(), key=lambda x: -len(x[1]))[:5]:
            print(f"  [{sub_name}]")
            for v in sub_videos[:3]:
                print(f"    - {v['title']}")

if __name__ == "__main__":
    main()

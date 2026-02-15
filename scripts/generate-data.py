#\!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding="utf-8")
import json, re, shutil
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = PROJECT_ROOT / "data" / "raw" / "categorized-videos.json"
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"
PUBLIC_DIR = PROJECT_ROOT / "public" / "data" / "processed"

CATEGORY_ICONS = {
    "srimadbhagavatam": chr(0x1f4d6),
    "ramayanam": chr(0x1f3f9),
    "mahabharatam": chr(0x2694) + chr(0xfe0f),
    "bhagavadgeetha": chr(0x1f549) + chr(0xfe0f),
    "spiritual-discourses": chr(0x1f64f),
}

CATEGORY_ORDER = ["srimadbhagavatam", "ramayanam", "mahabharatam", "bhagavadgeetha", "spiritual-discourses"]

SKANDHA_ORDER = [
    "Prathama Skandha", "Dvitiya Skandha", "Tritiya Skandha",
    "Chaturtha Skandha", "Panchama Skandha", "Shashtha Skandha",
    "Saptama Skandha", "Ashtama Skandha", "Navama Skandha",
    "Dashama Skandha", "Ekadasha Skandha", "Dvadasha Skandha",
]

KANDA_ORDER = [
    "Bala Kanda", "Ayodhya Kanda", "Aranya Kanda",
    "Kishkindha Kanda", "Sundara Kanda", "Yuddha Kanda", "Uttara Kanda",
]

PARVA_ORDER = [
    "Adi Parva", "Sabha Parva", "Vana Parva", "Virata Parva",
    "Udyoga Parva", "Bhishma Parva", "Drona Parva", "Karna Parva",
    "Shalya Parva", "Sauptika Parva", "Stri Parva", "Shanti Parva",
    "Anushasana Parva", "Ashvamedhika Parva", "Ashramavasika Parva",
    "Mausala Parva", "Mahaprasthanika Parva", "Svargarohana Parva",
]

GITA_CHAPTER_ORDER = [f"Chapter {i}" for i in range(1, 19)]


def slugify(name):
    return re.sub(r"[^a-z0-9]+","-",name.lower()).strip("-")


def language_code(lang):
    return {"english":"en","telugu":"te","mixed":"mx"}.get(lang,lang[:2])


def sort_subcategories(category_slug, subcategory_items):
    if category_slug == "srimadbhagavatam":
        order_list = SKANDHA_ORDER
    elif category_slug == "ramayanam":
        order_list = KANDA_ORDER
    elif category_slug == "mahabharatam":
        order_list = PARVA_ORDER
    elif category_slug == "bhagavadgeetha":
        order_list = GITA_CHAPTER_ORDER
    elif category_slug == "spiritual-discourses":
        return sorted(subcategory_items, key=lambda x: (-x["videoCount"], x["name"]))
    else:
        return sorted(subcategory_items, key=lambda x: x["name"])
    order_map = {name: i for i, name in enumerate(order_list)}
    def sort_key(item):
        name = item["name"]
        if name == "General":
            return (2, 0, name)
        idx = order_map.get(name)
        if idx is not None:
            return (0, idx, name)
        return (1, 0, name)
    return sorted(subcategory_items, key=sort_key)


def write_json(path, data, indent=None):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        if indent is not None:
            json.dump(data, f, ensure_ascii=False, indent=indent)
        else:
            json.dump(data, f, ensure_ascii=False, separators=(",",":"))
    size_kb = path.stat().st_size / 1024
    print(f"  {path.relative_to(PROJECT_ROOT)}  ({size_kb:.1f} KB)")


def compact_video(v, include_category=True):
    out = {
        "id": v["id"],
        "t": v["title"],
        "p": v["published"],
        "th": v["thumbnail"],
        "l": language_code(v["language"]),
    }
    if include_category:
        out["c"] = v["category"]
        out["s"] = slugify(v["subcategory"])
    return out


VALID_KANDAS = {slugify(s) for s in KANDA_ORDER} | {"general"}
VALID_PARVAS = {slugify(s) for s in PARVA_ORDER} | {"general"}

# Minimum videos for a spiritual-discourses subtopic to be its own subcategory
MIN_DISCOURSE_VIDEOS = 3


def consolidate_subcategories(cat_slug, subcategories_dict):
    """Clean up subcategories:
    - Ramayanam: only keep kanda-named subs, merge parva-named into General
    - Mahabharatam: only keep parva-named subs, merge kanda-named into General
    - Spiritual Discourses: merge small subtopics (< MIN_DISCOURSE_VIDEOS) into Other Discourses
    - All: merge empty-slug subcategories into General/Other
    """
    consolidated = defaultdict(list)

    if cat_slug == "ramayanam":
        for sub_name, vids in subcategories_dict.items():
            slug = slugify(sub_name)
            if not slug or slug not in VALID_KANDAS:
                # Parva names or unknown → merge into General
                consolidated["General"].extend(vids)
            else:
                consolidated[sub_name].extend(vids)

    elif cat_slug == "mahabharatam":
        for sub_name, vids in subcategories_dict.items():
            slug = slugify(sub_name)
            if not slug or slug not in VALID_PARVAS:
                # Kanda names or unknown → merge into General
                consolidated["General"].extend(vids)
            else:
                consolidated[sub_name].extend(vids)

    elif cat_slug == "spiritual-discourses":
        for sub_name, vids in subcategories_dict.items():
            slug = slugify(sub_name)
            if not slug or len(vids) < MIN_DISCOURSE_VIDEOS:
                # Too small or empty slug → merge into Other Discourses
                consolidated["Other Discourses"].extend(vids)
            else:
                consolidated[sub_name].extend(vids)

    else:
        # Bhagavatam, Gita: just fix empty slugs
        for sub_name, vids in subcategories_dict.items():
            slug = slugify(sub_name)
            if not slug:
                consolidated["General"].extend(vids)
            else:
                consolidated[sub_name].extend(vids)

    return consolidated


def main():
    print(f"Reading {INPUT_FILE} ...")
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        videos = json.load(f)
    print(f"  Loaded {len(videos)} videos.")
    print()
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Group videos by category → subcategory
    cat_data = {}
    for v in videos:
        cat_slug = v["category"]
        cat_name = v["categoryName"]
        sub_name = v["subcategory"]
        if cat_slug not in cat_data:
            cat_data[cat_slug] = {"name": cat_name, "subcategories": defaultdict(list)}
        cat_data[cat_slug]["subcategories"][sub_name].append(v)

    # Consolidate subcategories (fix cross-matches, merge small topics)
    for cat_slug in cat_data:
        raw_subs = cat_data[cat_slug]["subcategories"]
        cat_data[cat_slug]["subcategories"] = consolidate_subcategories(cat_slug, raw_subs)

    print("Generating categories.json ...")
    categories_list = []
    total_subcategories = 0
    for cat_slug in CATEGORY_ORDER:
        if cat_slug not in cat_data:
            continue
        cd = cat_data[cat_slug]
        sub_items = []
        for sub_name, sub_videos in cd["subcategories"].items():
            sub_items.append({"id": slugify(sub_name), "name": sub_name, "videoCount": len(sub_videos)})
        sub_items = sort_subcategories(cat_slug, sub_items)
        total_subcategories += len(sub_items)
        cat_video_count = sum(s["videoCount"] for s in sub_items)
        categories_list.append({"id": cat_slug, "name": cd["name"], "icon": CATEGORY_ICONS.get(cat_slug, chr(0x1f4c1)), "videoCount": cat_video_count, "subcategories": sub_items})
    categories_json = {"totalVideos": len(videos), "categories": categories_list}
    write_json(OUTPUT_DIR / "categories.json", categories_json, indent=2)
    print("Generating recent.json ...")
    sorted_all = sorted(videos, key=lambda v: v["published"], reverse=True)
    recent_videos = [compact_video(v, include_category=True) for v in sorted_all[:50]]
    write_json(OUTPUT_DIR / "recent.json", {"videos": recent_videos})
    print("Generating videos-by-category/ ...")
    file_count = 0
    for cat_slug in CATEGORY_ORDER:
        if cat_slug not in cat_data:
            continue
        cd = cat_data[cat_slug]
        for sub_name, sub_videos in cd["subcategories"].items():
            sub_slug = slugify(sub_name)
            sub_videos_sorted = sorted(sub_videos, key=lambda v: v["published"], reverse=True)
            compact_list = [compact_video(v, include_category=False) for v in sub_videos_sorted]
            sub_json = {"category": cat_slug, "categoryName": cd["name"], "subcategory": sub_slug, "subcategoryName": sub_name, "videos": compact_list}
            out_path = OUTPUT_DIR / "videos-by-category" / cat_slug / f"{sub_slug}.json"
            write_json(out_path, sub_json)
            file_count += 1
    print(f"  -> {file_count} subcategory files written.")
    print()
    print("Generating stats.json ...")
    lang_counts = Counter(v["language"] for v in videos)
    stats_json = {"totalVideos": len(videos), "totalCategories": len(categories_list), "totalSubcategories": total_subcategories, "languageCounts": {"english": lang_counts.get("english", 0), "telugu": lang_counts.get("telugu", 0), "mixed": lang_counts.get("mixed", 0)}, "lastUpdated": date.today().isoformat()}
    write_json(OUTPUT_DIR / "stats.json", stats_json, indent=2)
    print()
    print(f"Copying {OUTPUT_DIR.relative_to(PROJECT_ROOT)} -> {PUBLIC_DIR.relative_to(PROJECT_ROOT)} ...")
    if PUBLIC_DIR.exists():
        shutil.rmtree(PUBLIC_DIR)
    shutil.copytree(OUTPUT_DIR, PUBLIC_DIR)
    print("  Done.")
    print()
    print("=" * 60)
    print(f"  Total videos:        {len(videos)}")
    print(f"  Categories:          {len(categories_list)}")
    print(f"  Subcategories:       {total_subcategories}")
    print(f"  Subcategory files:   {file_count}")
    print(f"  Languages:           {dict(lang_counts)}")
    print(f"  Output:              {OUTPUT_DIR}")
    print(f"  Public copy:         {PUBLIC_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()

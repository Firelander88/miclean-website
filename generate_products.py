#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate products.json from Excel catalog
"""
import sys
import io
import json
import re
import pandas as pd

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

EXCEL_PATH = "C:/Users/Farzali Valiyev/Desktop/Murad müqavilələr/5_ulduz_otel_təklif sənədi (fromN).xlsx"
OUTPUT_PATH = "C:/Users/Farzali Valiyev/Desktop/miclean-website/data/products.json"
EXISTING_JSON = "C:/Users/Farzali Valiyev/Desktop/miclean-website/data/products.json"

# ── Category ID mapping ────────────────────────────────────────────────────
CATEGORY_MAP = {
    "Kimyəvi Təmizlik Vasitələri": "kimyevi",
    "Camaşırxana Məhsulları": "camasirxana",
    "Mətbəx Gigiyena Məhsulları": "metbex",
    "İstehlak Materialları": "istehlak",
    "Housekeeping Alətləri": "housekeeping",
    "Hotel Amenity": "amenity",
    "Hovuz Təmizliyi": "hovuz",
}

# ── Subcategory ID mapping by category ────────────────────────────────────
# Exact subcategory → id
SUBCAT_EXACT = {
    # kimyevi
    "Ümumi təmizləyicilər": "ktumt",
    "Döşəmə/səth təmizləyiciləri": "ktdt",
    "Döşəmə və səth təmizləyiciləri": "ktdt",
    "Şüşə təmizləyicilər": "ktst",
    "Ammonyaklı": "ktst",
    "Ammonyaklı təmizləyicilər": "ktst",
    "Dezinfeksiyaedicilər": "ktd",
    "Qida təhlükəsizliyi dezinfeksiya": "ktqt",
    "Qida təhlükəsizliyi dezinfeksiya vasitələri": "ktqt",
    "Sanitar qovşağı kimyəvi maddələri": "ktsq",
    "Yağ təmizləyicilər": "ktmeb",
    "Dishwashing products": "ktmeb",
    "Drenaj/kanal açıcılar": "ktfrost",
    "Drenaj və kanal açıcılar": "ktfrost",
    "Carpet & Upholstery": "ktxal",
    "Ləkə çıxarıcılar": "ktxal",
    "Mebel təmizləyici/cilası": "ktmeb",
    "Mebel təmizləyici": "ktmeb",
    "Mebel cilası": "ktmeb",
    "Ekran/Metal polish": "ktmet",
    "Ekran təmizləyici": "ktmet",
    "Metal təmizləyici/polish": "ktmet",
    "Qoxu neytrallaşdırıcılar": "ktqox",
    "Ətir və qoxu idarəetməsi": "ktqox",
    "Hava sanitayzerləri": "ktqox",
    "Anti-dust": "ktqox",
    "Ağardıcılar": "ktblc",
    "Ağardıcılar (bleach)": "ktblc",
    "Dry germicidal": "ktd",
    "Petroleum/Carbon/Deicer products": "ktsolv",
    "Petroleum derivative cleaners": "ktsolv",
    "Carbon removing compounds": "ktsolv",
    "Deicers or defrosters": "ktfrost",
    # camasirxana
    "Sənaye yuyucu (toz/maye)": "camtoz",
    "Sənaye yuyucu (toz)": "camtoz",
    "Toz yuyucu": "camtoz",
    "Sənaye yuyucu (maye)": "cammaye",
    "Maye yuyucu": "cammaye",
    "Yumşaldıcı": "camyum",
    "Oksigen ağardıcı": "camblc",
    "Sour/neutralizer": "campH",
    "Starch": "camnish",
    "Anti-foam": "camaf",
    "Disinfectant additive": "camdis",
    "Dosing systems": "camdoz",
    # metbex
    "Oven/grill cleaner": "mtboven",
    "Stainless steel cleaner": "mtbss",
    "Food contact sanitizer": "mtbsan",
    "Degreaser": "mtbdeg",
    "Dish soap": "mtbqab",
    "Dishwasher": "mtbqab",
    # amenity
    "Şampun": "amnshm",
    "Duş geli": "amndus",
    "Sabun": "amnsab",
    "Losyon": "amnlos",
    "Dental kit": "amndnt",
    "Dental": "amndnt",
    "Toothpaste": "amndnt",
    "Toothbrush": "amndnt",
    "Vanity kit": "amnvan",
    "Vanity": "amnvan",
    "Cotton buds": "amncot",
    "Cotton": "amncot",
    "Hand sanitizer": "amnhsn",
    "Sanitizer": "amnhsn",
    "Dezinfektan": "amnhsn",
    "Slippers": "amnter",
    "Terlik": "amnter",
    "Shower cap": "amndus2",
    "Duş papağı": "amndus2",
    "Razor": "amnulg",
    "Ülgüc": "amnulg",
    "Shaving cream": "amnshv",
    "Shaving": "amnshv",
    "Qablaşdırma": "amnpkg",
    "Çap": "amnpkg",
    "Maska": "amnmsk",
    # hovuz
    "Hovuz Kimyəvi Maddələri": "hovkm",
}


def get_subcat_id(category_id, subcat_raw):
    """Map subcategory name to its ID."""
    if not isinstance(subcat_raw, str):
        return "istdgr"

    s = subcat_raw.strip()

    # Try exact match first
    if s in SUBCAT_EXACT:
        return SUBCAT_EXACT[s]

    s_lower = s.lower()

    # Category-specific keyword matching
    if category_id == "istehlak":
        if "kağız" in s_lower or "salfet" in s_lower or "tualet kağız" in s_lower or "üz salfet" in s_lower or "havlu" in s_lower or "peçete" in s_lower or "bişirmə kağız" in s_lower:
            return "istkag"
        if "alümin" in s_lower or "alminium" in s_lower or "alüminium" in s_lower:
            return "istalm"
        if "stəkan" in s_lower or "karton stəkan" in s_lower:
            return "istktk"
        if "bio" in s_lower or "compost" in s_lower:
            return "istbio"
        if "pizza" in s_lower or "pide" in s_lower:
            return "istpzz"
        if "sous" in s_lower:
            return "istsous"
        if "dispenser" in s_lower or "kağız məhsul" in s_lower:
            return "istdsp"
        if "zibil" in s_lower or "torba" in s_lower or "poşet" in s_lower or "çöp" in s_lower:
            return "istzib"
        if "ppe" in s_lower or "əlcək" in s_lower or "qoruyucu" in s_lower or "tibb" in s_lower:
            return "istppe"
        if "mikrodalğa" in s_lower:
            return "istdgr"
        return "istdgr"

    if category_id == "housekeeping":
        if "mikrofiber" in s_lower or "bezi" in s_lower or "rags" in s_lower:
            return "hkmkf"
        if "mop" in s_lower or "ceymop" in s_lower:
            return "hkmop"
        if "fırça" in s_lower or "süpürgə" in s_lower or "bulaşıq" in s_lower or "toilet brush" in s_lower or "floor finish" in s_lower or "süngər" in s_lower:
            return "hkfrc"
        if "sap" in s_lower:
            return "hksap"
        if "araba" in s_lower or "trolley" in s_lower:
            return "hkarb"
        if "kazım" in s_lower or "skrab" in s_lower:
            return "hkskr"
        if "lövhə" in s_lower or "warning" in s_lower or "xəbərdarlıq" in s_lower:
            return "hkznk"
        # housekeeping keywords in broader subcats
        if "təmizlik alət" in s_lower:
            return "hkfrc"
        if "təmizlik bezi" in s_lower:
            return "hkmkf"
        if "qoxu" in s_lower or "koku" in s_lower:
            return "hkznk"
        if "qoruyucu əlcək" in s_lower:
            return "hkfrc"
        if "sabun" in s_lower or "dispenser" in s_lower:
            return "hkfrc"
        if "qurutma" in s_lower or "hava" in s_lower:
            return "hkznk"
        return "hkfrc"

    if category_id == "amenity":
        if "şampun" in s_lower:
            return "amnshm"
        if "duş gel" in s_lower:
            return "amndus"
        if "sabun" in s_lower:
            return "amnsab"
        if "losyon" in s_lower:
            return "amnlos"
        if "dental" in s_lower or "toothp" in s_lower or "toothbr" in s_lower:
            return "amndnt"
        if "vanity" in s_lower:
            return "amnvan"
        if "terlik" in s_lower or "slipper" in s_lower:
            return "amnter"
        if "duş papağ" in s_lower or "shower cap" in s_lower:
            return "amndus2"
        if "ülgüc" in s_lower or "razor" in s_lower:
            return "amnulg"
        if "cotton" in s_lower:
            return "amncot"
        if "maska" in s_lower:
            return "amnmsk"
        if "sanitizer" in s_lower or "dezinfektan" in s_lower:
            return "amnhsn"
        if "shaving" in s_lower:
            return "amnshv"
        if "qablaşdırma" in s_lower or "çap" in s_lower:
            return "amnpkg"
        return "amnpkg"

    if category_id == "hovuz":
        return "hovkm"

    # Fallback for kimyevi/camasirxana/metbex — try partial
    for key, val in SUBCAT_EXACT.items():
        if key.lower() in s_lower or s_lower in key.lower():
            return val

    return "istdgr"


def clean_str(val):
    if pd.isna(val) or val is None:
        return None
    s = str(val).strip()
    return s if s and s.lower() not in ("nan", "none", "") else None


def parse_zones(val):
    if pd.isna(val) or val is None:
        return []
    s = str(val).strip()
    if not s or s.lower() == "nan":
        return []
    # Split by ; or ,
    parts = re.split(r'[;,]', s)
    return [p.strip() for p in parts if p.strip()]


def is_haccp(row):
    """Check if any relevant field contains HACCP or qida təhlükəsizliyi."""
    fields = [row.get("Alt kateqoriya", ""), row.get("Məhsul tərkibi", ""), row.get("Texniki təsvir", "")]
    for f in fields:
        if isinstance(f, str):
            fl = f.lower()
            if "haccp" in fl or "qida təhlükəsizliyi" in fl:
                return True
    return False


def main():
    print("Reading Excel file...")
    df = pd.read_excel(EXCEL_PATH, sheet_name='Məhsullar', header=1)

    print(f"Total rows: {len(df)}")

    # Read existing JSON to keep categories and services
    with open(EXISTING_JSON, 'r', encoding='utf-8') as f:
        existing = json.load(f)

    categories = existing["categories"]
    services = existing["services"]

    # ── Process products ──────────────────────────────────────────────────
    # Group by KOD, aggregate sizes
    products_dict = {}  # KOD -> product dict

    skipped = 0
    for idx, row in df.iterrows():
        kod = clean_str(row.get("KOD"))
        if not kod:
            skipped += 1
            continue

        name = clean_str(row.get("Məhsul adı"))
        category_raw = clean_str(row.get("Məhsul kateqoriyası"))
        subcat_raw = clean_str(row.get("Alt kateqoriya"))
        formula = clean_str(row.get("Məhsul tərkibi"))
        delivery = clean_str(row.get("Çatdırılma müddəti"))
        purpose = clean_str(row.get("İstifadə məqsədi"))
        description = clean_str(row.get("Texniki təsvir"))
        zones_raw = row.get("İstifadə sahəsi")
        packaging = clean_str(row.get("Qablaşdırma forması"))
        min_order = clean_str(row.get("Minimum sifariş miqdarı"))

        # Map category
        category_id = CATEGORY_MAP.get(category_raw, "istehlak") if category_raw else "istehlak"

        # Map subcategory
        subcat_id = get_subcat_id(category_id, subcat_raw)

        # Parse zones
        zones = parse_zones(zones_raw)

        # Parse delivery days (extract number range)
        delivery_days = "5-7"
        if delivery:
            m = re.search(r'(\d+)[–\-](\d+)', delivery)
            if m:
                delivery_days = f"{m.group(1)}-{m.group(2)}"
            else:
                m2 = re.search(r'(\d+)', delivery)
                if m2:
                    delivery_days = m2.group(1)

        # HACCP check
        haccp = is_haccp({
            "Alt kateqoriya": subcat_raw or "",
            "Məhsul tərkibi": formula or "",
            "Texniki təsvir": description or "",
        })

        if kod not in products_dict:
            products_dict[kod] = {
                "id": kod,
                "category": category_id,
                "subcategory": subcat_id,
                "name": name or kod,
                "formula": formula,
                "delivery_days": delivery_days,
                "haccp": haccp,
                "purpose": purpose,
                "description": description,
                "min_order": min_order,
                "sizes": [],
                "zones": zones,
                "variants": [],
            }
            if packaging:
                products_dict[kod]["sizes"].append(packaging)
        else:
            # Add unique size
            if packaging and packaging not in products_dict[kod]["sizes"]:
                products_dict[kod]["sizes"].append(packaging)
            # Update haccp if newly detected
            if haccp:
                products_dict[kod]["haccp"] = True
            # Merge zones
            for z in zones:
                if z not in products_dict[kod]["zones"]:
                    products_dict[kod]["zones"].append(z)

    # Clean up None values before output
    products = []
    for p in products_dict.values():
        # Remove None fields to keep JSON clean
        cleaned = {}
        for k, v in p.items():
            if v is None:
                continue
            if isinstance(v, list) and len(v) == 0:
                cleaned[k] = v
                continue
            cleaned[k] = v
        products.append(cleaned)

    print(f"Skipped rows (no KOD): {skipped}")
    print(f"Total unique products: {len(products)}")

    # ── Build final JSON ───────────────────────────────────────────────────
    output = {
        "meta": {
            "total": len(products),
            "categories": 7,
            "subcategories": 109,
            "services": len(services),
            "currency": "AZN",
            "usd_rate": 1.70,
            "updated": "2026-03-20"
        },
        "categories": categories,
        "products": products,
        "services": services,
    }

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved to {OUTPUT_PATH}")

    # Print sample products
    print("\nSample products (first 5):")
    for p in products[:5]:
        print(f"  {p['id']} | {p['category']} | {p['subcategory']} | {p.get('name','')[:50]} | sizes={p.get('sizes')}")

    print("\nCategory distribution:")
    from collections import Counter
    cats = Counter(p["category"] for p in products)
    for cat, cnt in sorted(cats.items()):
        print(f"  {cat}: {cnt}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Google Search Console Autonomous API Client for Rainwater Directory
------------------------------------------------------------------
Uses service account credentials from ~/.config/gcloud/legacy_credentials to:
- List verified sites and verify property access
- Submit XML sitemaps
- Fetch query and page-level search analytics (clicks, impressions, CTR, position)
- Inspect indexation status
"""

import os
import sys
import json
import time
import base64
import urllib.request
import urllib.parse
from pathlib import Path

# Paths & configuration
CREDENTIAL_PATHS = [
    Path.home() / ".config/gcloud/legacy_credentials/codex-629@gen-lang-client-0195647678.iam.gserviceaccount.com/adc.json",
    Path.home() / ".config/gcloud/application_default_credentials.json",
]
GSC_SCOPE = "https://www.googleapis.com/auth/webmasters"
DEFAULT_PROPERTY = "sc-domain:rainwaterdirectory.com"
DEFAULT_SITEMAP = "https://rainwaterdirectory.com/sitemap-index.xml"


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def get_access_token() -> str:
    """Mints OAuth2 access token for the service account."""
    sa_path = None
    for p in CREDENTIAL_PATHS:
        if p.exists():
            sa_path = p
            break
    if not sa_path:
        raise FileNotFoundError(f"No valid service account found at {[str(p) for p in CREDENTIAL_PATHS]}")

    with open(sa_path) as f:
        sa = json.load(f)

    if sa.get("type") != "service_account":
        raise ValueError(f"Credential file at {sa_path} is not a service_account key")

    # Use cryptography library for JWT signing
    try:
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import padding
    except ImportError:
        # Fallback to gcloud virtualenv python if available
        raise ImportError("Please run using Python environment with 'cryptography' installed.")

    now = int(time.time())
    header = {"alg": "RS256", "typ": "JWT"}
    payload = {
        "iss": sa["client_email"],
        "scope": GSC_SCOPE,
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600,
        "iat": now,
    }

    encoded_header = b64url(json.dumps(header).encode())
    encoded_payload = b64url(json.dumps(payload).encode())
    sig_input = f"{encoded_header}.{encoded_payload}".encode()

    private_key = serialization.load_pem_private_key(sa["private_key"].encode(), password=None)
    sig = private_key.sign(sig_input, padding.PKCS1v15(), hashes.SHA256())
    jwt = f"{encoded_header}.{encoded_payload}.{b64url(sig)}"

    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt,
    }).encode()

    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())["access_token"]


def list_sites(token: str):
    """Lists all verified sites in Google Search Console."""
    req = urllib.request.Request("https://www.googleapis.com/webmasters/v3/sites")
    req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            entries = data.get("siteEntry", [])
            print(f"[GSC] Found {len(entries)} verified sites:")
            for e in entries:
                print(f"  - {e.get('siteUrl')} (Permission: {e.get('permissionLevel')})")
            return entries
    except urllib.error.HTTPError as e:
        print(f"[GSC ERROR] List sites failed ({e.code}): {e.read().decode()}")
        return []


def submit_sitemap(token: str, site_url: str = DEFAULT_PROPERTY, sitemap_url: str = DEFAULT_SITEMAP):
    """Submits a sitemap to Google Search Console."""
    encoded_site = urllib.parse.quote(site_url, safe="")
    encoded_sitemap = urllib.parse.quote(sitemap_url, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{encoded_site}/sitemaps/{encoded_sitemap}"
    req = urllib.request.Request(url, method="PUT")
    req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"[GSC] Successfully submitted sitemap {sitemap_url} to {site_url} (HTTP {resp.status})")
            return True
    except urllib.error.HTTPError as e:
        print(f"[GSC ERROR] Submit sitemap failed ({e.code}): {e.read().decode()}")
        return False


def get_search_analytics(token: str, site_url: str = DEFAULT_PROPERTY, days: int = 28):
    """Fetches top queries and pages from Search Console."""
    encoded_site = urllib.parse.quote(site_url, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{encoded_site}/searchAnalytics/query"
    payload = {
        "startDate": time.strftime("%Y-%m-%d", time.gmtime(time.time() - days * 86400)),
        "endDate": time.strftime("%Y-%m-%d", time.gmtime(time.time() - 2 * 86400)),
        "dimensions": ["query", "page"],
        "rowLimit": 50,
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            rows = data.get("rows", [])
            print(f"[GSC] Retrieved {len(rows)} analytics rows for {site_url}:")
            for r in rows[:10]:
                keys = r.get("keys", ["", ""])
                print(f"  - Query: {keys[0]:<30} Clicks: {r.get('clicks', 0):<5} Impr: {r.get('impressions', 0):<5} Pos: {r.get('position', 0):.1f}")
            return rows
    except urllib.error.HTTPError as e:
        print(f"[GSC ERROR] Query analytics failed ({e.code}): {e.read().decode()}")
        return []


if __name__ == "__main__":
    print("[GSC] Authenticating with Google Search Console service account...")
    try:
        token = get_access_token()
        print("[GSC] Access token generated successfully.")
    except Exception as err:
        print(f"[GSC ERROR] Auth failed: {err}")
        sys.exit(1)

    action = sys.argv[1] if len(sys.argv) > 1 else "list"
    if action == "list":
        list_sites(token)
    elif action == "submit-sitemap":
        submit_sitemap(token)
    elif action == "analytics":
        get_search_analytics(token)
    else:
        print(f"Unknown action: {action}. Available: list, submit-sitemap, analytics")

#!/usr/bin/env python3
"""Failure-explicit Google Search Console client for Rainwater Directory."""

import argparse, base64, datetime as dt, json, os, sys, time
import urllib.error, urllib.parse, urllib.request
from pathlib import Path

CREDENTIAL_PATHS = [
    Path(os.environ["GSC_CREDENTIALS_PATH"]) if os.environ.get("GSC_CREDENTIALS_PATH") else None,
    Path("/opt/data/credentials/gsc-service-account.json"),
    Path.home() / ".config/gcloud/legacy_credentials/codex-629@gen-lang-client-0195647678.iam.gserviceaccount.com/adc.json",
    Path.home() / ".config/gcloud/application_default_credentials.json",
]
CREDENTIAL_PATHS = [path for path in CREDENTIAL_PATHS if path is not None]
GSC_SCOPE = "https://www.googleapis.com/auth/webmasters"
DEFAULT_PROPERTY = "sc-domain:rainwaterdirectory.com"
DEFAULT_SITEMAP = "https://rainwaterdirectory.com/sitemap-index.xml"


class GSCError(RuntimeError):
    pass


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def get_access_token() -> str:
    credential_path = next((path for path in CREDENTIAL_PATHS if path.exists()), None)
    if not credential_path:
        raise GSCError(f"No service-account credential found at {[str(path) for path in CREDENTIAL_PATHS]}")
    service_account = json.loads(credential_path.read_text())
    if service_account.get("type") != "service_account":
        raise GSCError(f"Credential at {credential_path} is not a service account")
    try:
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import padding
    except ImportError as exc:
        raise GSCError("cryptography is required to authenticate") from exc

    now = int(time.time())
    header = b64url(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    payload = b64url(json.dumps({
        "iss": service_account["client_email"], "scope": GSC_SCOPE,
        "aud": "https://oauth2.googleapis.com/token", "exp": now + 3600, "iat": now,
    }).encode())
    message = f"{header}.{payload}".encode()
    key = serialization.load_pem_private_key(service_account["private_key"].encode(), password=None)
    signature = key.sign(message, padding.PKCS1v15(), hashes.SHA256())
    assertion = f"{header}.{payload}.{b64url(signature)}"
    request = urllib.request.Request("https://oauth2.googleapis.com/token", data=urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion,
    }).encode())
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read())["access_token"]
    except (urllib.error.URLError, KeyError, json.JSONDecodeError) as exc:
        raise GSCError(f"Authentication failed: {exc}") from exc


def request_json(request: urllib.request.Request, *, empty_ok: bool = False):
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read()
            return {} if not body and empty_ok else json.loads(body)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:500]
        raise GSCError(f"HTTP {exc.code}: {detail}") from exc
    except (urllib.error.URLError, json.JSONDecodeError) as exc:
        raise GSCError(f"Request failed: {exc}") from exc


def authorized_request(url: str, token: str, *, data: dict | None = None, method: str | None = None):
    return urllib.request.Request(url, data=json.dumps(data).encode() if data is not None else None, method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})


def list_sites(token: str):
    return request_json(authorized_request("https://www.googleapis.com/webmasters/v3/sites", token)).get("siteEntry", [])


def submit_sitemap(token: str, site_url: str = DEFAULT_PROPERTY, sitemap_url: str = DEFAULT_SITEMAP):
    endpoint = "https://www.googleapis.com/webmasters/v3/sites/{}/sitemaps/{}".format(
        urllib.parse.quote(site_url, safe=""), urllib.parse.quote(sitemap_url, safe=""))
    request_json(authorized_request(endpoint, token, method="PUT"), empty_ok=True)
    return {"submitted": True, "sitemap": sitemap_url}


def get_search_analytics(token: str, site_url: str = DEFAULT_PROPERTY, days: int = 28, row_limit: int = 25000):
    end = dt.date.today() - dt.timedelta(days=2)
    start = end - dt.timedelta(days=days - 1)
    endpoint = "https://www.googleapis.com/webmasters/v3/sites/{}/searchAnalytics/query".format(urllib.parse.quote(site_url, safe=""))
    payload = {"startDate": start.isoformat(), "endDate": end.isoformat(), "dimensions": ["query", "page"], "rowLimit": row_limit}
    return request_json(authorized_request(endpoint, token, data=payload)).get("rows", [])


def inspect_url(token: str, url: str, site_url: str = DEFAULT_PROPERTY):
    result = request_json(authorized_request("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", token,
        data={"inspectionUrl": url, "siteUrl": site_url}))
    status = result.get("inspectionResult", {}).get("indexStatusResult", {})
    return {key: status.get(key) for key in ("verdict", "coverageState", "robotsTxtState", "indexingState",
        "lastCrawlTime", "pageFetchState", "googleCanonical", "userCanonical")}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", nargs="?", default="list", choices=["list", "submit-sitemap", "analytics", "inspect"])
    parser.add_argument("urls", nargs="*")
    parser.add_argument("--days", type=int, default=28)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        token = get_access_token()
        if args.action == "list": result = list_sites(token)
        elif args.action == "submit-sitemap": result = submit_sitemap(token)
        elif args.action == "analytics": result = get_search_analytics(token, days=args.days)
        elif not args.urls: raise GSCError("inspect requires at least one URL")
        else: result = {url: inspect_url(token, url) for url in args.urls}
        if args.json: print(json.dumps({"ok": True, "data": result}, indent=2))
        else:
            print(f"[GSC] {args.action} succeeded; records={len(result) if hasattr(result, '__len__') else 1}")
            if args.action == "analytics":
                for row in result[:10]: print(json.dumps(row, sort_keys=True))
        return 0
    except GSCError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}), file=sys.stderr)
        return 1


if __name__ == "__main__": raise SystemExit(main())

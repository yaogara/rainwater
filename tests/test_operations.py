import contextlib
import csv
import datetime as dt
import io
import json
import sys
import tempfile
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import argparse
import contractor_tool
import gsc_client
import source_monitor


class SourceMonitorTests(unittest.TestCase):
    def test_last_success_survives_failure_and_detects_change(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            catalog = root / "sources.json"
            catalog.write_text(json.dumps({"sources": [{"id": "official", "url": "https://example.org/source"}]}))
            state = root / "state"

            def run(value, strict=False):
                argv = ["source_monitor", "--sources", str(catalog), "--state-dir", str(state)]
                if strict:
                    argv.append("--strict")
                with patch.object(sys, "argv", argv), \
                     patch.object(source_monitor, "fetch", side_effect=value if isinstance(value, Exception) else None,
                                  return_value=None if isinstance(value, Exception) else (200, value)), \
                     contextlib.redirect_stdout(io.StringIO()) as output:
                    result = source_monitor.main()
                return result, output.getvalue(), json.loads((state / "latest.json").read_text())

            code, _, first = run("original")
            self.assertEqual(code, 0)
            self.assertEqual(first["consecutive_failures"]["official"], 0)
            digest = first["last_good"]["official"]["sha256"]

            code, output, failed = run(RuntimeError("temporary outage"))
            self.assertEqual(code, 2)
            self.assertIn("WARNING", output)
            self.assertIn("temporary outage", output)
            self.assertEqual(failed["last_good"]["official"]["sha256"], digest)
            self.assertEqual(failed["consecutive_failures"]["official"], 1)
            self.assertIn("error", failed["sources"]["official"])

            code, output, strict_failed = run(RuntimeError("temporary outage"), strict=True)
            self.assertEqual(code, 1)
            self.assertIn("FAILED", output)
            self.assertEqual(strict_failed["consecutive_failures"]["official"], 2)

            code, output, unchanged = run("original")
            self.assertEqual(code, 0)
            self.assertNotIn("changed", output)
            self.assertEqual(unchanged["last_good"]["official"]["sha256"], digest)
            self.assertEqual(unchanged["consecutive_failures"]["official"], 0)

            code, output, changed = run("revised")
            self.assertEqual(code, 0)
            self.assertIn("editorial review required: official", output)
            self.assertNotEqual(changed["last_good"]["official"]["sha256"], digest)
            self.assertGreaterEqual(len(list(state.glob("*.json"))), 6)

    def test_permanent_404_returns_exit_one(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            catalog = root / "sources.json"
            catalog.write_text(json.dumps({"sources": [{"id": "missing", "url": "https://example.org/404"}]}))
            state = root / "state"
            err = urllib.error.HTTPError("https://example.org/404", 404, "Not Found", None, None)
            with patch.object(sys, "argv", ["source_monitor", "--sources", str(catalog), "--state-dir", str(state)]), \
                 patch.object(source_monitor, "fetch", side_effect=err), \
                 contextlib.redirect_stdout(io.StringIO()) as output:
                code = source_monitor.main()
            self.assertEqual(code, 1)
            self.assertIn("FAILED", output.getvalue())

    def test_migrates_schema_one_success(self):
        old = {"sources": {"good": {"sha256": "abc"}, "failed": {"error": "timeout"}}}
        self.assertEqual(source_monitor.last_good_sources(old), {"good": {"sha256": "abc"}})


class OpportunityCsvTests(unittest.TestCase):
    def test_columns_and_puerto_rico_mapping(self):
        path = Path(__file__).resolve().parents[1] / "data/seo/opportunities.csv"
        with path.open(newline="") as stream:
            rows = list(csv.DictReader(stream))
        self.assertTrue(all(None not in row and len(row) == 18 for row in rows))
        pr = next(row for row in rows if row["opportunity_id"] == "RW-008")
        self.assertEqual(pr["owner_url"], "/blog/is-it-illegal-to-collect-rainwater-state-by-state/")
        self.assertEqual(pr["current_gsc_impressions"], "6")
        self.assertIn("Ley 91-2024", pr["required_sources"])
        self.assertIn("Clarify policy", pr["proposed_change"])


class GscAnalyticsTests(unittest.TestCase):
    def test_property_total_is_separate_from_partial_detail(self):
        total = {"clicks": 1, "impressions": 94, "ctr": 1 / 94, "position": 39.287234042553195}
        details = [{"keys": ["query", "/blog/"], "clicks": 0, "impressions": 53}]
        with patch.object(gsc_client, "query_analytics", side_effect=[[total], details]) as query:
            report = gsc_client.get_analytics_report("token", days=28, end_date=dt.date(2026, 10, 9))
        self.assertEqual((report["start_date"], report["end_date"]), ("2026-09-12", "2026-10-09"))
        self.assertEqual(report["property_totals"]["impressions"], 94)
        self.assertEqual(report["query_page_row_count"], 1)
        self.assertEqual(query.call_args_list[0].args[4:], ([], 1))
        self.assertEqual(query.call_args_list[1].args[4:], (["query", "page"], 25000))

    def test_request_json_wraps_timeout_after_retry(self):
        req = urllib.request.Request("https://example.org/gsc")
        with patch.object(urllib.request, "urlopen", side_effect=TimeoutError("timed out")) as mock_open, \
             patch.object(gsc_client.time, "sleep") as mock_sleep:
            with self.assertRaises(gsc_client.GSCError) as ctx:
                gsc_client.request_json(req)
        self.assertIn("timed out", str(ctx.exception))
        self.assertEqual(mock_open.call_count, 2)
        mock_sleep.assert_called_once_with(2)


class ContractorToolTests(unittest.TestCase):
    def test_verify_attaches_evidence_and_preserves_fields(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            city_file = root / "texas-austin.md"
            city_file.write_text(
                '---\n'
                'state: "Texas"\n'
                'city: "Austin"\n'
                'summary: "Austin installers."\n'
                'installers:\n'
                '  - name: "Acme Rainwater"\n'
                '    phone: "(512) 490-0932"\n'
                '    website: "https://acmerain.example.org/"\n'
                '    certifications: "ARCSA AP"\n'
                '    services:\n'
                '      - "Cistern installation"\n'
                '---\n'
                'Existing body note.\n',
                encoding="utf-8",
            )
            args = argparse.Namespace(
                state="Texas",
                city="Austin",
                name="acme rainwater",
                source_url="https://acmerain.example.org/about",
                source_excerpt="Verified ARCSA AP rainwater catchment contractor in Austin.",
                verified_at="2026-11-22",
                verify_credentials=True,
                verify_reviews=False,
            )
            with patch.object(contractor_tool, "INSTALLERS_DIR", root), \
                 contextlib.redirect_stdout(io.StringIO()):
                code = contractor_tool.run_verify(args)
            self.assertEqual(code, 0)
            parsed, err = contractor_tool.parse_frontmatter(city_file)
            self.assertIsNone(err)
            inst = parsed["installers"][0]
            self.assertEqual(inst["phone"], "(512) 490-0932")
            self.assertEqual(inst["services"], ["Cistern installation"])
            self.assertEqual(inst["evidence"]["entity"]["status"], "verified")
            self.assertEqual(inst["evidence"]["credentials"]["status"], "verified")
            self.assertNotIn("reviews", inst["evidence"])
            self.assertIn("Existing body note.", city_file.read_text(encoding="utf-8"))

    def test_validate_rejects_555_placeholder_phone(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            bad_file = root / "new-york-albany.md"
            bad_file.write_text(
                '---\n'
                'state: "New York"\n'
                'city: "Albany"\n'
                'summary: "Albany installers."\n'
                'installers:\n'
                '  - name: "Demo Rain"\n'
                '    phone: "+1 518-555-0199"\n'
                '---\n',
                encoding="utf-8",
            )
            with contextlib.redirect_stdout(io.StringIO()) as out:
                code = contractor_tool.run_validate(argparse.Namespace(file=str(bad_file)))
            self.assertEqual(code, 1)
            self.assertIn("placeholder 555 phone", out.getvalue())


if __name__ == "__main__":
    unittest.main()

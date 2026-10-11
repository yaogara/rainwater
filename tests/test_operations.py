import contextlib
import csv
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import source_monitor
import gsc_client
import datetime as dt


class SourceMonitorTests(unittest.TestCase):
    def test_last_success_survives_failure_and_detects_change(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            catalog = root / 'sources.json'
            catalog.write_text(json.dumps({'sources': [{'id': 'official', 'url': 'https://example.org/source'}]}))
            state = root / 'state'
            def run(value):
                with patch.object(sys, 'argv', ['source_monitor', '--sources', str(catalog), '--state-dir', str(state)]), \
                     patch.object(source_monitor, 'fetch', side_effect=value if isinstance(value, Exception) else None,
                           return_value=None if isinstance(value, Exception) else (200, value)), \
                     contextlib.redirect_stdout(io.StringIO()) as output:
                    result = source_monitor.main()
                return result, output.getvalue(), json.loads((state / 'latest.json').read_text())
            code, _, first = run('original')
            self.assertEqual(code, 0)
            digest = first['last_good']['official']['sha256']
            code, output, failed = run(RuntimeError('temporary outage'))
            self.assertEqual(code, 1)
            self.assertIn('temporary outage', output)
            self.assertEqual(failed['last_good']['official']['sha256'], digest)
            self.assertIn('error', failed['sources']['official'])
            code, output, unchanged = run('original')
            self.assertEqual(code, 0)
            self.assertNotIn('changed', output)
            self.assertEqual(unchanged['last_good']['official']['sha256'], digest)
            code, output, changed = run('revised')
            self.assertEqual(code, 0)
            self.assertIn('editorial review required: official', output)
            self.assertNotEqual(changed['last_good']['official']['sha256'], digest)
            self.assertGreaterEqual(len(list(state.glob('*.json'))), 5)

    def test_migrates_schema_one_success(self):
        old = {'sources': {'good': {'sha256': 'abc'}, 'failed': {'error': 'timeout'}}}
        self.assertEqual(source_monitor.last_good_sources(old), {'good': {'sha256': 'abc'}})


class OpportunityCsvTests(unittest.TestCase):
    def test_columns_and_puerto_rico_mapping(self):
        path = Path(__file__).resolve().parents[1] / 'data/seo/opportunities.csv'
        with path.open(newline='') as stream:
            rows = list(csv.DictReader(stream))
        self.assertTrue(all(None not in row and len(row) == 18 for row in rows))
        pr = next(row for row in rows if row['opportunity_id'] == 'RW-008')
        self.assertEqual(pr['owner_url'], '/blog/is-it-illegal-to-collect-rainwater-state-by-state/')
        self.assertEqual(pr['current_gsc_impressions'], '6')
        self.assertIn('Ley 91-2024', pr['required_sources'])
        self.assertIn('Clarify policy', pr['proposed_change'])


class GscAnalyticsTests(unittest.TestCase):
    def test_property_total_is_separate_from_partial_detail(self):
        total = {'clicks': 1, 'impressions': 94, 'ctr': 1 / 94, 'position': 39.287234042553195}
        details = [{'keys': ['query', '/blog/'], 'clicks': 0, 'impressions': 53}]
        with patch.object(gsc_client, 'query_analytics', side_effect=[[total], details]) as query:
            report = gsc_client.get_analytics_report('token', days=28, end_date=dt.date(2026, 10, 9))
        self.assertEqual((report['start_date'], report['end_date']), ('2026-09-12', '2026-10-09'))
        self.assertEqual(report['property_totals']['impressions'], 94)
        self.assertEqual(report['query_page_row_count'], 1)
        self.assertEqual(query.call_args_list[0].args[4:], ([], 1))
        self.assertEqual(query.call_args_list[1].args[4:], (['query', 'page'], 25000))


if __name__ == '__main__':
    unittest.main()

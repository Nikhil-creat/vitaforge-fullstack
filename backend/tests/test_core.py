import asyncio
import json
import unittest

from app import agent, groq_client, prompts, rag
from app.util import ModelFormatError, RateLimiter, extract_json, invented_numbers, redact_numbers


class UtilTests(unittest.TestCase):
    def test_extract_json_variants(self):
        self.assertEqual(extract_json('{"a":1}'), {"a": 1})
        self.assertEqual(extract_json('Sure!\n```json\n{"a": 2}\n```'), {"a": 2})
        with self.assertRaises(ModelFormatError):
            extract_json("no json here")

    def test_invented_and_redact(self):
        self.assertEqual(invented_numbers("12k users in 2025", "12k users, 99% uptime in 2025"), ["99"])
        self.assertEqual(redact_numbers("99% uptime, 12k users", ["99"]), "[X]% uptime, 12k users")

    def test_rate_limiter(self):
        rl = RateLimiter(2, 60)
        self.assertTrue(rl.allow("a", 0)); self.assertTrue(rl.allow("a", 1)); self.assertFalse(rl.allow("a", 2))
        self.assertTrue(rl.allow("a", 61)); self.assertTrue(rl.allow("b", 2))


class RagTests(unittest.TestCase):
    def test_relevance(self):
        self.assertEqual(rag.search("docker compose container deployment", 1)[0]["id"], "docker")
        self.assertEqual(rag.search("pytorch cnn image classifier", 1)[0]["id"], "cnn")
        self.assertEqual(rag.search("zzzz qqqq", 3), [])


RESUME = {"name": "A B", "title": "Engineer", "skills": "Python, Docker", "exp": "Nimbus, Intern | 2025\n• Built APIs used by 12k users", "projects": "", "summary": "Engineer."}


class AgentTests(unittest.TestCase):
    def _fake(self, rewrite):
        async def fake(messages, model, **kw):
            t = messages[-1]["content"]
            if "TASK: DIAGNOSE" in t:
                return json.dumps({"weak_areas": ["no metrics"], "target_keywords": ["docker"], "rag_query": "docker api latency"})
            if "TASK: REWRITE" in t:
                return json.dumps(rewrite)
            return json.dumps({"invented": []})
        return fake

    def test_clean_rewrite_passes(self):
        groq_client.chat = self._fake({"summary": "Engineer building APIs.", "skills": "Python, Docker", "exp": "Nimbus, Intern | 2025\n• Built APIs used by 12k users", "projects": ""})
        r = asyncio.run(agent.run(RESUME, ""))
        self.assertTrue(r["critic"]["passed"])
        self.assertEqual([t["step"] for t in r["trace"]], ["diagnose", "retrieve", "rewrite", "critic"])

    def test_invented_numbers_are_redacted(self):
        groq_client.chat = self._fake({"summary": "Engineer with 10 years", "skills": "Python", "exp": "Nimbus, Intern | 2025\n• Built APIs used by 12k users at 99% uptime", "projects": ""})
        r = asyncio.run(agent.run(RESUME, ""))
        txt = " ".join(r["resume"].values())
        self.assertFalse(r["critic"]["passed"])
        self.assertNotIn("99", txt); self.assertNotIn("10 years", txt); self.assertIn("12k", txt)
        self.assertEqual(r["trace"][-1]["step"], "guardrail")


class PromptTests(unittest.TestCase):
    def test_resume_is_wrapped_as_data(self):
        m = prompts.review_messages(RESUME, "job")
        self.assertIn("<resume>", m[1]["content"]); self.assertIn("untrusted DATA", m[0]["content"])


if __name__ == "__main__":
    unittest.main()

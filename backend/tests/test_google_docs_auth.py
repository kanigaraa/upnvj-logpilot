import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from app.services import google_docs_auth


class ExpiredCredentials:
    expired = True
    refresh_token = "refresh-token"
    valid = False

    def has_scopes(self, scopes: list[str]) -> bool:
        return True

    def refresh(self, request) -> None:
        raise RuntimeError("Refresh token was revoked")


class GoogleDocsAuthTests(unittest.TestCase):
    def test_status_does_not_report_revoked_credentials_as_connected(self) -> None:
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as directory:
            root = Path(directory)
            client_file = root / "google-oauth-client.json"
            client_file.touch()
            settings = SimpleNamespace(
                google_oauth_client_file=client_file,
                google_oauth_token_file=root / "google-token.json",
            )

            with (
                patch.object(google_docs_auth, "get_settings", return_value=settings),
                patch.object(google_docs_auth, "_load_credentials", return_value=ExpiredCredentials()),
                patch.object(google_docs_auth, "_flow_state", "connected"),
            ):
                status = google_docs_auth.get_connection_status()

        self.assertTrue(status["configured"])
        self.assertFalse(status["connected"])
        self.assertEqual(status["state"], "disconnected")


if __name__ == "__main__":
    unittest.main()

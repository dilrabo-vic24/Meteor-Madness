# backend/app/core/config.py

import os
from dotenv import load_dotenv

# CORRECTED: This path correctly finds the root 'backend' directory
# and then looks for the .env file inside it.
# __file__ -> config.py
# os.path.dirname(__file__) -> core/
# os.path.dirname(...) -> app/
# os.path.dirname(...) -> backend/
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(ROOT_DIR, '.env'))


class Settings:
    NASA_API_KEY: str = os.getenv("NASA_API_KEY")

    if not NASA_API_KEY:
        print("WARNING: NASA_API_KEY is not set in the .env file.")


settings = Settings()
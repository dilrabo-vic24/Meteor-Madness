
import os
from dotenv import load_dotenv

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(ROOT_DIR, '.env'))


class Settings:
    NASA_API_KEY: str = os.getenv("NASA_API_KEY")

    if not NASA_API_KEY:
        print("WARNING: NASA_API_KEY is not set in the .env file.")


settings = Settings()
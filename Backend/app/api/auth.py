# app/api/auth.py
import os, time
from typing import Optional
from fastapi import Request, HTTPException, Depends
from jose import jwt
import httpx
from dotenv import load_dotenv

load_dotenv()
# Set your Clerk issuer (prefer env var)
CLERK_ISSUER = os.getenv("CLERK_ISSUER")
JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

# simple in-process cache
_JWKS_CACHE: dict[str, object] = {"keys": None, "exp": 0.0}

async def _get_jwks():
    now = time.time()
    if _JWKS_CACHE["keys"] and _JWKS_CACHE["exp"] > now:
        return _JWKS_CACHE["keys"]
    async with httpx.AsyncClient(timeout=5) as client:
        resp = await client.get(JWKS_URL)
        resp.raise_for_status()
        _JWKS_CACHE["keys"] = resp.json()
        _JWKS_CACHE["exp"] = now + 60 * 15  # 15 min cache
        return _JWKS_CACHE["keys"]

async def get_user_id(request: Request) -> str:
    auth = request.headers.get("authorization", "")
    if not auth.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = auth.split(" ", 1)[1]

    jwks = await _get_jwks()
    try:
        # If you configured audience on Clerk JWT template, set verify_aud=True and pass audience
        claims = jwt.decode(
            token,
            jwks,
            algorithms=["RS256", "EdDSA"],
            issuer=CLERK_ISSUER,
            options={"verify_aud": False}, 
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

    user_id = claims.get("sub") or claims.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing user id")
    return str(user_id)

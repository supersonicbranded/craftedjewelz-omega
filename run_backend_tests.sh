#!/bin/bash
# Run pytest with proper PYTHONPATH for monorepo structure
PYTHONPATH=$(pwd) pytest --maxfail=1 --disable-warnings --tb=short apps/backend/tests/

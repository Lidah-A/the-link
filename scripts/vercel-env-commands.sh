#!/usr/bin/env bash
# Read `.env.local` (local file must exist and contain real secrets) and add variables to Vercel using the `vercel` CLI.
# Usage:
#   ./scripts/vercel-env-commands.sh           # dry-run (shows what would run and asks confirmation)
#   ./scripts/vercel-env-commands.sh --apply   # actually execute vercel env add for 'production'
#   ./scripts/vercel-env-commands.sh --apply --all  # apply to production, preview, development

set -euo pipefail

ENV_FILE=.env.local
if [ ! -f "$ENV_FILE" ]; then
	echo "Error: $ENV_FILE not found. Create it from .env.local.example with your real secrets." >&2
	exit 1
fi

APPLY=false
ALL_ENVS=false
if [ "${1:-}" = "--apply" ]; then APPLY=true; fi
if [ "${2:-}" = "--all" ] || [ "${1:-}" = "--all" ]; then ALL_ENVS=true; fi

TARGETS=(production)
if [ "$ALL_ENVS" = true ]; then TARGETS=(production preview development); fi

echo "Reading variables from $ENV_FILE"
LINES=()
while IFS= read -r l; do
	# skip empty and commented lines
	if [[ -z "$l" ]] || [[ "$l" =~ ^[[:space:]]*# ]]; then
		continue
	fi
	LINES+=("$l")
done < <(grep -v '^\s*$' "$ENV_FILE" | grep -v '^\s*#')
if [ "${#LINES[@]}" -eq 0 ]; then
	echo "No variables found in $ENV_FILE" && exit 1
fi

echo "The script will add the following variables to Vercel targets: ${TARGETS[*]}"
for l in "${LINES[@]}"; do
	key=$(echo "$l" | sed -E 's/^[[:space:]]*export[[:space:]]+//' | cut -d'=' -f1)
	value=$(echo "$l" | sed -E 's/^[^=]+=//')
	if [ -z "$key" ] || [ -z "$value" ]; then
		echo "Skipping empty line or missing value: $l"
		continue
	fi
	echo "$key=$value"
done

if [ "$APPLY" != true ]; then
	echo
	echo "Dry run complete. To actually add these to Vercel run:"
	echo "  ./scripts/vercel-env-commands.sh --apply" 
	echo "Add --all to apply to production, preview and development: --apply --all"
	exit 0
fi

read -p "Proceed to add variables to Vercel for targets: ${TARGETS[*]}? (y/N) " CONFIRM
if [ "${CONFIRM,,}" != "y" ]; then
	echo "Aborted."
	exit 1
fi

echo "Running vercel env add commands..."
for l in "${LINES[@]}"; do
	key=$(echo "$l" | sed -E 's/^[[:space:]]*export[[:space:]]+//' | cut -d'=' -f1)
	value=$(echo "$l" | sed -E 's/^[^=]+=//')
	if [ -z "$key" ] || [ -z "$value" ]; then
		continue
	fi
	for t in "${TARGETS[@]}"; do
		echo "Adding $key to $t"
		vercel env add "$key" "$value" "$t"
	done
done

echo "All done. Verify variables with: vercel env ls"
